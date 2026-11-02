import fs from 'fs';
import { execSync } from 'child_process';

const testPolicySql = `
DROP POLICY IF EXISTS "Customers can view own payments" ON public.payments;
CREATE POLICY "Customers can view own payments"
  ON public.payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.checkouts c WHERE c.id = checkout_id AND c.user_id = auth.uid()));
`;

fs.writeFileSync('/tmp/test_rls.sql', testPolicySql);

try {
  const out = execSync(`npx supabase db query --linked --file /tmp/test_rls.sql`, { cwd: '/home/vishnu/ecom' }).toString();
  console.log('Policy test OK:', out);
} catch (err) {
  console.error('Policy test error:', err.stdout?.toString() || err.message);
}
