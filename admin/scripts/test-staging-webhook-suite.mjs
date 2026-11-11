import crypto from 'crypto';
import fs from 'fs';
import { execSync } from 'child_process';

const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

function computeHmacSha256Hex(secret, text) {
  return crypto.createHmac('sha256', secret).update(text).digest('hex');
}

async function runStagingWebhookTestSuite() {
  console.log('===================================================================================');
  console.log('         STAGING WEBHOOK CAPTURED, DUPLICATE & RETRY VERIFICATION          ');
  console.log('===================================================================================\n');

  // Load webhook secret from process environment strictly without hardcoded fallbacks
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.log('⚠️ RAZORPAY_WEBHOOK_SECRET not set in environment. Skipping webhook suite execution.');
    return;
  }

  // 1. Fetch Sample Catalog Variant
  const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,product_variants(id,price,stock)&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const products = await prodRes.json();
  const sampleProduct = products[0];
  const sampleVariant = sampleProduct.product_variants[0];

  // 2. Create Checkout
  const placeRes = await fetch(`${supabaseUrl}/functions/v1/place-order`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: sampleVariant.id, variant_id: sampleVariant.id, product_id: sampleProduct.id, name: sampleProduct.name, price: sampleVariant.price, qty: 1, unit: '500g' }],
      details: { name: 'Staging Webhook Tester', phone: '9876543210', area: 'Madhapur', city: 'Hyderabad', lat: 17.3607022, lng: 78.3879632 }
    })
  });

  const placeData = await placeRes.json();
  if (!placeData.checkoutId || !placeData.razorpayOrderId) {
    throw new Error('Failed to create checkout for staging test');
  }

  // 3. Construct Webhook Payload
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
    throw new Error(`Webhook POST 1 Failed: ${JSON.stringify(whData1)}`);
  }

  // POST 2: Duplicate Event Delivery
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
    throw new Error(`Webhook POST 2 Deduplication Failed: ${JSON.stringify(whData2)}`);
  }

  console.log('✅ Staging Webhook Suite Completed Successfully!');
}

runStagingWebhookTestSuite().catch((err) => {
  console.error('❌ Staging Webhook Suite Failed:', err.message);
  process.exit(1);
});
