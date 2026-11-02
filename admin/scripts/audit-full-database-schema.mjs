import { execSync } from 'child_process';
import fs from 'fs';

const auditSql = `
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
`;

fs.writeFileSync('/tmp/full_schema_audit.sql', auditSql);

try {
  const out = execSync(`npx supabase db query --linked --file /tmp/full_schema_audit.sql`, { cwd: '/home/vishnu/ecom' }).toString();
  console.log(out);
} catch (err) {
  console.error('Audit Error:', err.message);
}
