import { execSync } from 'child_process';
import fs from 'fs';

const sql = `
SELECT id, checkout_id, razorpay_order_id, razorpay_payment_id, amount, currency, status, created_at, updated_at
FROM public.payments
WHERE id = 'f678ef20-99be-4eb4-82f5-a9aba97f5756';
`;

fs.writeFileSync('/tmp/check_payment_clean.sql', sql);

try {
  const out = execSync(`npx supabase db query --linked --file /tmp/check_payment_clean.sql`, { cwd: '/home/vishnu/ecom' }).toString();
  console.log('Clean Payments Table Row:');
  console.log(out);
} catch (err) {
  console.error('Error running payment query:', err.message);
}
