import 'package:flutter/material.dart';
import '../config/constants.dart';

class PreorderCarouselWidget extends StatelessWidget {
  final List<Map<String, dynamic>> preorders;
  final Function(Map<String, dynamic> product) onProductTap;
  final Function(Map<String, dynamic> item) onAddToCart;

  const PreorderCarouselWidget({
    super.key,
    required this.preorders,
    required this.onProductTap,
    required this.onAddToCart,
  });

  @override
  Widget build(BuildContext context) {
    if (preorders.isEmpty) return const SliverToBoxAdapter(child: SizedBox.shrink());

    return SliverToBoxAdapter(
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: AppConstants.royalGold,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.calendar_month, size: 14, color: AppConstants.primaryDarkEmerald),
                  ),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('PRE-ORDERS', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: AppConstants.darkCharcoalText)),
                      Text('Reserve seasonal catches & special harvest', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppConstants.darkEmeraldText)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 220,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: preorders.length,
                itemBuilder: (context, index) {
                  final p = preorders[index];
                  final variants = p['product_variants'] as List? ?? [];
                  final variant = variants.isNotEmpty ? Map<String, dynamic>.from(variants[0] as Map) : null;
                  final price = variant?['price'] ?? p['price'] ?? 150;
                  final dispatchDate = p['expected_dispatch_date']?.toString();

                  return GestureDetector(
                    onTap: () => onProductTap(p),
                    child: Container(
                      width: 170,
                      margin: const EdgeInsets.only(right: 12),
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppConstants.royalGold.withOpacity(0.6), width: 1.5),
                        boxShadow: [
                          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2)),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Stack(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(14),
                                child: Image.network(
                                  p['image_url'] ?? 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
                                  height: 90,
                                  width: double.infinity,
                                  fit: BoxFit.cover,
                                  errorBuilder: (c, e, s) => Container(height: 90, color: Colors.grey.shade200),
                                ),
                              ),
                              Positioned(
                                top: 6,
                                left: 6,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: AppConstants.primaryDarkEmerald,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text('PRE-ORDER', style: TextStyle(color: AppConstants.royalGold, fontSize: 8, fontWeight: FontWeight.w900)),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            p['name'] ?? '',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11, color: AppConstants.darkCharcoalText),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '₹$price / ${variant?['unit'] ?? 'pack'}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppConstants.darkEmeraldText),
                          ),
                          if (dispatchDate != null) ...[
                            const SizedBox(height: 4),
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
                          ],
                          const Spacer(),
                          SizedBox(
                            width: double.infinity,
                            height: 28,
                            child: ElevatedButton(
                              onPressed: () {
                                final varId = variant?['id']?.toString();
                                final prodId = p['id'].toString();
                                onAddToCart({
                                  'id': '$prodId-${varId ?? prodId}',
                                  'product_id': prodId,
                                  'variant_id': varId,
                                  'name': p['name'],
                                  'price': price,
                                  'unit': variant?['unit'] ?? 'pack',
                                  'img': p['image_url'],
                                  'is_preorder': true,
                                  'expected_dispatch_date': dispatchDate,
                                });
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppConstants.primaryDarkEmerald,
                                foregroundColor: AppConstants.royalGold,
                                elevation: 0,
                                padding: EdgeInsets.zero,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                              ),
                              child: const Text('PRE-ORDER', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
