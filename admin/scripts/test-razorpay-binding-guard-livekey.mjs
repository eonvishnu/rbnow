import crypto from 'crypto';

const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

function computeHmacSha256Hex(secret, text) {
  return crypto.createHmac('sha256', secret).update(text).digest('hex');
}

async function runLiveKeyBindingTest() {
  console.log('===================================================================================');
  console.log('    TESTING PRECISE BINDING CHECK WITH VALID HMAC AND UNLINKED RAZORPAY ORDER    ');
  console.log('===================================================================================\n');

  const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
  if (!rzpSecret) {
    console.log('⚠️ RAZORPAY_KEY_SECRET not set in environment. Skipping live key binding test.');
    return;
  }

  // 1. Fetch Sample Catalog Variant
  const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,product_variants(id,price,stock)&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const products = await prodRes.json();
  const sampleProduct = products[0];
  const sampleVariant = sampleProduct.product_variants[0];

  // 2. Create Real Checkout via place-order Edge Function
  const placeRes = await fetch(`${supabaseUrl}/functions/v1/place-order`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: sampleVariant.id, variant_id: sampleVariant.id, product_id: sampleProduct.id, name: sampleProduct.name, price: sampleVariant.price, qty: 1, unit: '500g' }],
      details: { name: 'Live HMAC Binding Tester', phone: '9876543210', area: 'Madhapur', city: 'Hyderabad', lat: 17.3607022, lng: 78.3879632 }
    })
  });

  const placeData = await placeRes.json();
  if (!placeData.checkoutId || !placeData.razorpayOrderId) {
    throw new Error('Failed to create checkout for binding test');
  }

  // 3. Compute Valid HMAC for an UNLINKED Razorpay Order ID
  const unlinkedOrderId = 'order_UNLINKED_RAZORPAY_99999';
  const unlinkedPaymentId = 'pay_UNLINKED_RAZORPAY_99999';
  const validHmac = computeHmacSha256Hex(rzpSecret, `${unlinkedOrderId}|${unlinkedPaymentId}`);

  // 4. Test verify-payment with valid HMAC but unlinked order
  const verifyRes = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      checkoutId: placeData.checkoutId,
      razorpay_order_id: unlinkedOrderId,
      razorpay_payment_id: unlinkedPaymentId,
      razorpay_signature: validHmac
    })
  });

  const verifyData = await verifyRes.json();
  if (verifyRes.status !== 400 || !verifyData.error?.includes('not linked')) {
    throw new Error(`Binding Guard Test Failed: Expected 400 with 'not linked', got ${verifyRes.status} (${JSON.stringify(verifyData)})`);
  }

  console.log('✅ Unlinked Payment Binding Guard Test Passed cleanly!');
}

runLiveKeyBindingTest().catch((err) => {
  console.error('❌ Live Key Binding Test Failed:', err.message);
  process.exit(1);
});
