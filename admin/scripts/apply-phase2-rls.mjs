import fs from 'fs';
import { execSync } from 'child_process';

const sqlContent = fs.readFileSync('/home/vishnu/ecom/supabase/migrations/20261102000000_phase2_commerce_rls_policies.sql', 'utf8');

// Split SQL statements cleanly by semicolon
const statements = sqlContent
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Found ${statements.length} RLS DDL statements to execute.`);

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  if (!stmt || stmt.startsWith('COMMENT ON')) continue;

  const tmpFile = `/tmp/rls_stmt_${i}.sql`;
  fs.writeFileSync(tmpFile, stmt + ';');

  try {
    const out = execSync(`npx supabase db query --linked --file ${tmpFile}`, { cwd: '/home/vishnu/ecom' }).toString();
    console.log(`Statement ${i + 1}/${statements.length} OK: ${stmt.substring(0, 45)}...`);
  } catch (err) {
    console.error(`Statement ${i + 1} Error:`, err.stdout?.toString() || err.message);
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
}
