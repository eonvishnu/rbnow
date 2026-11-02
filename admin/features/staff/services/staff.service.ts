import { insertStaffRoleAudit, listStaffAndAuditLogs, updateStaffProfileRole } from '../repositories/staff.repository';
import { staffRoleSchema } from '../schemas/staff.schema';

export { listStaffAndAuditLogs };

export async function changeStaffRole(actorRole: string | undefined, actorId: string | undefined, userId: string, roleInput: string) {
  if (actorRole !== 'super_admin') throw new Error('Only Super Admins can modify staff role permissions.');
  if (!actorId) throw new Error('Your staff session could not be verified.');
  const result = staffRoleSchema.safeParse(roleInput);
  if (!result.success) throw new Error('Choose a valid staff role.');
  await updateStaffProfileRole(userId, result.data);
  await insertStaffRoleAudit(actorId, userId, result.data);
}
