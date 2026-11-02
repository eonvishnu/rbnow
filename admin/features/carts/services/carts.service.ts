import { listAdminCarts } from '../repositories/carts.repository';
import type { AdminCart, ManualCartOrderItem } from '../types/cart';

const ABANDONED_AFTER_MS = 30 * 60 * 1000;

export async function getAdminCarts() {
  const carts = await listAdminCarts();
  const thirtyMinutesAgo = new Date(Date.now() - ABANDONED_AFTER_MS).toISOString();
  return carts.map((cart): AdminCart => (
    cart.status === 'active' && cart.last_activity_at && cart.last_activity_at < thirtyMinutesAgo
      ? { ...cart, status: 'abandoned' }
      : cart
  ));
}

export function getManualOrderItems(cart: AdminCart): ManualCartOrderItem[] {
  return (cart.cart_items || []).map((item) => ({
    variantId: item.variant_id,
    productId: item.product_id,
    name: item.product_name,
    unit: item.variant_unit || 'pack',
    price: Number(item.unit_price),
    qty: item.quantity,
  }));
}

export function createCartRecoveryMessage(cart: AdminCart) {
  const phone = cart.profiles?.phone_number || '919876543210';
  const items = (cart.cart_items || [])
    .map((item) => `${item.product_name} (${item.variant_unit}) x${item.quantity}`)
    .join(', ');
  const total = cart.total || cart.subtotal || 0;
  const message = `Hi ${cart.profiles?.display_name || 'there'}, we noticed you left ${items || 'items'} in your Royal Bengal cart (Total: ₹${total}). Would you like us to complete your order with express fresh delivery?`;
  return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
}
