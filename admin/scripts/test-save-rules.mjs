const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testSavePresetRules() {
  console.log('Testing saving 2-zone preset rules to Supabase...');

  const presetZoneRadius = 5;
  const presetZone1Subtotal = 299;
  const presetZone1Fee = 30;
  const presetZone2Subtotal = 499;
  const presetZone2Fee = 30;

  const generatedRules = [
    {
      name: `Free delivery within ${presetZoneRadius} km (orders > ₹${presetZone1Subtotal})`,
      min_distance_km: 0,
      max_distance_km: presetZoneRadius,
      min_order_amount: presetZone1Subtotal,
      max_order_amount: null,
      min_checkout_subtotal: 0,
      fee_type: 'free',
      fee_amount: 0,
      priority: 1,
      is_active: true
    },
    {
      name: `Standard fee within ${presetZoneRadius} km (orders <= ₹${presetZone1Subtotal})`,
      min_distance_km: 0,
      max_distance_km: presetZoneRadius,
      min_order_amount: 0,
      max_order_amount: presetZone1Subtotal,
      min_checkout_subtotal: 0,
      fee_type: 'fixed',
      fee_amount: presetZone1Fee,
      priority: 2,
      is_active: true
    },
    {
      name: `Free delivery beyond ${presetZoneRadius} km (orders > ₹${presetZone2Subtotal})`,
      min_distance_km: presetZoneRadius,
      max_distance_km: null,
      min_order_amount: presetZone2Subtotal,
      max_order_amount: null,
      min_checkout_subtotal: 0,
      fee_type: 'free',
      fee_amount: 0,
      priority: 3,
      is_active: true
    },
    {
      name: `Standard fee beyond ${presetZoneRadius} km (orders <= ₹${presetZone2Subtotal})`,
      min_distance_km: presetZoneRadius,
      max_distance_km: null,
      min_order_amount: 0,
      max_order_amount: presetZone2Subtotal,
      min_checkout_subtotal: 0,
      fee_type: 'fixed',
      fee_amount: presetZone2Fee,
      priority: 4,
      is_active: true
    }
  ];

  // DELETE EXISING
  await fetch(`${supabaseUrl}/rest/v1/delivery_fee_rules?id=neq.00000000-0000-0000-0000-000000000000`, {
    method: 'DELETE',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });

  // INSERT GENERATED
  const insRes = await fetch(`${supabaseUrl}/rest/v1/delivery_fee_rules`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(generatedRules)
  });

  console.log('Insert status:', insRes.status);
  const rows = await insRes.json();
  console.log('✅ Generated non-overlapping rules in Supabase:', rows);
}

testSavePresetRules();
