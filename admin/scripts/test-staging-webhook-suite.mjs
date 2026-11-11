import crypto from 'crypto';

function computeHmacSha256Hex(secret, text) {
  return crypto.createHmac('sha256', secret).update(text).digest('hex');
}

async function runStagingWebhookTestSuite() {
  console.log('===================================================================================');
  console.log('         STAGING WEBHOOK CAPTURED, DUPLICATE & RETRY VERIFICATION          ');
  console.log('===================================================================================\n');

  const supabaseUrl = process.env.TEST_SUPABASE_URL;
  const anonKey = process.env.TEST_SUPABASE_ANON_KEY;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!supabaseUrl || !anonKey || !webhookSecret) {
    console.error('❌ Missing required environment variables: TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY, or RAZORPAY_WEBHOOK_SECRET.');
    process.exit(1);
  }

  // 1. Fetch Sample Catalog Variant
  const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,product_variants(id,price,stock)&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const products = await prodRes.json();
  if (!products || products.length === 0) {
    throw new Error('No products found in target test database');
  }

  const sampleProduct = products[0];
  const sampleVariant = sampleProduct.product_variants?.[0];
  if (!sampleVariant) {
    throw new Error('No product variants found for sample product');
  }

  // 2. Create Checkout Session
  const placeRes = await fetch(`${supabaseUrl}/functions/v1/place-order`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: sampleVariant.id, variant_id: sampleVariant.id, product_id: sampleProduct.id, name: sampleProduct.name, price: sampleVariant.price, qty: 1, unit: '500g' }],
      details: { name: 'Staging Webhook Tester', phone: '9876543210', area: 'Madhapur', city: 'Hyderabad', lat: 17.3607022, lng: 78.3879632 }
    })
  });

  const placeData = await placeRes.json();
  if (placeRes.status !== 200 || !placeData.checkoutId || !placeData.razorpayOrderId) {
    throw new Error(`Failed to create checkout for staging test: ${JSON.stringify(placeData)}`);
  }

  // 3. Construct Webhook Payload & Signature
  const eventId = `event_staging_${Date.now()}`;
  const mockPaymentId = `pay_staging_${Date.now()}`;
  const amountPaise = Math.round(placeData.total * 100);

  const webhookBody = JSON.stringify({
    event: 'payment.captured',
    event_id: eventId,
    payload: {
      payment: {
        entity: {
          id: mockPaymentId,
          order_id: placeData.razorpayOrderId,
          status: 'captured',
          currency: 'INR',
          amount: amountPaise
        }
      }
    }
  });

  const validWhSignature = computeHmacSha256Hex(webhookSecret, webhookBody);

  // POST 1: Initial Captured Webhook Delivery
  const whRes1 = await fetch(`${supabaseUrl}/functions/v1/razorpay-webhook`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      'x-razorpay-signature': validWhSignature,
      'x-razorpay-event-id': eventId
    },
    body: webhookBody
  });

  const whData1 = await whRes1.json();
  if (whRes1.status !== 200 || !whData1.success) {
    throw new Error(`Webhook POST 1 Failed: Expected 200 OK, got ${whRes1.status} (${JSON.stringify(whData1)})`);
  }

  // POST 2: Duplicate Event Delivery (Deduplication Check)
  const whRes2 = await fetch(`${supabaseUrl}/functions/v1/razorpay-webhook`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      'x-razorpay-signature': validWhSignature,
      'x-razorpay-event-id': eventId
    },
    body: webhookBody
  });

  const whData2 = await whRes2.json();
  if (whRes2.status !== 200 || !whData2.message?.includes('already processed')) {
    throw new Error(`Webhook POST 2 Deduplication Failed: Expected 200 OK with 'already processed', got ${whRes2.status} (${JSON.stringify(whData2)})`);
  }

  // POST 3: Retry with New Event ID on Already Converted Order (Idempotency Check)
  const retryEventId = `event_retry_${Date.now()}`;
  const retryBody = JSON.stringify({
    event: 'payment.captured',
    event_id: retryEventId,
    payload: {
      payment: {
        entity: {
          id: mockPaymentId,
          order_id: placeData.razorpayOrderId,
          status: 'captured',
          currency: 'INR',
          amount: amountPaise
        }
      }
    }
  });

  const retrySignature = computeHmacSha256Hex(webhookSecret, retryBody);

  const whRes3 = await fetch(`${supabaseUrl}/functions/v1/razorpay-webhook`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      'x-razorpay-signature': retrySignature,
      'x-razorpay-event-id': retryEventId
    },
    body: retryBody
  });

  const whData3 = await whRes3.json();
  if (whRes3.status !== 200 || whData3.alreadyConverted !== true) {
    throw new Error(`Webhook Retry Idempotency Failed: Expected 200 OK with alreadyConverted: true, got ${whRes3.status} (${JSON.stringify(whData3)})`);
  }

  console.log('✅ Staging Webhook Suite (Captured, Deduplication, Retry) Completed Successfully!');
}

runStagingWebhookTestSuite().catch((err) => {
  console.error('❌ Staging Webhook Suite Failed:', err.message);
  process.exit(1);
});
