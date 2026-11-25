import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://xsdkpbvvbjzvchlsdizi.supabase.co";
// Using service role for administrative test user setup
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function runTest() {
  console.log("Starting test order creation simulation...");

  // 1. Get or create test user
  const testEmail = "test_gourmet_user@royalbengalfresh.com";
  const { data: usersList, error: listErr } = await supabase.auth.admin.listUsers();

  let testUser = usersList?.users?.find(u => u.email === testEmail);

  if (!testUser) {
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: "TestPassword123!",
      email_confirm: true,
      user_metadata: { display_name: "Test Gourmet Customer" }
    });
    if (createErr) {
      console.error("Failed to create test user:", createErr);
      return;
    }
    testUser = newUser.user;
    console.log("Created test user:", testUser.id);
  } else {
    console.log("Found existing test user:", testUser.id);
  }

  // 2. Fetch a sample product variant with stock > 0
  const { data: variants, error: varErr } = await supabase
    .from("product_variants")
    .select("id, product_id, price, stock")
    .gt("stock", 0)
    .limit(1);

  if (varErr || !variants || variants.length === 0) {
    console.error("No in-stock product variants found for testing:", varErr);
    return;
  }

  const variant = variants[0];
  console.log("Selected test variant:", variant.id, "Product:", variant.product_id, "Price:", variant.price);

  // 3. Test create_pending_order RPC call directly
  const testCheckoutId = crypto.randomUUID();
  const testItems = [{
    product_id: variant.product_id,
    variant_id: variant.id,
    product_name: "Test Rohu Fish",
    variant_unit: "500 GM",
    product_image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da",
    price: Number(variant.price),
    quantity: 1,
    total_price: Number(variant.price)
  }];

  const { data: rpcData, error: rpcErr } = await supabase.rpc('create_pending_order', {
    p_checkout_id: testCheckoutId,
    p_user_id: testUser.id,
    p_customer_name: "Test Gourmet Customer",
    p_customer_phone: "9876543210",
    p_delivery_address: {
      address: "Hitech City, Hyderabad, Telangana 500081",
      lat: 17.4483,
      lng: 78.3742,
      city: "Hyderabad",
      pincode: "500081"
    },
    p_subtotal: Number(variant.price),
    p_delivery_fee: 30,
    p_discount: 0,
    p_total: Number(variant.price) + 30,
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
