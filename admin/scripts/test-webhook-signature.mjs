import crypto from 'crypto';

const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const secret = 'royal_bengal_wh_secret_2026';

async function testWebhookSignature() {
  console.log('--- TESTING RAZORPAY WEBHOOK WITH VALID HMAC SIGNATURE ---');

  const payload = JSON.stringify({
    event: 'payment.captured',
    event_id: `evt_test_${Date.now()}`,
    payload: {
      payment: {
        entity: {
          id: 'pay_test_wh_123',
          order_id: 'order_test_wh_123',
          amount: 10000,
          currency: 'INR',
          status: 'captured'
        }
      }
    }
  });

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');

  const res = await fetch(`${supabaseUrl}/functions/v1/razorpay-webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': signature
    },
    body: payload
  });

  console.log('Webhook Response HTTP Status (Expect 200 OK):', res.status);
  const data = await res.json();
  console.log('Webhook Response Data:', data);
}

testWebhookSignature();
