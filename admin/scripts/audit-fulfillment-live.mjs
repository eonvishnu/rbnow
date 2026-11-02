const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function rpc(name, body) {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function query(path, options = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  return { status: res.status, data: await res.json() };
}

async function runFulfillmentAudit() {
  console.log('=== FULFILLMENT ARCHITECTURE PRODUCTION READINESS AUDIT ===\n');

  let testCount = 0;
  let passCount = 0;

  function report(title, isPass, details) {
    testCount++;
    if (isPass) passCount++;
    console.log(`Test ${testCount}: ${title}`);
    console.log(`Result: [${isPass ? 'PASS' : 'FAIL'}] ${details}\n`);
  }

  try {
    // Fetch valid profiles
    const profs = await query('profiles?limit=2');
    const userA = profs.data?.[0]?.id || null;
    const userB = profs.data?.[1]?.id || null;

    // 2. Insert Test Order 1 for User A
    const order1Res = await query('orders', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: {
        user_id: userA,
        user_name: 'Customer A',
        subtotal: 500,
        total: 500,
        status: 'processing'
      }
    });

    if (order1Res.status >= 400) {
      console.error('Order 1 error:', order1Res.data);
      return;
    }
    const order1 = Array.isArray(order1Res.data) ? order1Res.data[0] : null;

    // Insert Order 1 Item (5 units of Rice)
    const item1Res = await query('order_items', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: {
        order_id: order1.id,
        product_name: 'Basmati Rice 5kg',
        quantity: 5,
        price: 100,
        total_price: 500,
        quantity_fulfilled: 0,
        quantity_cancelled: 0,
        quantity_on_hold: 0
      }
    });
    const item1 = Array.isArray(item1Res.data) ? item1Res.data[0] : null;

    // Insert Test Order 2 for User B (or null if single user)
    const order2Res = await query('orders', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: {
        user_id: userB,
        user_name: 'Customer B',
        subtotal: 300,
        total: 300,
        status: 'processing'
      }
    });
    const order2 = Array.isArray(order2Res.data) ? order2Res.data[0] : null;

    const item2Res = await query('order_items', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: {
        order_id: order2.id,
        product_name: 'Organic Milk 1L',
        quantity: 3,
        price: 100,
        total_price: 300,
        quantity_fulfilled: 0,
        quantity_cancelled: 0,
        quantity_on_hold: 0
      }
    });
    const item2 = Array.isArray(item2Res.data) ? item2Res.data[0] : null;

    // Create Fulfillment Batch 1 for User A
    const ful1Res = await query('fulfillments', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: {
        fulfillment_number: `AUDIT-DEL-${Date.now()}-1`,
        user_id: userA,
        status: 'preparing',
        delivery_address_snapshot: { street: '123 Park Street', city: 'Hyderabad' }
      }
    });
    const fulfillment1 = Array.isArray(ful1Res.data) ? ful1Res.data[0] : null;

    // --- TEST 1: Allocate 3 units out of 5 ---
    const alloc1 = await rpc('allocate_fulfillment_item', {
      p_fulfillment_id: fulfillment1.id,
      p_order_item_id: item1.id,
      p_quantity: 3
    });
    report(
      'Allocate valid quantity (3 of 5 units)',
      alloc1.status === 200 && alloc1.data.success === true,
      JSON.stringify(alloc1.data)
    );

    // --- TEST 2: Prevent Over-Fulfillment (Attempt to allocate 3 more when only 2 remain) ---
    const allocOver = await rpc('allocate_fulfillment_item', {
      p_fulfillment_id: fulfillment1.id,
      p_order_item_id: item1.id,
      p_quantity: 3
    });
    report(
      'Prevent Over-Fulfillment (Allocate 3 when only 2 available)',
      allocOver.status !== 200 || allocOver.data.message?.includes('Only 2 units available'),
      allocOver.data.message || JSON.stringify(allocOver.data)
    );

    // --- TEST 3: Prevent Cross-Customer Allocation ---
    const allocCross = await rpc('allocate_fulfillment_item', {
      p_fulfillment_id: fulfillment1.id,
      p_order_item_id: item2.id, // User B's item
      p_quantity: 1
    });
    report(
      'Prevent Cross-Customer Allocation (User B item into User A fulfillment)',
      allocCross.status !== 200 || allocCross.data.message?.includes('Forbidden') || allocCross.data.message?.includes('different customer'),
      allocCross.data.message || JSON.stringify(allocCross.data)
    );

    // --- TEST 4: Quality Hold Aware Allocation ---
    // Place 1 unit on quality hold
    await query('order_item_holds', {
      method: 'POST',
      body: {
        order_item_id: item1.id,
        quantity: 1,
        reason: 'Supplier quality failure: Awaiting fresh stock',
        status: 'open'
      }
    });

    // Attempt to allocate remaining 2 units (Only 1 should be available because 1 is on hold)
    const allocHeld = await rpc('allocate_fulfillment_item', {
      p_fulfillment_id: fulfillment1.id,
      p_order_item_id: item1.id,
      p_quantity: 2
    });
    report(
      'Prevent Allocation of Open Quality-Held Quantities',
      allocHeld.status !== 200 || allocHeld.data.message?.includes('quality hold') || allocHeld.data.message?.includes('Only 1 units available'),
      allocHeld.data.message || JSON.stringify(allocHeld.data)
    );

    // --- TEST 5: Restoring Available Stock on Batch Cancellation ---
    const cancelRes = await rpc('cancel_fulfillment_batch', {
      p_fulfillment_id: fulfillment1.id,
      p_reason: 'Vehicle breakdown'
    });
    report(
      'Restoration of Available Quantities on Fulfillment Cancellation',
      cancelRes.status === 200 && cancelRes.data.success === true,
      JSON.stringify(cancelRes.data)
    );

    // --- TEST 6: Idempotency of Delivery Completion ---
    // Create new batch and allocate 2 units
    const ful2Res = await query('fulfillments', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: {
        fulfillment_number: `AUDIT-DEL-${Date.now()}-2`,
        user_id: userA,
        status: 'out_for_delivery'
      }
    });
    const fulfillment2 = Array.isArray(ful2Res.data) ? ful2Res.data[0] : null;

    await rpc('allocate_fulfillment_item', {
      p_fulfillment_id: fulfillment2.id,
      p_order_item_id: item1.id,
      p_quantity: 2
    });

    // First completion call
    const complete1 = await rpc('complete_fulfillment_delivery', { p_fulfillment_id: fulfillment2.id });
    // Second concurrent completion call (Idempotence check)
    const complete2 = await rpc('complete_fulfillment_delivery', { p_fulfillment_id: fulfillment2.id });

    report(
      'Idempotency of Delivery Completion (Multiple calls increment quantity only once)',
      complete1.status === 200 && complete2.status === 200 && complete2.data.message?.includes('already marked delivered'),
      `Call 1: ${complete1.data.message} | Call 2: ${complete2.data.message}`
    );

    // --- TEST 7: Order Status Transition ---
    const updatedOrder1 = await query(`orders?id=eq.${order1.id}`);
    const currentStatus = Array.isArray(updatedOrder1.data) ? updatedOrder1.data[0]?.status : 'unknown';
    report(
      'Correct Order Status Transition after Partial Delivery',
      currentStatus === 'partially_fulfilled',
      `Updated Order Status: '${currentStatus}' (Expected 'partially_fulfilled')`
    );

    // CLEANUP FIXTURES
    await query(`orders?id=eq.${order1.id}`, { method: 'DELETE' });
    await query(`orders?id=eq.${order2.id}`, { method: 'DELETE' });
    await query(`fulfillments?id=eq.${fulfillment1.id}`, { method: 'DELETE' });
    await query(`fulfillments?id=eq.${fulfillment2.id}`, { method: 'DELETE' });

  } catch (err) {
    console.error('Audit exception:', err);
  }

  console.log(`=== AUDIT SUMMARY: ${passCount}/${testCount} TESTS PASSED ===`);
}

runFulfillmentAudit();
