const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';

async function testUnsignedWebhook() {
  console.log('--- TESTING UNSIGNED WEBHOOK (NO SECRET SET) ---');

  const payload = JSON.stringify({
    event: 'payment.captured',
    event_id: `evt_unsigned_${Date.now()}`,
    payload: {
      payment: {
        entity: {
          id: 'pay_unsigned_123',
          order_id: 'order_unsigned_123',
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

  console.log('Unsigned Webhook Response HTTP Status:', res.status);
  const data = await res.json();
  console.log('Response Data:', data);
}

testUnsignedWebhook();
