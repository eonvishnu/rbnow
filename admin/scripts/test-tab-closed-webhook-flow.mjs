import crypto from 'crypto';
import fs from 'fs';
import { execSync } from 'child_process';

const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';
const webhookSecret = 'royal_bengal_wh_secret_2026';

async function testTabClosedWebhookFlow() {
  console.log('====================================================');
  console.log('TESTING TAB CLOSED SCENARIO (WEBHOOK-ONLY ORDER CONVERSION)');
  console.log('====================================================');

  // 1. Fetch real product variant
  const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,product_variants(id,price,stock)&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const products = await prodRes.json();
  const sampleProduct = products?.[0];
  const sampleVariant = sampleProduct?.product_variants?.[0];

  if (!sampleProduct || !sampleVariant) {
    console.error('❌ FAIL: No sample product variant found.');
    return;
  }

  // 2. Customer clicks "Place Order & Pay" -> place-order creates checkout
  const placeRes = await fetch(`${supabaseUrl}/functions/v1/place-order`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [{ id: sampleVariant.id, name: sampleProduct.name, price: sampleVariant.price, qty: 1 }],
      details: { name: 'Tab Closed Customer', phone: '9123456789', area: 'Madhapur', city: 'Hyderabad' }
    })
  });

  const placeData = await placeRes.json();
  console.log('1. Checkout Created:', placeRes.status, 'checkoutId:', placeData?.checkoutId, 'razorpayOrderId:', placeData?.razorpayOrderId);

  if (!placeData?.checkoutId || !placeData?.razorpayOrderId) {
    console.error('❌ FAIL: Failed to create checkout via place-order:', placeData);
    return;
  }

  // 3. SIMULATE TAB CLOSED BEFORE CLIENT VERIFICATION: Razorpay sends payment.captured webhook
  const fakePaymentId = `pay_tab_closed_${Date.now()}`;
  const amountPaise = Math.round(Number(placeData.total) * 100);

  const webhookPayload = JSON.stringify({
    event: 'payment.captured',
    event_id: `evt_tab_closed_${Date.now()}`,
    payload: {
      payment: {
        entity: {
          id: fakePaymentId,
          order_id: placeData.razorpayOrderId,
          amount: amountPaise,
          currency: 'INR',
          status: 'captured'
        }
      }
    }
  });

  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(webhookPayload);
  const signature = hmac.digest('hex');

  console.log('2. Customer closes browser tab. Simulating Razorpay Webhook delivery...');
  const webhookRes = await fetch(`${supabaseUrl}/functions/v1/razorpay-webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': signature
    },
    body: webhookPayload
  });

  const webhookData = await webhookRes.json();
  console.log('3. Webhook Delivery Response Status:', webhookRes.status, webhookData);

  // 4. Verify order was created in database using SQL Query
  const checkSql = `
    SELECT id, order_number, status, total FROM public.orders WHERE checkout_id = '${placeData.checkoutId}'::uuid;
  `;
  fs.writeFileSync('/tmp/check_wh_order.sql', checkSql);

  const sqlOut = execSync(`npx supabase db query --linked --file /tmp/check_wh_order.sql`, { cwd: '/home/vishnu/ecom' }).toString();
  console.log('4. Database Order Status for Closed-Tab Checkout:');
  console.log(sqlOut);

  if (sqlOut.includes('confirmed')) {
    console.log(`\n🎉 SUCCESS! Order was automatically created and confirmed via Razorpay Webhook when tab was closed!`);
  } else {
    console.error('\n❌ FAIL: Webhook failed to automatically convert order.');
  }
}

testTabClosedWebhookFlow();
