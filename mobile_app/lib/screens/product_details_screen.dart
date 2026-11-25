import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/constants.dart';

void showProductDetailsModal({
  required BuildContext context,
  required Map<String, dynamic> product,
  required Function(Map<String, dynamic> item) onAddToCart,
  required VoidCallback onOpenCart,
}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (context) => Container(
      constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.88),
      decoration: const BoxDecoration(
        color: AppConstants.warmCreamBackground,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: ProductDetailsContent(
        product: product,
        onAddToCart: onAddToCart,
        onOpenCart: onOpenCart,
      ),
    ),
  );
}

class ProductDetailsContent extends StatefulWidget {
  final Map<String, dynamic> product;
  final Function(Map<String, dynamic> item) onAddToCart;
  final VoidCallback onOpenCart;

  const ProductDetailsContent({
    super.key,
    required this.product,
    required this.onAddToCart,
    required this.onOpenCart,
  });

  @override
  State<ProductDetailsContent> createState() => _ProductDetailsContentState();
}

class _ProductDetailsContentState extends State<ProductDetailsContent> {
  int _selectedVariantIndex = 0;
  int _quantity = 1;

  List<dynamic> get _variants => widget.product['product_variants'] as List? ?? [];

  bool _isVariantAvailable(Map<String, dynamic> variant) {
    final isAvailable = variant['is_available'] == true;
    final stock = int.tryParse(variant['stock']?.toString() ?? '0') ?? 0;
    return isAvailable && stock > 0;
  }

  @override
  void initState() {
    super.initState();
    for (int i = 0; i < _variants.length; i++) {
      final v = Map<String, dynamic>.from(_variants[i] as Map);
      if (_isVariantAvailable(v)) {
        _selectedVariantIndex = i;
        break;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final variants = _variants;
    final activeVariant = variants.isNotEmpty && variants.length > _selectedVariantIndex
        ? Map<String, dynamic>.from(variants[_selectedVariantIndex] as Map)
        : (variants.isNotEmpty ? Map<String, dynamic>.from(variants[0] as Map) : null);

    final hasVariants = variants.isNotEmpty;
    final isAvailable = activeVariant == null || _isVariantAvailable(activeVariant);

    // Price parsing using num.tryParse
    final rawPrice = num.tryParse(activeVariant?['price']?.toString() ?? widget.product['price']?.toString() ?? '150') ?? 150;
    final price = rawPrice;
    final unit = activeVariant?['unit']?.toString() ?? 'pack';
    final stock = int.tryParse(activeVariant?['stock']?.toString() ?? '10') ?? 10;

    final canAddToCart = isAvailable && _quantity >= 1 && _quantity <= stock;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Top Drag Handle
        const SizedBox(height: 12),
        Container(
          width: 40,
          height: 4,
          decoration: BoxDecoration(color: Colors.grey.shade400, borderRadius: BorderRadius.circular(2)),
        ),
        const SizedBox(height: 8),

        // Modal Header Bar
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Product Details',
                style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.w900, color: AppConstants.headerEmerald),
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.shopping_bag_outlined, color: AppConstants.headerEmerald, size: 20),
                    onPressed: () {
                      Navigator.pop(context);
                      widget.onOpenCart();
                    },
                    tooltip: 'View Cart',
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.grey, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ],
          ),
        ),
        const Divider(height: 1, color: AppConstants.cardBorder),

        // Scrollable Content Area
        Flexible(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Product Image Card
                Container(
                  height: 220,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppConstants.cardBorder),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(24),
                    child: Image.network(
                      widget.product['image_url'] ?? 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
                      fit: BoxFit.cover,
                      errorBuilder: (c, e, s) => const Icon(Icons.fastfood, size: 60, color: Colors.grey),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Title & Category
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppConstants.cardBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (widget.product['category_name'] != null)
                        Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppConstants.lightMint,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppConstants.mintBorder),
                          ),
                          child: Text(
                            widget.product['category_name'].toString().toUpperCase(),
                            style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: AppConstants.darkEmeraldText),
                          ),
                        ),
                      Text(
                        widget.product['name']?.toString() ?? 'Fresh Catch',
                        style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.w900, color: AppConstants.darkCharcoalText),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text(
                            '₹$price',
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppConstants.headerEmerald),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '/ $unit',
                            style: const TextStyle(fontSize: 12, color: AppConstants.mutedGreyText, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      const Divider(color: AppConstants.cardBorder),
                      const SizedBox(height: 10),
                      const Text('Description', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, color: AppConstants.darkCharcoalText)),
                      const SizedBox(height: 6),
                      Text(
                        widget.product['description']?.toString() ?? 'Freshly sourced authentic delicacy prepared with traditional quality controls and strict hygiene standards.',
                        style: const TextStyle(fontSize: 12, color: AppConstants.mutedGreyText, height: 1.5),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Variant Selection
                if (hasVariants) ...[
                  const Text('SELECT WEIGHT / PORTION', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppConstants.mutedGreyText, letterSpacing: 1.5)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: List.generate(variants.length, (i) {
                      final v = Map<String, dynamic>.from(variants[i] as Map);
                      final available = _isVariantAvailable(v);
                      final isSelected = _selectedVariantIndex == i;

                      return GestureDetector(
                        onTap: available
                            ? () {
                                final newStock = int.tryParse(v['stock']?.toString() ?? '0') ?? 0;
                                setState(() {
                                  _selectedVariantIndex = i;
                                  if (_quantity > newStock) {
                                    _quantity = newStock > 0 ? newStock : 1;
                                  }
                                });
                              }
                            : null,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: !available
                                ? Colors.grey.shade100
                                : isSelected
                                    ? AppConstants.headerEmerald
                                    : Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: !available
                                  ? Colors.grey.shade300
                                  : isSelected
                                      ? AppConstants.royalGold
                                      : AppConstants.cardBorder,
                              width: isSelected ? 2 : 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                v['unit']?.toString() ?? 'pack',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w900,
                                  color: !available
                                      ? Colors.grey.shade500
                                      : isSelected
                                          ? AppConstants.royalGold
                                          : AppConstants.darkCharcoalText,
                                  decoration: available ? TextDecoration.none : TextDecoration.lineThrough,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '₹${v['price'] ?? 150}',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: !available ? Colors.grey.shade400 : (isSelected ? Colors.white70 : AppConstants.darkEmeraldText),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 16),
                ],

                // Quality Guarantee Badge
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppConstants.lightMint,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppConstants.mintBorder),
                  ),
                  child: Row(
                    children: const [
                      Icon(Icons.verified, color: AppConstants.headerEmerald, size: 20),
                      SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          '100% Quality & Freshness Guarantee on all Royal Bengal cuts.',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppConstants.headerEmerald),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        // Genuine Sticky Footer Area
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.08),
                blurRadius: 10,
                offset: const Offset(0, -4),
              ),
            ],
            border: const Border(top: BorderSide(color: AppConstants.cardBorder)),
          ),
          child: Row(
            children: [
              // Quantity +/-
              Container(
                decoration: BoxDecoration(
                  color: AppConstants.lightMint,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppConstants.mintBorder),
                ),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.remove, size: 16, color: AppConstants.darkEmeraldText),
                      onPressed: _quantity > 1 ? () => setState(() => _quantity--) : null,
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: Text('$_quantity', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13)),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add, size: 16, color: AppConstants.darkEmeraldText),
                      onPressed: _quantity < stock ? () => setState(() => _quantity++) : null,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),

              // Add to Cart Button
              Expanded(
                child: SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    onPressed: canAddToCart
                        ? () {
                            final varId = activeVariant?['id']?.toString();
                            final prodId = widget.product['id'].toString();

                            widget.onAddToCart({
                              'id': '$prodId-${varId ?? prodId}',
                              'product_id': prodId,
                              'variant_id': varId,
                              'name': widget.product['name'],
                              'price': price,
                              'unit': unit,
                              'img': widget.product['image_url'],
                              'quantity': _quantity,
                            });

                            ScaffoldMessenger.maybeOf(context)?.showSnackBar(
                              SnackBar(
                                content: Text('Added $_quantity x ${widget.product['name']} ($unit) to cart!'),
                                backgroundColor: AppConstants.headerEmerald,
                              ),
                            );
                            Navigator.pop(context);
                          }
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: canAddToCart ? AppConstants.royalGold : Colors.grey.shade300,
                      foregroundColor: canAddToCart ? AppConstants.headerEmerald : Colors.grey.shade600,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: Text(
                      canAddToCart ? 'ADD TO CART • ₹${(price * _quantity)}' : 'SOLD OUT',
                      style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11, letterSpacing: 0.8),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
