import fs from 'fs';
import { execSync } from 'child_process';

const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function verifyRPC() {
  console.log('--- VERIFYING PHASE 3 ATOMIC CONVERSION RPC (convert_checkout_to_order) ---');

  // 1. Fetch sample product variant
  const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,product_variants(id,price,stock)&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const products = await prodRes.json();
  const sampleProduct = products?.[0];
  const sampleVariant = sampleProduct?.product_variants?.[0];

  // 2. Create checkout via place-order Edge Function
  const placeRes = await fetch(`${supabaseUrl}/functions/v1/place-order`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: sampleVariant.id, variant_id: sampleVariant.id, product_id: sampleProduct.id, name: sampleProduct.name, price: sampleVariant.price, qty: 1 }],
      details: { name: 'Phase 3 Verification Customer', phone: '9876543210', area: 'Madhapur', city: 'Hyderabad' }
    })
  });

  const placeData = await placeRes.json();
  console.log('1. Checkout Created:', placeRes.status, 'checkoutId:', placeData.checkoutId, 'paymentId:', placeData.paymentId);

  if (placeData.checkoutId && placeData.paymentId) {
    const patchSql = `UPDATE public.payments SET status = 'captured', razorpay_payment_id = 'pay_verify_${Date.now()}' WHERE id = '${placeData.paymentId}';`;
    const convSql = `SELECT public.convert_checkout_to_order('${placeData.checkoutId}'::uuid, '${placeData.paymentId}'::uuid) as result;`;

    fs.writeFileSync('/tmp/verify_rpc.sql', patchSql + '\n' + convSql);

    const convOut = execSync(`npx supabase db query --remote --yes --file /tmp/verify_rpc.sql`, { cwd: '/home/vishnu/ecom' }).toString();
    console.log('2. Atomic Order Conversion Result:');
    console.log(convOut);

    const retryOut = execSync(`npx supabase db query --remote --yes --file /tmp/verify_rpc.sql`, { cwd: '/home/vishnu/ecom' }).toString();
    console.log('3. Idempotent Retry Result:');
    console.log(retryOut);
  }
}

verifyRPC();
