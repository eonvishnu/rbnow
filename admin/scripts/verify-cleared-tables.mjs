const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function verifyCounts() {
  console.log('--- VERIFYING CLEARED TABLE ROW COUNTS ---');

  const tables = [
    'orders',
    'order_items',
    'order_status_history',
    'checkouts',
    'checkout_items',
    'payments',
    'payment_webhook_events',
    'payment_reconciliation_events',
    'refunds',
    'carts',
    'cart_items',
    'coupon_usages'
  ];

  for (const t of tables) {
    const res = await fetch(`${supabaseUrl}/rest/v1/${t}?select=id`, {
      headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
    });
    const data = await res.json();
    console.log(`Table '${t}': Row Count = ${Array.isArray(data) ? data.length : 0}`);
  }
}

verifyCounts();
