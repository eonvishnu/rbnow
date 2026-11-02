import { z } from 'zod';

export const cartLineItemSchema = z.object({
  id: z.string(),
  product_id: z.string().optional(),
  name: z.string(),
  price: z.coerce.number(),
  unit: z.string().optional(),
  img: z.string().nullable().optional(),
});
export const localCartSchema = z.array(cartLineItemSchema);

const profileSchema = z.object({
  display_name: z.string().nullable(),
  email: z.string().nullable(),
  phone_number: z.string().nullable(),
});

export const cartRowsSchema = z.array(z.object({
  id: z.string(),
  status: z.string(),
  created_at: z.string().nullable(),
  last_activity_at: z.string().nullable(),
  subtotal: z.coerce.number().nullable(),
  total: z.coerce.number().nullable(),
  cart_items: z.array(z.object({
    id: z.string(),
    variant_id: z.string().nullable(),
    product_id: z.string().nullable(),
    product_name: z.string(),
    variant_unit: z.string().nullable(),
    unit_price: z.coerce.number(),
    quantity: z.coerce.number(),
  })).nullable(),
  profiles: z.union([profileSchema, z.array(profileSchema).transform((rows) => rows[0] ?? null)]).nullable().optional(),
}));
