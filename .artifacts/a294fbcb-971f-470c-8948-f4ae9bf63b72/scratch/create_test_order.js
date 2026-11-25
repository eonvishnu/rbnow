const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://xsdkpbvvbjzvchlsdizi.supabase.co";
// We can test using anon key or service role if available in process.env
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function runTest() {
  console.log("Starting test order creation simulation via Node...");

  // 1. Fetch a sample product variant with stock > 0
  const { data: variants, error: varErr } = await supabase
    .from("product_variants")
    .select("id, product_id, price, stock")
    .limit(1);

  if (varErr || !variants || variants.length === 0) {
    console.error("No product variants found for testing:", varErr);
    return;
  }

  const variant = variants[0];
  console.log("Selected test variant:", variant.id, "Product:", variant.product_id, "Price:", variant.price);

  // 2. Fetch an existing user or test auth user ID
  const { data: users, error: userErr } = await supabase.from("orders").select("user_id").limit(1);
  const testUserId = users?.[0]?.user_id || "9b38218b-9b89-448d-8d30-9b170d4ab375";
  console.log("Using test user ID:", testUserId);

  // 3. Test create_pending_order RPC call directly
  const testCheckoutId = '00000000-0000-0000-0000-000000000001';
  const testItems = [{
    product_id: variant.product_id,
    variant_id: variant.id,
    product_name: "Test Rohu Fish",
    variant_unit: "500 GM",
    product_image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da",
    price: Number(variant.price || 100),
    quantity: 1,
    total_price: Number(variant.price || 100)
  }];

  const { data: rpcData, error: rpcErr } = await supabase.rpc('create_pending_order', {
    p_checkout_id: testCheckoutId,
    p_user_id: testUserId,
    p_customer_name: "Test Gourmet Customer",
    p_customer_phone: "9876543210",
    p_delivery_address: {
      address: "Hitech City, Hyderabad, Telangana 500081",
      lat: 17.4483,
      lng: 78.3742,
      city: "Hyderabad",
      pincode: "500081"
    },
    p_subtotal: Number(variant.price || 100),
    p_delivery_fee: 30,
    p_discount: 0,
    p_total: Number(variant.price || 100) + 30,
    p_items: testItems
  });

  console.log("create_pending_order RPC Result:", JSON.stringify(rpcData, null, 2));
  if (rpcErr) {
    console.error("RPC Error:", rpcErr);
  } else if (rpcData?.success) {
    console.log("SUCCESS! Test order created with ID:", rpcData.order?.id);
  }
}

runTest();
