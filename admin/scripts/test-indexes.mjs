const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testTables() {
  const checkouts = await fetch(`${supabaseUrl}/rest/v1/checkouts?select=id,status&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('checkouts table status:', checkouts.status);

  const payments = await fetch(`${supabaseUrl}/rest/v1/payments?select=id,status&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('payments table status:', payments.status);

  const checkoutItems = await fetch(`${supabaseUrl}/rest/v1/checkout_items?select=id,checkout_id&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('checkout_items table status:', checkoutItems.status);

  const webhooks = await fetch(`${supabaseUrl}/rest/v1/payment_webhook_events?select=id,event_id&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('payment_webhook_events table status:', webhooks.status);
}

testTables();
