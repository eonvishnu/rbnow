import 'package:flutter/material.dart';
import '../config/constants.dart';

class CartItemModel {
  final String id;
  final String productId;
  final String? variantId;
  final String name;
  final num price;
  final String unit;
  final String? img;
  int quantity;
  final bool isPreorder;
  final String? expectedDispatchDate;

  CartItemModel({
    required this.id,
    required this.productId,
    this.variantId,
    required this.name,
    required this.price,
    required this.unit,
    this.img,
    this.quantity = 1,
    this.isPreorder = false,
    this.expectedDispatchDate,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'product_id': productId,
        'variant_id': variantId,
        'name': name,
        'price': price,
        'unit': unit,
        'img': img,
        'quantity': quantity,
        'is_preorder': isPreorder,
        'expected_dispatch_date': expectedDispatchDate,
      };
}

class CartProviderModel extends ChangeNotifier {
  final List<CartItemModel> _items = [];

  List<CartItemModel> get items => _items;

  int get totalCount => _items.fold(0, (sum, item) => sum + item.quantity);
  num get totalAmount => _items.fold(0, (sum, item) => sum + (item.price * item.quantity));

  void addToCart(Map<String, dynamic> itemData, {BuildContext? context}) {
    final prodId = (itemData['product_id'] ?? itemData['id']).toString();
    final varId = itemData['variant_id']?.toString();
    final addQty = int.tryParse(itemData['quantity']?.toString() ?? '1') ?? 1;

    final existingIndex = _items.indexWhere((i) => i.productId == prodId && i.variantId == varId);
    if (existingIndex != -1) {
      _items[existingIndex].quantity += addQty;
    } else {
      _items.add(
        CartItemModel(
          id: itemData['id']?.toString() ?? prodId,
          productId: prodId,
          variantId: varId,
          name: itemData['name']?.toString() ?? 'Product',
          price: num.tryParse(itemData['price']?.toString() ?? '150') ?? 150,
          unit: itemData['unit']?.toString() ?? 'pack',
          img: itemData['img']?.toString(),
          quantity: addQty,
          isPreorder: itemData['is_preorder'] == true,
          expectedDispatchDate: itemData['expected_dispatch_date']?.toString(),
        ),
      );
    }
    notifyListeners();
    if (context != null) {
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(
        SnackBar(
          content: Text('${itemData['name']} added to cart!'),
          duration: const Duration(seconds: 2),
          backgroundColor: AppConstants.primaryDarkEmerald,
        ),
      );
    }
  }

  void updateQuantity(String id, int qty) {
    final index = _items.indexWhere((i) => i.id == id || i.productId == id);
    if (index != -1) {
      if (qty <= 0) {
        _items.removeAt(index);
      } else {
        _items[index].quantity = qty;
      }
      notifyListeners();
    }
  }

  void removeItem(String id) {
    _items.removeWhere((i) => i.id == id || i.productId == id);
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
  }
}

class CartProvider extends InheritedNotifier<CartProviderModel> {
  const CartProvider({
    super.key,
    required CartProviderModel notifier,
    required super.child,
  }) : super(notifier: notifier);

  static CartProviderModel of(BuildContext context) {
    final provider = context.dependOnInheritedWidgetOfExactType<CartProvider>();
    assert(provider != null, 'No CartProvider found in context');
    return provider!.notifier!;
  }
}
