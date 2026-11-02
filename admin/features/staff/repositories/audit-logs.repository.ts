import { supabase } from '@/lib/supabase';

export async function logAdminAction(input: {
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const adminId = sessionData?.session?.user?.id || null;

    await supabase.from('admin_audit_logs').insert({
      admin_id: adminId,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId,
      details: input.details || {},
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Error recording admin audit log:', err);
  }
}
