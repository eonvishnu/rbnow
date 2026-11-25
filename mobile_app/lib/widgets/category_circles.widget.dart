import 'package:flutter/material.dart';
import '../config/constants.dart';

class CategoryCirclesWidget extends StatelessWidget {
  final List<Map<String, dynamic>> parentCategories;
  final String activeCategory;
  final Function(String categoryName) onSelectCategory;

  const CategoryCirclesWidget({
    super.key,
    required this.parentCategories,
    required this.activeCategory,
    required this.onSelectCategory,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        children: [
          _buildItem('All', '🛍️', null, activeCategory == 'All'),
          ...parentCategories.map((cat) => _buildItem(
                cat['name']?.toString() ?? '',
                '🍽️',
                cat['image_url'],
                activeCategory.toLowerCase() == (cat['name'] ?? '').toString().toLowerCase(),
              )),
        ],
      ),
    );
  }

  Widget _buildItem(String title, String emoji, String? imageUrl, bool isSelected) {
    return GestureDetector(
      onTap: () => onSelectCategory(title),
      child: Container(
        width: 76,
        margin: const EdgeInsets.only(right: 12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
                border: Border.all(
                  color: isSelected ? AppConstants.royalGold : AppConstants.cardBorder,
                  width: isSelected ? 2.5 : 1.5,
                ),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 4, offset: const Offset(0, 2)),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: imageUrl != null && imageUrl.isNotEmpty
                    ? Image.network(
                        imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (c, e, s) => Center(child: Text(emoji, style: const TextStyle(fontSize: 20))),
                      )
                    : Center(
                        child: title.toLowerCase() == 'all'
                            ? const Icon(Icons.grid_view_rounded, color: AppConstants.headerEmerald, size: 22)
                            : Text(emoji, style: const TextStyle(fontSize: 20)),
                      ),
              ),
            ),
            const SizedBox(height: 2),
            SizedBox(
              height: 28,
              child: Text(
                title,
                maxLines: 2,
                textAlign: TextAlign.center,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 9.5,
                  height: 1.15,
                  fontWeight: isSelected ? FontWeight.w900 : FontWeight.bold,
                  color: isSelected ? AppConstants.headerEmerald : AppConstants.darkCharcoalText,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
