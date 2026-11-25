const supabaseUrl = "https://xsdkpbvvbjzvchlsdizi.supabase.co";
const supabaseAnonKey = "sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn";
// We can use the service role key if available in env, or anon key
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

async function placeLiveTestOrder() {
  console.log("=== STARTING LIVE TEST ORDER EXECUTION ===");

  const headers = {
    "apikey": supabaseAnonKey,
    "Content-Type": "application/json",
  };

  // 1. Create an auto-confirmed test user via Auth Admin API or sign in
  const testEmail = `test_gourmet_${Date.now()}@royalbengalfresh.com`;
  const testPassword = "TestPassword123!";

  console.log("Creating auto-confirmed test user:", testEmail);
  const adminRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    })
  });

  const adminJson = await adminRes.json();
  const userId = adminJson?.id;

  if (!userId) {
    console.error("Failed to create test user via admin API:", adminJson);
    return;
  }

  console.log("Created test user with ID:", userId);

  // 2. Sign in as the test user to get a valid user JWT
  const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email: testEmail, password: testPassword })
  });
  const authJson = await authRes.json();
  const userJwt = authJson?.access_token;

  if (!userJwt) {
    console.error("Failed to sign in test user:", authJson);
    return;
  }

  console.log("Obtained test user JWT successfully.");

  const authHeaders = {
    "apikey": supabaseAnonKey,
    "Authorization": `Bearer ${userJwt}`,
    "Content-Type": "application/json",
  };

  // 3. Fetch an in-stock variant
  const varRes = await fetch(`${supabaseUrl}/rest/v1/product_variants?select=id,product_id,price,stock,unit&limit=1`, {
    headers: authHeaders
  });
  const variants = await varRes.json();
  if (!variants || variants.length === 0) {
    console.error("No variants found in database:", variants);
    return;
  }
  const variant = variants[0];
  console.log("Found variant ID:", variant.id, "Product ID:", variant.product_id, "Price:", variant.price);

  // 4. Fetch product details
  const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?select=name,image_url&id=eq.${variant.product_id}`, {
    headers: authHeaders
  });
  const products = await prodRes.json();
  const product = products?.[0] || { name: "Test Fish Product", image_url: "" };

  // 5. Invoke place-order edge function
  const payload = {
    items: [{
      product_id: variant.product_id,
      variant_id: variant.id,
      product_name: product.name,
      variant_unit: variant.unit || 'pack',
      product_image: product.image_url || '',
      price: Number(variant.price || 150),
      quantity: 1,
      total_price: Number(variant.price || 150)
    }],
    details: {
      name: "Test Gourmet Customer",
      phone: "9876543210",
      lat: 17.4483,
      lng: 78.3742,
      area: "Hitech City",
      city: "Hyderabad",
      pincode: "500081",
      houseNo: "Plot 12",
      address: "Hitech City, Hyderabad, Telangana 500081"
    },
    couponCode: null,
    userId: userId,
    browserId: "test-browser-id-12345"
  };

  console.log("Invoking place-order edge function...");

  const fnRes = await fetch(`${supabaseUrl}/functions/v1/place-order`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(payload)
  });

  const fnJson = await fnRes.json();
  console.log("=== PLACE-ORDER EDGE FUNCTION RESPONSE ===");
  console.log("Status Code:", fnRes.status);
  console.log("Response Body:", JSON.stringify(fnJson, null, 2));

  if (fnRes.ok && fnJson.success) {
    console.log("SUCCESS! Test order and Razorpay order successfully created!");
    console.log("Checkout ID:", fnJson.checkoutId);
    console.log("Razorpay Order ID:", fnJson.razorpayOrderId);
  } else {
    console.error("FAILED to place test order.");
  }
}

placeLiveTestOrder();
