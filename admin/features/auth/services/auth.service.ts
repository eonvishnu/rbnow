import { getProfileRole } from '../repositories/auth.repository';

const ADMIN_ROLES = new Set(['super_admin', 'admin', 'operations_staff', 'support_agent', 'read_only']);

export async function hasAdminStaffRole(userId: string): Promise<boolean | null> {
  try {
    const role = await getProfileRole(userId);
    return role === null ? null : ADMIN_ROLES.has(role);
  } catch (error) {
    console.warn('Could not verify admin role:', error);
    return null;
  }
}
