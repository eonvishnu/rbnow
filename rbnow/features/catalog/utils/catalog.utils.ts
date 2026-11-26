import { ProductVariantOption } from '../types/catalog.types';

export function generateProductOptions(p: any, activeCampaigns: any[], activeDiscounts: any[]): ProductVariantOption[] {
  if (p.product_variants && Array.isArray(p.product_variants) && p.product_variants.length > 0) {
    return p.product_variants.map((v: any) => {
      const activeCamp = activeCampaigns?.find((c: any) => c.product_variant_id === v.id);

      // Check variant-specific discount
      let variantDiscountPercent = 0;
      if (activeDiscounts && Array.isArray(activeDiscounts)) {
        for (const disc of activeDiscounts) {
          const isLinked = disc.discount_variants?.some((dv: any) => dv.variant_id === v.id);
          if (isLinked) {
            if (disc.discount_type === 'percentage') {
              variantDiscountPercent = Math.max(variantDiscountPercent, Number(disc.discount_value));
            } else {
              const flatDiscount = Number(disc.discount_value);
              const percentEquiv = Math.round((flatDiscount / Number(v.price)) * 100);
              variantDiscountPercent = Math.max(variantDiscountPercent, percentEquiv);
            }
          }
        }
      }

      const rawPrice = activeCamp ? Number(activeCamp.price) : Number(v.price);
      const hasVariantDiscount = variantDiscountPercent > 0;
      const finalPrice = hasVariantDiscount
        ? Math.round(rawPrice * (1 - (variantDiscountPercent / 100)))
        : rawPrice;

      return {
        id: v.id,
        unit: v.unit,
        price: finalPrice,
        originalPrice: hasVariantDiscount ? rawPrice : (v.original_price ? Number(v.original_price) : undefined),
        discountPercent: variantDiscountPercent,
        stockCount: activeCamp ? (activeCamp.max_quantity - activeCamp.reserved_quantity) : Number(v.stock),
        sku: v.sku,
        preorderCampaign: activeCamp || null,
      };
    });
  }

  const basePrice = Number(p.price) || 100;
  const baseStock = Number(p.stock) || 30;
  const unitStr = (p.unit || '').toLowerCase().trim();

  if (unitStr.includes('500g') || unitStr.includes('500 g')) {
    return [
      { id: `${p.id}-250g`, unit: '250g', price: Math.round(basePrice * 0.55), discountPercent: 0, stockCount: Math.floor(baseStock * 1.2) },
      { id: `${p.id}-500g`, unit: '500g', price: basePrice, discountPercent: 0, stockCount: baseStock },
      { id: `${p.id}-1kg`, unit: '1 kg', price: Math.round(basePrice * 1.9), discountPercent: 0, stockCount: Math.floor(baseStock * 0.8) }
    ];
  }

  return [
    { id: `${p.id}-default`, unit: p.unit || '1 Pack', price: basePrice, discountPercent: 0, stockCount: baseStock }
  ];
}
