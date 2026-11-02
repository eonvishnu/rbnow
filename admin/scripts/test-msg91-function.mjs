const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testMsg91() {
  console.log('--- TESTING MSG91 SMS OTP EDGE FUNCTION ---');

  const res = await fetch(`${supabaseUrl}/functions/v1/send-msg91-otp`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone: '9876543210' })
  });

  console.log('MSG91 Edge Function HTTP Status:', res.status);
  const data = await res.json();
  console.log('Response Body:', data);
}

testMsg91();
