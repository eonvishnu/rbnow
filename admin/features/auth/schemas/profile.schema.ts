import { z } from 'zod';

export const adminProfileSchema = z.object({
  id: z.string(),
  display_name: z.string().nullable(),
  phone_number: z.string().nullable(),
  role: z.string().nullable(),
  is_verified: z.boolean().nullable(),
});
