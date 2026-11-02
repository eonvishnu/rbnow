const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function listAllTables() {
  console.log('--- LISTING ALL SUPABASE PUBLIC TABLES ---');

  const tables = [
    'profiles',
    'categories',
    'products',
    'product_variants',
    'discounts',
    'discount_variants',
    'coupons',
    'coupon_usages',
    'preorder_campaigns',
    'store_settings',
    'delivery_settings',
    'delivery_fee_rules',
    'carts',
    'cart_items',
    'checkouts',
    'checkout_items',
    'payments',
    'orders',
    'order_items',
    'order_status_history',
    'refunds',
    'payment_webhook_events',
    'payment_reconciliation_events',
    'payment_gateways',
    'addresses',
    'banners'
  ];

  for (const t of tables) {
    const res = await fetch(`${supabaseUrl}/rest/v1/${t}?select=*&limit=1`, {
      headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
    });
    console.log(`Table '${t}': HTTP ${res.status}`);
  }
}

listAllTables();
