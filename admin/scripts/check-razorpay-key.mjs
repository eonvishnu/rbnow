const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function checkRazorpayKey() {
  console.log('--- TESTING PLACE-ORDER RAZORPAY KEY ID ---');

  const res = await fetch(`${supabaseUrl}/functions/v1/place-order`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: 'test', name: 'Test Product', price: 10, qty: 1 }],
      details: { name: 'Test User', phone: '9999999999' }
    })
  });

  const data = await res.json();
  console.log('Place-Order Status:', res.status);
  console.log('Returned keyId:', data.keyId);
  console.log('Returned razorpayOrderId:', data.razorpayOrderId);
}

checkRazorpayKey();
