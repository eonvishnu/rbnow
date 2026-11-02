import { supabase } from '@/lib/supabase';
import { staffAuditLogSchema, staffProfileSchema } from '../schemas/staff.schema';
import type { StaffRole } from '../types/staff';

const STAFF_ROLES: StaffRole[] = ['super_admin', 'admin', 'operations_staff', 'support_agent', 'read_only'];

export async function listStaffAndAuditLogs() {
  const [profilesResult, auditResult] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('admin_audit_logs').select('*').order('created_at', { ascending: false }).limit(20),
  ]);

  if (profilesResult.error) {
    console.error('Error fetching staff profiles:', profilesResult.error);
    throw profilesResult.error;
  }
  if (auditResult.error) {
    console.error('Error fetching audit logs:', auditResult.error);
    throw auditResult.error;
  }

  const profilesMap = new Map<string, { display_name: string | null }>();
  (profilesResult.data || []).forEach((p: any) => {
    if (p.id) {
      profilesMap.set(p.id, { display_name: p.display_name || p.email || 'Staff' });
    }
  });

  const staffProfiles = (profilesResult.data || []).filter((p: any) =>
    STAFF_ROLES.includes(p.role as StaffRole)
  );

  const logsWithProfiles = (auditResult.data || []).map((log: any) => ({
    ...log,
    profiles: log.admin_id ? (profilesMap.get(log.admin_id) || { display_name: 'Staff Member' }) : { display_name: 'System' },
  }));

  return {
    staff: staffProfileSchema.array().parse(staffProfiles),
    auditLogs: staffAuditLogSchema.array().parse(logsWithProfiles),
  };
}

export async function updateStaffProfileRole(userId: string, role: StaffRole) {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  if (error) throw error;
}

export async function insertStaffRoleAudit(adminId: string, userId: string, role: StaffRole) {
  const { error } = await supabase.from('admin_audit_logs').insert({
    admin_id: adminId,
    action: `Updated role of staff member to '${role}'`,
    entity_type: 'staff_profile',
    entity_id: userId,
  });
  if (error) throw error;
}
