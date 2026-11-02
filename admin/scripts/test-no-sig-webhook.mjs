const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';

async function testNoSigWebhook() {
  console.log('--- TESTING WEBHOOK WITHOUT SIGNATURE HEADER ---');

  const payload = JSON.stringify({
    event: 'payment.captured',
    event_id: `evt_no_sig_${Date.now()}`,
    payload: {
      payment: {
        entity: {
          id: 'pay_no_sig_123',
          order_id: 'order_no_sig_123',
          amount: 10000,
          currency: 'INR',
          status: 'captured'
        }
      }
    }
  });

  const res = await fetch(`${supabaseUrl}/functions/v1/razorpay-webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: payload
  });

  console.log('HTTP Status Code (Expect 200 OK):', res.status);
  const data = await res.json();
  console.log('Response Body:', data);
}

testNoSigWebhook();
