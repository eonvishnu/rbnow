import {
  attachGuestCartToUser,
  clearCustomerCartItems,
  createCustomerCart,
  findActiveCustomerCart,
  findGuestCart,
  replaceCustomerCartItems,
  updateCustomerCartTotal,
} from '../repositories/cart-sync.repository';
import type { CartItem } from '../types/cart';

export async function syncCustomerCart(items: CartItem[], userId: string | null, browserId: string) {
  let cartId = await findActiveCustomerCart(userId, browserId);

  if (items.length === 0) {
    if (cartId) await clearCustomerCartItems(cartId);
    return null;
  }

  if (userId && cartId) {
    const guestCartId = await findGuestCart(browserId);
    if (guestCartId && guestCartId !== cartId) {
      await attachGuestCartToUser(guestCartId, userId);
    }
  }

  if (!cartId) cartId = await createCustomerCart(userId, browserId);

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  await updateCustomerCartTotal(cartId, subtotal);

  const groups = new Map<string, {
    cart_id: string;
    variant_id: string;
    product_id: string;
    product_name: string;
    variant_unit: string;
    unit_price: number;
    quantity: number;
  }>();
  for (const item of items) {
    const existing = groups.get(item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      const cleanId = item.id.length >= 36 ? item.id.substring(0, 36) : item.id;
      groups.set(item.id, {
        cart_id: cartId,
        variant_id: cleanId,
        product_id: item.product_id || cleanId,
        product_name: item.name,
        variant_unit: item.unit || 'pack',
        unit_price: item.price,
        quantity: 1,
      });
    }
  }
  await replaceCustomerCartItems(cartId, [...groups.values()]);
  return cartId;
}
