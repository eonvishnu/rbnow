import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/constants.dart';
import '../services/supabase_service.dart';

class CartScreen extends StatefulWidget {
  final List<Map<String, dynamic>> cartItems;
  final VoidCallback onClearCart;
  final Function(String id) onRemoveItem;

  const CartScreen({
    super.key,
    required this.cartItems,
    required this.onClearCart,
    required this.onRemoveItem,
  });

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final TextEditingController _couponController = TextEditingController();
  String? _appliedCoupon;
  int _couponDiscount = 0;
  String? _couponMessage;

  int get _subtotal {
    return widget.cartItems.fold(0, (sum, item) => sum + (int.tryParse(item['price'].toString()) ?? 150));
  }

  int get _deliveryFee => _subtotal >= 499 ? 0 : 30;
  int get _grandTotal => (_subtotal - _couponDiscount + _deliveryFee).clamp(0, 999999);

  void _applyCoupon() async {
    final code = _couponController.text.trim().toUpperCase();
    if (code.isEmpty) return;

    try {
      final res = await SupabaseService.client.from('coupons').select('*').eq('code', code).maybeSingle();
      if (res == null || res['is_active'] != true) {
        setState(() => _couponMessage = 'Invalid or expired promo code.');
        return;
      }

      final minSubtotal = int.tryParse(res['min_order_amount']?.toString() ?? '0') ?? 0;
      if (_subtotal < minSubtotal) {
        setState(() => _couponMessage = 'Minimum order amount of ₹$minSubtotal required for code $code.');
        return;
      }

      int discount = 0;
      if (res['discount_type'] == 'percentage') {
        discount = ((_subtotal * (int.tryParse(res['discount_value'].toString()) ?? 10)) / 100).floor();
        if (res['max_discount_amount'] != null) {
          discount = discount.clamp(0, int.tryParse(res['max_discount_amount'].toString()) ?? 150);
        }
      } else {
        discount = int.tryParse(res['discount_value'].toString()) ?? 50;
      }

      setState(() {
        _appliedCoupon = code;
        _couponDiscount = discount;
        _couponMessage = 'Promo code "$code" applied! You saved ₹$discount';
      });
    } catch (e) {
      setState(() => _couponMessage = 'Failed to validate promo code.');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.warmBackground,
      appBar: AppBar(
        backgroundColor: AppConstants.headerEmerald,
        elevation: 0,
        title: Text('Express Checkout', style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.w900, color: AppConstants.royalGold)),
      ),
      body: widget.cartItems.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: const BoxDecoration(color: AppConstants.lightMint, shape: BoxShape.circle),
                    child: const Icon(Icons.shopping_bag_outlined, size: 48, color: AppConstants.darkEmeraldText),
                  ),
                  const SizedBox(height: 16),
                  const Text('YOUR CART IS EMPTY', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                  const SizedBox(height: 8),
                  const Text('Explore fresh river fish, gourmet mutton & Bengal groceries.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey, fontSize: 11)),
                ],
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Address Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Row(
                      children: const [
                        Icon(Icons.location_on, color: AppConstants.darkEmeraldText, size: 24),
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('DELIVERING TO', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppConstants.darkEmeraldText)),
                              Text('HOME - 5th Floor, Mithila, Hyderabad', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Cart Items
                  ...widget.cartItems.map((item) {
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.network(
                              item['img'] ?? 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
                              width: 50,
                              height: 50,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item['name'] ?? 'Fresh Catch', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                Text('₹${item['price']} / ${item['unit']}', style: const TextStyle(color: AppConstants.darkEmeraldText, fontSize: 11, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, color: Colors.grey, size: 20),
                            onPressed: () => widget.onRemoveItem(item['id'].toString()),
                          )
                        ],
                      ),
                    );
                  }),
                  const SizedBox(height: 16),

                  // Promo Coupon Box
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: _couponController,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                decoration: const InputDecoration(
                                  hintText: 'ENTER PROMO CODE',
                                  border: InputBorder.none,
                                ),
                              ),
                            ),
                            ElevatedButton(
                              onPressed: _applyCoupon,
                              style: ElevatedButton.styleFrom(backgroundColor: AppConstants.royalGold, foregroundColor: AppConstants.headerEmerald),
                              child: const Text('APPLY', style: TextStyle(fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                        if (_couponMessage != null)
                          Text(_couponMessage!, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: _appliedCoupon != null ? AppConstants.darkEmeraldText : Colors.red)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Bill Summary Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      children: [
                        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('Subtotal'), Text('₹$_subtotal', style: const TextStyle(fontWeight: FontWeight.bold))]),
                        if (_couponDiscount > 0)
                          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('Discount'), Text('- ₹$_couponDiscount', style: const TextStyle(fontWeight: FontWeight.bold, color: AppConstants.darkEmeraldText))]),
                        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('Delivery Fee'), Text(_deliveryFee == 0 ? 'FREE' : '₹$_deliveryFee', style: const TextStyle(fontWeight: FontWeight.bold))]),
                        const Divider(height: 24),
                        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('GRAND TOTAL', style: TextStyle(fontWeight: FontWeight.w900, color: AppConstants.headerEmerald)), Text('₹$_grandTotal', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 20, color: AppConstants.headerEmerald))]),
                        const SizedBox(height: 20),

                        SizedBox(
                          width: double.infinity,
                          height: 52,
                          child: ElevatedButton(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Order Placed Successfully!')));
                              widget.onClearCart();
                              Navigator.pop(context);
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppConstants.royalGold,
                              foregroundColor: AppConstants.headerEmerald,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                            child: const Text('PLACE ORDER & PAY', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 1.5)),
                          ),
                        )
                      ],
                    ),
                  )
                ],
              ),
            ),
    );
  }
}
