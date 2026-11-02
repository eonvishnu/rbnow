import { z } from 'zod';

export const manualOrderProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  image_url: z.string().nullable(),
  product_variants: z.array(z.object({
    id: z.string(),
    unit: z.string(),
    price: z.coerce.number(),
  })).nullable(),
});

export const adminOrderRowSchema = z.object({
  id: z.string(),
  order_number: z.union([z.number(), z.string()]).nullable(),
  created_at: z.string().nullable(),
  status: z.string().nullable(),
  order_source: z.string().nullable(),
  total: z.coerce.number(),
  subtotal: z.coerce.number(),
  delivery_fee: z.coerce.number().nullable(),
  discount: z.coerce.number().nullable(),
  delivery_address: z.object({
    name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    houseNumber: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    pincode: z.string().nullable().optional(),
  }).nullable(),
  user_phone: z.string().nullable(),
  user_name: z.string().nullable(),
  order_items: z.array(z.object({
    id: z.string(),
    product_id: z.string().nullable(),
    variant_id: z.string().nullable(),
    product_name: z.string(),
    quantity: z.coerce.number(),
    price: z.coerce.number(),
    total_price: z.coerce.number(),
    variant_unit: z.string().nullable(),
  })).nullable(),
  order_item_changes: z.array(z.object({
    change_type: z.string(),
    reason: z.string().nullable(),
    old_unit_price: z.coerce.number(),
    new_unit_price: z.coerce.number(),
    created_at: z.string(),
  })).nullable(),
});

export const replacementProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  product_variants: z.array(z.object({
    id: z.string(),
    unit: z.string(),
    price: z.coerce.number(),
  })).nullable(),
});

export const manualOrderInputSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(1, 'Customer Name is required.'),
    phone: z.string().trim().min(1, 'Phone Number is required.'),
    houseNo: z.string(),
    area: z.string(),
    city: z.string(),
    pincode: z.string(),
    source: z.enum(['whatsapp', 'phone', 'walk_in', 'admin']),
    paymentMethod: z.enum(['cod', 'upi', 'paid']),
  }),
  items: z.array(z.object({
    variantId: z.string().min(1),
    productId: z.string().min(1),
    name: z.string().trim().min(1),
    unit: z.string(),
    price: z.number().finite().min(0),
    qty: z.number().int().positive(),
    img: z.string(),
  })).min(1, 'Please add at least one item to the order.'),
  deliveryFee: z.number().finite().min(0),
  manualDiscount: z.number().finite().min(0),
  subtotal: z.number().finite().min(0),
  total: z.number().finite().min(0),
});
