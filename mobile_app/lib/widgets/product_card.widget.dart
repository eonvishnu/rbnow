import 'package:flutter/material.dart';
import '../config/constants.dart';

class ProductCardWidget extends StatelessWidget {
  final Map<String, dynamic> product;
  final Map<String, dynamic>? activeVariant;
  final num effectiveDiscount;
  final num currentPrice;
  final num displayOriginalPrice;
  final List<dynamic> variants;
  final String pId;
  final String? selectedVariantId;
  final int cartQuantity;
  final Function(String productId, String variantId) onSelectVariant;
  final VoidCallback onTap;
  final VoidCallback onAddToCart;
  final VoidCallback onIncrement;
  final VoidCallback onDecrement;

  const ProductCardWidget({
    super.key,
    required this.product,
    required this.activeVariant,
    required this.effectiveDiscount,
    required this.currentPrice,
    required this.displayOriginalPrice,
    required this.variants,
    required this.pId,
    required this.selectedVariantId,
    required this.cartQuantity,
    required this.onSelectVariant,
    required this.onTap,
    required this.onAddToCart,
    required this.onIncrement,
    required this.onDecrement,
  });

  bool _isVariantAvailable(Map<String, dynamic> variant) {
    final isAvailable = variant['is_available'] == true;
    final stock = int.tryParse(variant['stock']?.toString() ?? '0') ?? 0;
    return isAvailable && stock > 0;
  }

  @override
  Widget build(BuildContext context) {
    final variantOriginalPrice = num.tryParse(activeVariant?['original_price']?.toString() ?? '0') ?? 0;
    final productOriginalPrice = num.tryParse(product['original_price']?.toString() ?? '0') ?? 0;
    final resolvedOriginalPrice = variantOriginalPrice > 0 ? variantOriginalPrice : productOriginalPrice;

    final variantDiscount = num.tryParse(activeVariant?['discount']?.toString() ?? activeVariant?['discount_percent']?.toString() ?? '0') ?? 0;
    final productDiscount = num.tryParse(product['discount']?.toString() ?? product['discount_percent']?.toString() ?? '0') ?? 0;
    final rawDiscount = variantDiscount > 0 ? variantDiscount : productDiscount;

    final price = currentPrice;
    final calcDiscount = resolvedOriginalPrice > price ? (((resolvedOriginalPrice - price) / resolvedOriginalPrice) * 100).round() : 0;
    final disc = rawDiscount > 0 ? rawDiscount.round() : calcDiscount;
    final origPrice = resolvedOriginalPrice > price ? resolvedOriginalPrice : (disc > 0 ? (price / (1 - (disc / 100))).round() : 0);

    final isPreorder = product['sale_mode'] == 'preorder' || activeVariant?['preorder_enabled'] == true;
    final dispatchDate = product['expected_dispatch_date']?.toString();

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppConstants.cardBorder, width: 1.2),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Container
            SizedBox(
              height: 100,
              width: double.infinity,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFFBF8F3),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.network(
                        product['image_url'] ?? 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
                        fit: BoxFit.cover,
                        errorBuilder: (c, e, s) => const Icon(Icons.fastfood, size: 40, color: Colors.grey),
                      ),
                    ),
                  ),
                  if (disc > 0 && !isPreorder)
                    Positioned(
                      top: 6,
                      left: 6,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.amber.shade700,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '$disc% OFF',
                          style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.w900),
                        ),
                      ),
                    ),
                  if (isPreorder)
                    Positioned(
                      top: 6,
                      left: 6,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppConstants.primaryDarkEmerald,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'PRE-ORDER',
                          style: TextStyle(color: AppConstants.royalGold, fontSize: 8, fontWeight: FontWeight.w900),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 8),

            // Product Name (Fixed height for 2 lines)
            SizedBox(
              height: 32,
              child: Text(
                product['name'] ?? 'Fresh Catch',
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 12,
                  height: 1.2,
                  color: AppConstants.darkCharcoalText,
                ),
              ),
            ),
            const SizedBox(height: 4),

            // Price & Unit
            Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(
                  '₹$price',
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 15,
                    color: AppConstants.darkCharcoalText,
                  ),
                ),
                const SizedBox(width: 3),
                Expanded(
                  child: Text(
                    '/ ${activeVariant?['unit'] ?? 'pack'}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 10,
                      color: AppConstants.mutedGreyText,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                if (origPrice > price) ...[
                  const SizedBox(width: 4),
                  Text(
                    '₹$origPrice',
                    style: const TextStyle(
                      fontSize: 10,
                      color: Colors.grey,
                      decoration: TextDecoration.lineThrough,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 6),

            if (isPreorder && dispatchDate != null) ...[
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.amber.shade50,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: Colors.amber.shade200),
                ),
                child: Text(
                  'Dispatch: $dispatchDate',
                  style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.amber.shade900),
                ),
              ),
              const SizedBox(height: 6),
            ],

            // Variant Selection Pills
            if (variants.length > 1)
              SizedBox(
                height: 24,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: variants.length,
                  itemBuilder: (context, vIdx) {
                    final v = Map<String, dynamic>.from(variants[vIdx] as Map);
                    final available = _isVariantAvailable(v);
                    final isSelected = activeVariant?['id']?.toString() == v['id']?.toString();

                    return GestureDetector(
                      onTap: available ? () => onSelectVariant(pId, v['id'].toString()) : null,
                      child: Container(
                        margin: const EdgeInsets.only(right: 5),
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: !available
                              ? Colors.grey.shade100
                              : isSelected
                                  ? AppConstants.headerEmerald
                                  : AppConstants.lightMint,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                            color: !available
                                ? Colors.grey.shade300
                                : isSelected
                                    ? AppConstants.royalGold
                                    : AppConstants.mintBorder,
                          ),
                        ),
                        child: Text(
                          v['unit']?.toString() ?? 'pack',
                          style: TextStyle(
                            fontSize: 8.5,
                            fontWeight: FontWeight.w900,
                            color: !available
                                ? Colors.grey.shade500
                                : isSelected
                                    ? AppConstants.royalGold
                                    : AppConstants.darkEmeraldText,
                            decoration: available ? TextDecoration.none : TextDecoration.lineThrough,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            if (variants.length > 1) const SizedBox(height: 4),

            const SizedBox(height: 4),

            // Footer Area: ADD Button or - qty + Counter
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                cartQuantity > 0
                    ? Container(
                        height: 30,
                        decoration: BoxDecoration(
                          color: AppConstants.headerEmerald,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove, size: 14, color: AppConstants.royalGold),
                              onPressed: onDecrement,
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(minWidth: 26, minHeight: 30),
                            ),
                            Text(
                              '$cartQuantity',
                              style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11, color: Colors.white),
                            ),
                            IconButton(
                              icon: const Icon(Icons.add, size: 14, color: AppConstants.royalGold),
                              onPressed: onIncrement,
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(minWidth: 26, minHeight: 30),
                            ),
                          ],
                        ),
                      )
                    : SizedBox(
                        height: 30,
                        child: ElevatedButton(
                          onPressed: onAddToCart,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppConstants.headerEmerald,
                            foregroundColor: AppConstants.royalGold,
                            elevation: 0,
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 0),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: Text(
                            isPreorder ? 'PRE-ORDER' : 'ADD',
                            style: const TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 10,
                              letterSpacing: 1,
                            ),
                          ),
                        ),
                      ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
