const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testVerifyPayment() {
  console.log('--- TESTING VERIFY-PAYMENT EDGE FUNCTION ---');

  const res = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      checkoutId: '00000000-0000-0000-0000-000000000000',
      razorpay_order_id: 'order_test_123',
      razorpay_payment_id: 'pay_test_123',
      razorpay_signature: 'invalid_sig'
    })
  });

  console.log('Verify-Payment HTTP Status:', res.status);
  const data = await res.json();
  console.log('Verify-Payment Response:', data);
}

testVerifyPayment();
