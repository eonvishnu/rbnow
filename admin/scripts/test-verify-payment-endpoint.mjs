const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testEndpoint() {
  console.log('Testing verify-payment Edge Function HTTP endpoint...');

  const res = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      razorpay_order_id: 'order_test_123',
      razorpay_payment_id: 'pay_test_123',
      razorpay_signature: '0000000000000000000000000000000000000000000000000000000000000000'
    })
  });

  console.log('HTTP Status:', res.status);
  const data = await res.json();
  console.log('Response Payload:', data);
}

testEndpoint();
