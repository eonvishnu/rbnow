import { z } from 'zod';

export const dashboardOrderRowsSchema = z.array(z.object({
  id: z.string(),
  order_number: z.union([z.string(), z.number()]).nullable().optional(),
  total: z.coerce.number().nullable().optional(),
  status: z.string().nullable().optional(),
  order_source: z.string().nullable().optional(),
  created_at: z.string(),
  customer_name: z.string().nullable().optional(),
  customer_phone: z.string().nullable().optional(),
  user_name: z.string().nullable().optional(),
  user_phone: z.string().nullable().optional(),
  delivery_address: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
  }).nullable().optional(),
  order_items: z.array(z.object({
    quantity: z.coerce.number().nullable().optional(),
  })).nullable().optional(),
}));

export const cartStatusRowsSchema = z.array(z.object({
  id: z.string(),
  status: z.string(),
}));

export const checkoutRowsSchema = z.array(z.object({ id: z.string(), status: z.string().nullable().optional() }));
export const storeOpenSchema = z.object({ is_store_open: z.boolean() });
