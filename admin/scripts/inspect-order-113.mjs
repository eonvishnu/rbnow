import { execSync } from 'child_process';

const sql = `
SELECT
    o.id AS order_uuid,
    o.order_number,
    o.status AS order_status,
    o.payment_id,
    p.status AS payment_record_status,
    p.razorpay_order_id AS payment_razorpay_order_id,
    p.razorpay_payment_id AS payment_razorpay_payment_id,
    p.amount,
    p.currency
FROM public.orders o
LEFT JOIN public.payments p
    ON p.id = o.payment_id
ORDER BY o.created_at DESC
LIMIT 5;
`;

import fs from 'fs';
fs.writeFileSync('/tmp/check_order_113.sql', sql);

try {
  const out = execSync(`npx supabase db query --linked --file /tmp/check_order_113.sql`, { cwd: '/home/vishnu/ecom' }).toString();
  console.log('Order & Payment Join Query Result:');
  console.log(out);
} catch (err) {
  console.error('Error running join query:', err.message);
}
