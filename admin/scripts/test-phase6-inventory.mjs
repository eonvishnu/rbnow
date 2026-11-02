import fs from 'fs';
import { execSync } from 'child_process';

const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function runInventoryTests() {
  console.log('====================================================');
  console.log('PHASE 6 TEST 3: INVENTORY DECREMENT & STOCK EXCEPTION');
  console.log('====================================================');

  let passedCount = 0;
  let failedCount = 0;

  // 1. Fetch product variant with stock
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

  const initialStock = sampleVariant.stock || 50;

  // 2. Create checkout
  const placeRes = await fetch(`${supabaseUrl}/functions/v1/place-order`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [{ id: sampleVariant.id, name: sampleProduct.name, price: sampleVariant.price, qty: 1 }],
      details: { name: 'Stock Test Customer', phone: '9876543210', area: 'Madhapur', city: 'Hyderabad' }
    })
  });

  const placeData = await placeRes.json();
  if (!placeData?.checkoutId || !placeData?.paymentId) {
    console.error('❌ FAIL: Failed to create checkout:', placeData);
    return;
  }

  const checkoutId = placeData.checkoutId;
  const paymentId = placeData.paymentId;

  // Execute conversion
  const patchSql = `UPDATE public.payments SET status = 'captured', razorpay_payment_id = 'pay_stock_${Date.now()}' WHERE id = '${paymentId}';`;
  const convSql = `SELECT public.convert_checkout_to_order('${checkoutId}'::uuid, '${paymentId}'::uuid) as result;`;

  fs.writeFileSync('/tmp/test_stock_conv.sql', patchSql + '\n' + convSql);

  let convOut = '';
  try {
    convOut = execSync(`npx supabase db query --linked --file /tmp/test_stock_conv.sql`, { cwd: '/home/vishnu/ecom' }).toString();
    console.log('RPC Conversion Output:', convOut);
  } catch (err) {
    console.error('RPC Test Error:', err.message);
  }

  // 3. Verify variant stock decremented
  const verifyRes = await fetch(`${supabaseUrl}/rest/v1/product_variants?id=eq.${sampleVariant.id}&select=stock`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const verifyData = await verifyRes.json();
  const updatedStock = verifyData?.[0]?.stock;

  console.log(`Initial Stock: ${initialStock}, Updated Stock: ${updatedStock}`);

  if (updatedStock === initialStock - 1) {
    console.log('✅ PASS 1. Atomic Stock Decremented Exactly by Quantity (stock = initialStock - 1)');
    passedCount++;
  } else {
    console.error('❌ FAIL 1. Stock Decrement Mismatch!');
    failedCount++;
  }

  console.log(`\nInventory Test Summary: ${passedCount} PASSED, ${failedCount} FAILED\n`);
}

runInventoryTests();
