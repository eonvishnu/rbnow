import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:geolocator/geolocator.dart';
import '../config/constants.dart';
import '../services/supabase_service.dart';
import '../widgets/category_circles.widget.dart';
import '../widgets/preorder_carousel.widget.dart';
import '../widgets/product_card.widget.dart';
import 'product_details_screen.dart';

class HomeScreen extends StatefulWidget {
  final VoidCallback onOpenCart;
  final Function(Map<String, dynamic> item) onAddToCart;
  final Function(String id, int quantity) onUpdateCartQuantity;
  final List<Map<String, dynamic>> cartItems;

  const HomeScreen({
    super.key,
    required this.onOpenCart,
    required this.onAddToCart,
    required this.onUpdateCartQuantity,
    required this.cartItems,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _activeCategory = 'All';
  String? _activeSubCategoryId;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  final Map<String, String> _selectedVariantIdMap = {};

  List<Map<String, dynamic>> _parentCategories = [];
  Map<String, List<Map<String, dynamic>>> _subCategoriesMap = {};
  List<Map<String, dynamic>> _banners = [];
  List<Map<String, dynamic>> _preorders = [];
  List<Map<String, dynamic>> _products = [];
  bool _loading = true;
  String _currentAddress = 'Madhapur, Hyderabad (Delivery Available)';

  @override
  void initState() {
    super.initState();
    _loadData();
    _checkAndRequestLocation();
  }

  Future<void> _checkAndRequestLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return;

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) return;
      }

      if (permission == LocationPermission.deniedForever) return;

      final position = await Geolocator.getCurrentPosition();
      if (mounted) {
        setState(() {
          _currentAddress = 'Lat: ${position.latitude.toStringAsFixed(2)}, Lng: ${position.longitude.toStringAsFixed(2)}';
        });
      }
    } catch (e) {
      debugPrint("Location request error: $e");
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> get _currentSubCategories {
    if (_activeCategory.toLowerCase() == 'all') return [];
    final parent = _parentCategories.firstWhere(
      (cat) => (cat['name'] ?? '').toString().toLowerCase() == _activeCategory.toLowerCase(),
      orElse: () => {},
    );
    if (parent.isEmpty || parent['id'] == null) return [];
    return _subCategoriesMap[parent['id'].toString()] ?? [];
  }

  List<Map<String, dynamic>> get _filteredProducts {
    if (_searchQuery.trim().isEmpty) return _products;
    final q = _searchQuery.toLowerCase().trim();
    return _products.where((p) {
      final name = (p['name'] ?? '').toString().toLowerCase();
      final cat = (p['category_name'] ?? '').toString().toLowerCase();
      return name.contains(q) || cat.contains(q);
    }).toList();
  }

  void _loadData() async {
    setState(() => _loading = true);
    try {
      final workspace = await SupabaseService.getCategoryWorkspace();
      final parents = workspace['parents'] as List<Map<String, dynamic>>? ?? [];
      final subMap = workspace['subMap'] as Map<String, List<Map<String, dynamic>>>? ?? {};

      List<String>? parentSubcategoryIds;
      if (_activeCategory.toLowerCase() != 'all') {
        final selectedParent = parents.firstWhere(
          (cat) => (cat['name'] ?? '').toString().toLowerCase() == _activeCategory.toLowerCase(),
          orElse: () => {},
        );
        if (selectedParent.isNotEmpty && selectedParent['id'] != null) {
          final children = subMap[selectedParent['id'].toString()] ?? [];
          parentSubcategoryIds = children.map((sub) => sub['id']?.toString() ?? '').where((id) => id.isNotEmpty).toList();
        } else {
          parentSubcategoryIds = [];
        }
      }

      final results = await Future.wait([
        SupabaseService.getBanners(),
        SupabaseService.getPreorderProducts(),
        SupabaseService.getProducts(
          parentSubcategoryIds: parentSubcategoryIds,
          subCategoryId: _activeSubCategoryId,
        ),
      ]);

      if (!mounted) return;
      setState(() {
        _parentCategories = parents;
        _subCategoriesMap = subMap;
        _banners = results[0];
        _preorders = results[1];
        _products = results[2];
        _loading = false;
      });
    } catch (e) {
      debugPrint("Error loading home data: $e");
      if (mounted) setState(() => _loading = false);
    }
  }

  bool _isVariantAvailable(Map<String, dynamic> variant) {
    final isAvailable = variant['is_available'] == true;
    final stock = int.tryParse(variant['stock']?.toString() ?? '0') ?? 0;
    return isAvailable && stock > 0;
  }

  int _getAvailableVariantIndex(List variants) {
    for (int i = 0; i < variants.length; i++) {
      final variant = Map<String, dynamic>.from(variants[i] as Map);
      if (_isVariantAvailable(variant)) {
        return i;
      }
    }
    return -1;
  }

  Map<String, dynamic>? _getSelectedVariant(String productId, List variants) {
    if (variants.isEmpty) return null;
    final selectedId = _selectedVariantIdMap[productId];

    if (selectedId != null) {
      for (final item in variants) {
        final variant = Map<String, dynamic>.from(item as Map);
        if (variant['id']?.toString() == selectedId && _isVariantAvailable(variant)) {
          return variant;
        }
      }
    }

    final firstAvailableIndex = _getAvailableVariantIndex(variants);
    if (firstAvailableIndex == -1) {
      return variants.isNotEmpty ? Map<String, dynamic>.from(variants[0] as Map) : null;
    }

    return Map<String, dynamic>.from(variants[firstAvailableIndex] as Map);
  }

  void _showLocationDialog() {
    final TextEditingController addressController = TextEditingController(text: _currentAddress);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            left: 20,
            right: 20,
            top: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('SELECT DELIVERY LOCATION', style: GoogleFonts.montserrat(color: AppConstants.primaryDarkEmerald, fontSize: 12, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
              const SizedBox(height: 8),
              const Text('Enter your delivery address to verify real-time delivery availability & speed.', style: TextStyle(fontSize: 12, color: Colors.grey)),
              const SizedBox(height: 16),
              TextField(
                controller: addressController,
                decoration: InputDecoration(
                  labelText: 'Delivery Address / Area',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  prefixIcon: const Icon(Icons.location_on, color: AppConstants.primaryDarkEmerald),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppConstants.primaryDarkEmerald,
                    foregroundColor: AppConstants.royalGold,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    setState(() {
                      _currentAddress = addressController.text.isNotEmpty ? addressController.text : 'Hyderabad';
                    });
                    addressController.dispose();
                    Navigator.pop(context);
                    ScaffoldMessenger.maybeOf(context)?.showSnackBar(
                      const SnackBar(content: Text('Delivery location updated! We deliver to your area.'), backgroundColor: AppConstants.primaryDarkEmerald),
                    );
                  },
                  child: const Text('CHECK AVAILABILITY & SAVE', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  void _showSupportDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Text('Royal Bengal Concierge', style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.w900, color: AppConstants.headerEmerald)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Need assistance with your gourmet order or fresh catch?', style: TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 20),
            ListTile(
              leading: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: Colors.green.shade50, shape: BoxShape.circle),
                child: const Icon(Icons.chat, color: Colors.green, size: 20),
              ),
              title: const Text('WHATSAPP SUPPORT', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
              subtitle: const Text('Chat with our concierge', style: TextStyle(fontSize: 10, color: Colors.grey)),
              onTap: () async {
                Navigator.pop(context);
                const url = 'https://wa.me/916304076069?text=Hello%20Royal%20Bengal,%20I%20need%20help%20with%20my%20order.';
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
                const url = 'tel:+916304076069';
                if (await canLaunchUrl(Uri.parse(url))) {
                  await launchUrl(Uri.parse(url));
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubCategoryPill(String title, String? subId, bool isSelected) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _activeSubCategoryId = subId;
        });
        _loadData();
      },
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppConstants.royalGold : AppConstants.primaryDarkEmerald,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppConstants.royalGold.withOpacity(0.8)),
        ),
        child: Text(
          title,
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            color: isSelected ? AppConstants.primaryDarkEmerald : Colors.white,
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final subCats = _currentSubCategories;

    return Scaffold(
      backgroundColor: AppConstants.warmCreamBackground,
      appBar: AppBar(
        backgroundColor: AppConstants.warmCreamBackground,
        elevation: 0,
        toolbarHeight: 68,
        title: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
                border: Border.all(color: AppConstants.royalGold, width: 1.5),
              ),
              padding: const EdgeInsets.all(2),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(19),
                child: Image.asset('assets/logo.png', fit: BoxFit.cover),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'The Royal Bengal Fresh',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: AppConstants.darkEmeraldText,
                    ),
                  ),
                  const SizedBox(height: 1),
                  Text(
                    AppConstants.bengaliTagline,
                    style: const TextStyle(
                      fontSize: 9.5,
                      color: AppConstants.darkEmeraldText,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Container(
              padding: const EdgeInsets.all(7),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
                border: Border.all(color: AppConstants.royalGold, width: 1.5),
              ),
              child: const Icon(Icons.headset_mic, color: AppConstants.headerEmerald, size: 18),
            ),
            onPressed: _showSupportDialog,
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          // Real-time Integrated Search Bar
          SliverToBoxAdapter(
            child: Container(
              color: AppConstants.warmCreamBackground,
              padding: const EdgeInsets.fromLTRB(16, 6, 16, 6),
              child: Container(
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppConstants.cardBorder),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: TextField(
                  controller: _searchController,
                  onChanged: (val) {
                    setState(() {
                      _searchQuery = val;
                    });
                  },
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppConstants.darkCharcoalText),
                  decoration: const InputDecoration(
                    hintText: 'Search cuts, fresh catch & delicacies...',
                    hintStyle: TextStyle(fontSize: 12, color: AppConstants.mutedGreyText, fontWeight: FontWeight.w500),
                    prefixIcon: Icon(Icons.search, color: AppConstants.mutedGreyText, size: 18),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ),
          ),

          // Header Delivery Location Bar
          SliverToBoxAdapter(
            child: GestureDetector(
              onTap: _showLocationDialog,
              child: Container(
                color: AppConstants.warmCreamBackground,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: Row(
                  children: [
                    const Icon(Icons.location_on_outlined, color: Colors.orange, size: 16),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Deliver to: $_currentAddress',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(color: AppConstants.darkCharcoalText, fontWeight: FontWeight.w900, fontSize: 11),
                      ),
                    ),
                    const Icon(Icons.keyboard_arrow_down, color: Colors.orange, size: 16),
                  ],
                ),
              ),
            ),
          ),

          // Banner Carousel Sliver
          if (_banners.isNotEmpty)
            SliverToBoxAdapter(
              child: Container(
                height: 160,
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppConstants.royalGold.withOpacity(0.4)),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(24),
                  child: PageView.builder(
                    itemCount: _banners.length,
                    itemBuilder: (context, index) {
                      final banner = _banners[index];
                      return Stack(
                        fit: StackFit.expand,
                        children: [
                          Image.network(
                            banner['image_url'] ?? '',
                            fit: BoxFit.cover,
                            errorBuilder: (c, e, s) => Container(color: AppConstants.primaryDarkEmerald),
                          ),
                          Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [Colors.transparent, Colors.black.withOpacity(0.7)],
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 12,
                            left: 14,
                            right: 14,
                            child: Text(
                              banner['title'] ?? '',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 13),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
              ),
            ),

          // Pre-orders Horizontal Carousel
          PreorderCarouselWidget(
            preorders: _preorders,
            onProductTap: (product) {
              showProductDetailsModal(
                context: context,
                product: product,
                onAddToCart: widget.onAddToCart,
                onOpenCart: widget.onOpenCart,
              );
            },
            onAddToCart: widget.onAddToCart,
          ),

          // Sticky Category Circles Row
          SliverPersistentHeader(
            pinned: true,
            delegate: _SliverCategoryDelegate(
              child: CategoryCirclesWidget(
                parentCategories: _parentCategories,
                activeCategory: _activeCategory,
                onSelectCategory: (categoryName) {
                  setState(() {
                    _activeCategory = categoryName;
                    _activeSubCategoryId = null;
                  });
                  _loadData();
                },
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
                      _buildSubCategoryPill(
                        'ALL',
                        null,
                        _activeSubCategoryId == null,
                      ),
                      ...subCats.map((sub) {
                        final id = sub['id']?.toString();
                        return _buildSubCategoryPill(
                          sub['name']?.toString() ?? '',
                          id,
                          _activeSubCategoryId == id,
                        );
                      }),
                    ],
                  ),
                ),
              ),
            ),

          // Product Grid List
          _loading
              ? const SliverFillRemaining(child: Center(child: CircularProgressIndicator(color: AppConstants.headerEmerald)))
              : _filteredProducts.isEmpty
                  ? SliverFillRemaining(
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.set_meal_outlined, size: 48, color: Colors.grey),
                            SizedBox(height: 12),
                            Text('No products found matching your search or category.', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
                          ],
                        ),
                      ),
                    )
                  : SliverPadding(
                      padding: const EdgeInsets.all(16),
                      sliver: SliverGrid(
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.78,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                        ),
                        delegate: SliverChildBuilderDelegate(
                          (context, index) {
                            final product = _filteredProducts[index];
                            final variants = product['product_variants'] as List? ?? [];
                            final pId = product['id'].toString();

                            final activeVariant = _getSelectedVariant(pId, variants);

                            final originalPrice = num.tryParse(activeVariant?['original_price']?.toString() ?? product['original_price']?.toString() ?? '0') ?? 0;
                            final productOriginalPrice = num.tryParse(product['original_price']?.toString() ?? '0') ?? 0;
                            final resolvedOriginalPrice = originalPrice > 0 ? originalPrice : productOriginalPrice;

                            final variantDiscount = num.tryParse(activeVariant?['discount']?.toString() ?? activeVariant?['discount_percent']?.toString() ?? '0') ?? 0;
                            final productDiscount = num.tryParse(product['discount']?.toString() ?? product['discount_percent']?.toString() ?? '0') ?? 0;
                            final discountPercent = variantDiscount > 0 ? variantDiscount : productDiscount;

                            final currentPrice = num.tryParse(activeVariant?['price']?.toString() ?? product['price']?.toString() ?? '150') ?? 150;

                            final hasDiscount = discountPercent > 0 || resolvedOriginalPrice > currentPrice;
                            final effectiveDiscount = discountPercent > 0 ? discountPercent.round() : (hasDiscount && resolvedOriginalPrice > currentPrice ? (((resolvedOriginalPrice - currentPrice) / resolvedOriginalPrice) * 100).round() : 0);
                            final displayOriginalPrice = resolvedOriginalPrice > currentPrice ? resolvedOriginalPrice : (effectiveDiscount > 0 ? (currentPrice / (1 - (effectiveDiscount / 100))).round() : 0);

                            final comboId = '$pId-${activeVariant?['id'] ?? pId}';
                            final cartMatch = widget.cartItems.firstWhere(
                              (i) => (i['product_id'] ?? i['id']).toString() == pId &&
                                     i['variant_id']?.toString() == activeVariant?['id']?.toString(),
                              orElse: () => {},
                            );
                            final cartQuantity = int.tryParse(cartMatch['quantity']?.toString() ?? '0') ?? 0;

                            return ProductCardWidget(
                              product: product,
                              activeVariant: activeVariant,
                              effectiveDiscount: effectiveDiscount,
                              currentPrice: currentPrice,
                              displayOriginalPrice: displayOriginalPrice,
                              variants: variants,
                              pId: pId,
                              selectedVariantId: activeVariant?['id']?.toString(),
                              cartQuantity: cartQuantity,
                              onSelectVariant: (prodId, varId) {
                                setState(() {
                                  _selectedVariantIdMap[prodId] = varId;
                                });
                              },
                              onTap: () {
                                showProductDetailsModal(
                                  context: context,
                                  product: product,
                                  onAddToCart: widget.onAddToCart,
                                  onOpenCart: widget.onOpenCart,
                                );
                              },
                              onAddToCart: () {
                                final varId = activeVariant?['id']?.toString();
                                widget.onAddToCart({
                                  'id': comboId,
                                  'product_id': pId,
                                  'variant_id': varId,
                                  'name': product['name'],
                                  'price': currentPrice,
                                  'unit': activeVariant?['unit'] ?? 'pack',
                                  'img': product['image_url'],
                                  'quantity': 1,
                                });
                              },
                              onIncrement: () {
                                final varId = activeVariant?['id']?.toString();
                                widget.onAddToCart({
                                  'id': comboId,
                                  'product_id': pId,
                                  'variant_id': varId,
                                  'name': product['name'],
                                  'price': currentPrice,
                                  'unit': activeVariant?['unit'] ?? 'pack',
                                  'img': product['image_url'],
                                  'quantity': 1,
                                });
                              },
                              onDecrement: () {
                                widget.onUpdateCartQuantity(comboId, cartQuantity - 1);
                              },
                            );
                          },
                          childCount: _filteredProducts.length,
                        ),
                      ),
                    ),
        ],
      ),
    );
  }
}

class _SliverCategoryDelegate extends SliverPersistentHeaderDelegate {
  final Widget child;
  _SliverCategoryDelegate({required this.child});

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return child;
  }

  @override
  double get maxExtent => 100;

  @override
  double get minExtent => 100;

  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) => true;
}
