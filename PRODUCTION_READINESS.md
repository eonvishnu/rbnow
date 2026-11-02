# Production release checklist

## Supabase

- Apply `supabase/migrations/20261029_production_hardening.sql` to the existing database. For a new database, use `supabase/schema.sql`.
- Deploy `place-order`, `verify-payment`, and `razorpay-webhook` from `supabase/functions/`.
- Confirm the project has its standard `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` Edge Function secrets. Never place the service-role key in a `NEXT_PUBLIC_*` variable or browser app.
- Set production `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` as Edge Function secrets.
- Set Razorpay's webhook URL to the deployed `razorpay-webhook` endpoint and subscribe to captured and failed payment events. The checked-in Supabase config disables JWT validation for this webhook only; HMAC validation is mandatory in the handler.
- Verify the configured store coordinates, minimum order amount, free-delivery threshold, and per-kilometer fee in `store_settings`.

## Storefront build and hosting

- Build `website/` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and a live `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
- Confirm Firebase Hosting deploys `website/out`. The source blocks the test Razorpay key in production checkout.
- Confirm Firebase Auth authorized domains and redirect URLs include the storefront domain.

## Admin build and hosting

- Build `admin/` with the same public Supabase URL and anon key.
- Deploy the generated `admin/out` with `firebase deploy --only hosting:admin`. The `admin` target maps to Firebase Hosting site `adminrbnowin` (`adminrbnowin.web.app`).
- Add the admin domain to Supabase Auth authorized domains and redirect URLs.
- Promote the first administrator through a trusted database operation. Public signup always assigns the customer role; the staff UI does not support self-service privilege elevation.

## Secret rotation

- The local environment previously contained server-only payment credentials and was visible during this work. Rotate any Razorpay secret that was reused outside the test account, and use fresh production credentials in the deployment secret manager.
- Keep only public build-time settings in client-facing environment files. Keep service-role and payment secrets in server-side secret storage.
