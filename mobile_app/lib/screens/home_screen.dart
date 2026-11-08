import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/constants.dart';
import '../services/supabase_service.dart';

class HomeScreen extends StatefulWidget {
  final VoidCallback onOpenCart;
  final Function(Map<String, dynamic> item) onAddToCart;

  const HomeScreen({
    super.key,
    required this.onOpenCart,
    required this.onAddToCart,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _activeCategory = 'All';
  String _activeSubCategory = 'all';

  List<Map<String, dynamic>> _parentCategories = [];
  Map<String, List<Map<String, dynamic>>> _subCategoriesMap = {};
  List<Map<String, dynamic>> _products = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() async {
    setState(() => _loading = true);
    final workspace = await SupabaseService.getCategoryWorkspace();
    final prods = await SupabaseService.getProducts(
      categoryFilter: _activeCategory,
      subCategoryFilter: _activeSubCategory,
    );

    setState(() {
      _parentCategories = workspace['parents'] as List<Map<String, dynamic>>? ?? [];
      _subCategoriesMap = workspace['subMap'] as Map<String, List<Map<String, dynamic>>>? ?? {};
      _products = prods;
      _loading = false;
    });
  }

  List<Map<String, dynamic>> get _currentSubCategories {
    if (_activeCategory.toLowerCase() == 'all') return [];
    final selectedCat = _parentCategories.firstWhere(
      (c) => (c['name'] ?? '').toString().toLowerCase() == _activeCategory.toLowerCase(),
      orElse: () => {},
    );
    if (selectedCat.isEmpty || selectedCat['id'] == null) return [];
    return _subCategoriesMap[selectedCat['id'].toString()] ?? [];
  }

  void _showSupportDialog() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppConstants.primaryDarkEmerald,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('ROYAL CONCIERGE', style: GoogleFonts.montserrat(color: AppConstants.royalGold, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 2)),
                    const SizedBox(height: 2),
                    const Text('Customer Support', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: const BoxDecoration(color: AppConstants.lightMint, shape: BoxShape.circle),
                  child: const Icon(Icons.chat, color: AppConstants.darkEmeraldText, size: 20),
                ),
                title: const Text('WHATSAPP US', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
                subtitle: const Text('Instant chat support', style: TextStyle(fontSize: 10, color: Colors.grey)),
                onTap: () async {
                  Navigator.pop(context);
                  const url = 'https://wa.me/919876543210';
                  if (await canLaunchUrl(Uri.parse(url))) {
                    await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
                  }
                },
              ),

              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(color: Colors.amber.shade50, shape: BoxShape.circle),
                  child: const Icon(Icons.phone, color: Colors.amber, size: 20),
                ),
                title: const Text('CALL US', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
                subtitle: const Text('Direct phone support', style: TextStyle(fontSize: 10, color: Colors.grey)),
                onTap: () async {
                  Navigator.pop(context);
                  const url = 'tel:+919876543210';
                  if (await canLaunchUrl(Uri.parse(url))) {
                    await launchUrl(Uri.parse(url));
                  }
                },
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final subCats = _currentSubCategories;

    return Scaffold(
      backgroundColor: AppConstants.warmBackground,
      appBar: AppBar(
        backgroundColor: AppConstants.primaryDarkEmerald,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: const BoxDecoration(shape: BoxShape.circle, color: AppConstants.royalGold),
                  padding: const EdgeInsets.all(1.5),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.asset('assets/logo.png', fit: BoxFit.cover),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  'ROYAL BENGAL',
                  style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.w900, color: AppConstants.royalGold, letterSpacing: 1.5),
                ),
              ],
            ),
            const SizedBox(height: 2),
            Text(AppConstants.bengaliTagline, style: const TextStyle(fontSize: 9, color: Colors.white70, fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(
            icon: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppConstants.headerEmerald,
                border: Border.all(color: AppConstants.royalGold, width: 1.5),
              ),
              child: const Icon(Icons.headset_mic, color: AppConstants.royalGold, size: 18),
            ),
            onPressed: _showSupportDialog,
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          // Header Delivery Location Bar
          SliverToBoxAdapter(
            child: Container(
              color: AppConstants.primaryDarkEmerald,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: AppConstants.headerEmerald,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: const [
                    Icon(Icons.location_on, color: AppConstants.royalGold, size: 16),
                    SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Deliver to: HOME - 5th floor, penthouse, Hyderabad...',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(color: AppConstants.royalGold, fontWeight: FontWeight.w900, fontSize: 11),
                      ),
                    ),
                    Icon(Icons.keyboard_arrow_down, color: AppConstants.royalGold, size: 16),
                  ],
                ),
              ),
            ),
          ),

          // Sticky Category Circles Row
          SliverPersistentHeader(
            pinned: true,
            delegate: _SliverCategoryDelegate(
              child: Container(
                color: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  children: [
                    _buildCategoryCircle('All', '🛍️', null, _activeCategory == 'All'),
                    ..._parentCategories.map((cat) => _buildCategoryCircle(cat['name'] ?? '', '🍽️', cat['image_url'], _activeCategory.toLowerCase() == (cat['name'] ?? '').toString().toLowerCase())),
                  ],
                ),
              ),
            ),
          ),

          // Subcategories Filter Pills Bar
          if (subCats.isNotEmpty)
            SliverToBoxAdapter(
              child: Container(
                color: const Color(0xFF00382B),
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildSubCategoryPill('ALL', null, _activeSubCategory == 'all'),
                      ...subCats.map((sub) => _buildSubCategoryPill(sub['name'] ?? '', sub['id']?.toString(), _activeSubCategory.toLowerCase() == (sub['name'] ?? '').toString().toLowerCase())),
                    ],
                  ),
                ),
              ),
            ),

          // Product Grid List
          _loading
              ? const SliverFillRemaining(child: Center(child: CircularProgressIndicator(color: AppConstants.headerEmerald)))
              : _products.isEmpty
                  ? SliverFillRemaining(
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.set_meal_outlined, size: 48, color: Colors.grey),
                            SizedBox(height: 12),
                            Text('No products found in this category.', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
                          ],
                        ),
                      ),
                    )
                  : SliverPadding(
                      padding: const EdgeInsets.all(16),
                      sliver: SliverGrid(
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.62,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                        ),
                        delegate: SliverChildBuilderDelegate(
                          (context, index) {
                            final product = _products[index];
                            final variants = product['product_variants'] as List? ?? [];
                            final firstVariant = variants.isNotEmpty ? variants[0] : null;

                            return Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: Colors.grey.shade200),
                                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 8)],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Image Container
                                  Expanded(
                                    child: Container(
                                      width: double.infinity,
                                      decoration: BoxDecoration(
                                        color: Colors.grey.shade100,
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
                                  ),
                                  const SizedBox(height: 8),

                                  Text(
                                    product['name'] ?? 'Fresh Catch',
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 12, height: 1.2),
                                  ),
                                  const SizedBox(height: 4),

                                  Row(
                                    children: [
                                      Text(
                                        '₹${firstVariant?['price'] ?? product['price'] ?? 150}',
                                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: AppConstants.darkCharcoalText),
                                      ),
                                      Text(
                                        ' / ${firstVariant?['unit'] ?? 'pack'}',
                                        style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 10),

                                  SizedBox(
                                    width: double.infinity,
                                    height: 34,
                                    child: ElevatedButton(
                                      onPressed: () {
                                        widget.onAddToCart({
                                          'id': firstVariant?['id'] ?? product['id'],
                                          'name': product['name'],
                                          'price': firstVariant?['price'] ?? 150,
                                          'unit': firstVariant?['unit'] ?? 'pack',
                                          'img': product['image_url'],
                                        });
                                      },
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppConstants.lightMint,
                                        foregroundColor: AppConstants.darkEmeraldText,
                                        elevation: 0,
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(12),
                                          side: const BorderSide(color: AppConstants.mintBorder),
                                        ),
                                      ),
                                      child: const Text('ADD TO CART', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 10)),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                          childCount: _products.length,
                        ),
                      ),
                    ),
        ],
      ),
    );
  }

  Widget _buildCategoryCircle(String label, String defaultIcon, String? imageUrl, bool isActive) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _activeCategory = label;
          _activeSubCategory = 'all';
        });
        _loadData();
      },
      child: Container(
        margin: const EdgeInsets.only(right: 12),
        child: Column(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: isActive
                    ? const LinearGradient(colors: [Color(0xFFFFD54F), Color(0xFFFFB300)])
                    : null,
                color: isActive ? null : Colors.grey.shade100,
              ),
              padding: const EdgeInsets.all(2),
              child: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isActive ? AppConstants.primaryDarkEmerald : Colors.white,
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(26),
                  child: imageUrl != null && imageUrl.isNotEmpty
                      ? Image.network(imageUrl, fit: BoxFit.cover, errorBuilder: (c, e, s) => Center(child: Text(defaultIcon, style: const TextStyle(fontSize: 20))))
                      : Center(child: Text(defaultIcon, style: const TextStyle(fontSize: 20))),
                ),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isActive ? FontWeight.w900 : FontWeight.bold,
                color: isActive ? AppConstants.primaryDarkEmerald : Colors.grey.shade700,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubCategoryPill(String label, String? subCategoryId, bool isActive) {
    return GestureDetector(
      onTap: () async {
        setState(() {
          _activeSubCategory = label;
          _loading = true;
        });
        final prods = await SupabaseService.getProducts(
          categoryFilter: _activeCategory,
          subCategoryFilter: label,
          subCategoryId: subCategoryId,
        );
        setState(() {
          _products = prods;
          _loading = false;
        });
      },
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: isActive ? AppConstants.royalGold : const Color(0xFF004D3B),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isActive ? AppConstants.royalGold : const Color(0xFF005A45)),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            color: isActive ? const Color(0xFF00382B) : AppConstants.lightMint,
          ),
        ),
      ),
    );
  }
}

class _SliverCategoryDelegate extends SliverPersistentHeaderDelegate {
  final Widget child;

  _SliverCategoryDelegate({required this.child});

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) => child;

  @override
  double get maxExtent => 82;

  @override
  double get minExtent => 82;

  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) => true;
}
