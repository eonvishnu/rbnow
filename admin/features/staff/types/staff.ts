export type StaffRole = 'super_admin' | 'admin' | 'operations_staff' | 'support_agent' | 'read_only' | 'customer';

export interface StaffProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  role: StaffRole | string | null;
  created_at: string;
}

export interface StaffAuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
  profiles: { display_name: string | null } | null;
}
