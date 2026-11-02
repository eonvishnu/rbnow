import { z } from 'zod';

export const staffProfileSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
  display_name: z.string().nullable(),
  role: z.string().nullable(),
  created_at: z.string(),
});

export const staffAuditLogSchema = z.object({
  id: z.string(),
  admin_id: z.string().nullable(),
  action: z.string(),
  entity_type: z.string().nullable(),
  entity_id: z.string().nullable(),
  created_at: z.string(),
  profiles: z.union([
    z.object({ display_name: z.string().nullable() }),
    z.array(z.object({ display_name: z.string().nullable() })).transform((rows) => rows[0] ?? null),
  ]).nullable(),
});

export const staffRoleSchema = z.enum([
  'super_admin',
  'admin',
  'operations_staff',
  'support_agent',
  'read_only',
  'customer',
]);
