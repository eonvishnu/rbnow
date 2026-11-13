import { z } from 'zod';

export const customerProfilesSchema = z.array(z.object({
  id: z.string(),
  display_name: z.string().nullable(),
  email: z.string().nullable(),
  phone_number: z.string().nullable(),
  created_at: z.string().nullable(),
  role: z.string().nullable(),
}));

export const customerOrderSummariesSchema = z.array(z.object({
  id: z.string(),
  user_id: z.string().nullable(),
  total: z.coerce.number().nullable(),
  status: z.string().nullable(),
  payment_status: z.string().nullable().optional(),
  created_at: z.string(),
}));

export const customerOrdersSchema = z.array(z.object({
  id: z.string(),
  order_number: z.union([z.string(), z.number()]).nullable(),
  total: z.coerce.number().nullable(),
  status: z.string().nullable(),
  created_at: z.string(),
  order_items: z.array(z.object({
    product_name: z.string(),
    variant_unit: z.string().nullable(),
    quantity: z.coerce.number(),
    total_price: z.coerce.number().nullable(),
  })).nullable(),
}));
