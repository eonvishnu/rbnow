import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../config/constants.dart';
import '../services/supabase_service.dart';

class CartScreen extends StatefulWidget {
  final List<Map<String, dynamic>> cartItems;
  final VoidCallback onClearCart;
  final Function(String id) onRemoveItem;
  final Function(String id, int quantity) onUpdateQuantity;

  const CartScreen({
    super.key,
    required this.cartItems,
    required this.onClearCart,
    required this.onRemoveItem,
    required this.onUpdateQuantity,
  });

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final TextEditingController _couponController = TextEditingController();
  String? _appliedCoupon;
  int _couponDiscount = 0;
  String? _couponMessage;
  bool _isCheckingOut = false;
  late Razorpay _razorpay;

  @override
  void initState() {
    super.initState();
    if (!kIsWeb) {
      _razorpay = Razorpay();
      _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
      _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
      _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
    }
  }

  @override
  void dispose() {
    _couponController.dispose();
    if (!kIsWeb) {
      _razorpay.clear();
    }
    super.dispose();
  }

  int get _subtotal {
    return widget.cartItems.fold(0, (sum, item) {
      final price = int.tryParse(item['price']?.toString() ?? '150') ?? 150;
      final qty = int.tryParse(item['quantity']?.toString() ?? '1') ?? 1;
      return sum + (price * qty);
    });
  }

  int get _deliveryFee => _subtotal >= 499 ? 0 : 30;
  int get _grandTotal => (_subtotal - _couponDiscount + _deliveryFee).clamp(0, 999999);

  void _applyCoupon() async {
    final code = _couponController.text.trim().toUpperCase();
    if (code.isEmpty) return;

    try {
      final res = await SupabaseService.client.from('coupons').select('*').eq('code', code).maybeSingle();
      if (!mounted) return;

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
      if (!mounted) return;
      setState(() => _couponMessage = 'Failed to validate promo code.');
    }
  }

  void _handleCheckout() async {
    final user = SupabaseService.client.auth.currentUser;
    if (user == null) {
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(
        const SnackBar(content: Text('Please sign in or continue as guest to place an order.')),
      );
      return;
    }

    setState(() => _isCheckingOut = true);

    try {
      final orderItems = widget.cartItems.map((item) => {
        'product_id': item['product_id'] ?? item['id'],
        'variant_id': item['variant_id'],
        'quantity': int.tryParse(item['quantity']?.toString() ?? '1') ?? 1,
      }).toList();

      // 1. Initialize order & payment attempt on backend
      final res = await SupabaseService.client.functions.invoke('place-order', body: {
        'items': orderItems,
        'coupon_code': _appliedCoupon,
      });

      if (!mounted) return;

      final data = res.data;
      if (data == null || (data is Map && data['success'] != true)) {
        throw Exception(data is Map ? (data['error'] ?? 'Order creation failed') : 'Order creation failed');
      }

      final keyId = data['keyId'];
      final razorpayOrderId = data['razorpayOrderId'];
      final amountInPaise = (num.parse(data['total'].toString()) * 100).toInt();

      // 2. Open Razorpay Checkout SDK
      var options = {
        'key': keyId,
        'amount': amountInPaise,
        'name': 'The Royal Bengal Fresh',
        'description': 'Gourmet Order Payment',
        'order_id': razorpayOrderId,
        'prefill': {
          'contact': user.phone ?? '',
          'email': user.email ?? ''
        },
        'theme': {'color': '#004D3B'}
      };

      if (!kIsWeb) {
        _razorpay.open(options);
      } else {
        ScaffoldMessenger.maybeOf(context)?.showSnackBar(
          const SnackBar(content: Text('Web checkout simulation: Payment verified!')),
        );
        await _verifyPaymentAndComplete(razorpayOrderId, 'pay_mock_${DateTime.now().millisecondsSinceEpoch}', '0' * 64);
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(
        SnackBar(content: Text('Checkout Error: $e'), backgroundColor: Colors.red),
      );
      setState(() => _isCheckingOut = false);
    }
  }

  Future<void> _verifyPaymentAndComplete(String orderId, String paymentId, String signature) async {
    try {
      await SupabaseService.client.functions.invoke('verify-payment', body: {
        'razorpay_order_id': orderId,
        'razorpay_payment_id': paymentId,
        'razorpay_signature': signature,
      });

      if (!mounted) return;

      widget.onClearCart();
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(
        const SnackBar(
          content: Text('Payment Verified & Order Placed Successfully!'),
          backgroundColor: AppConstants.primaryDarkEmerald,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(
        SnackBar(content: Text('Payment verification failed: $e'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _isCheckingOut = false);
    }
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    await _verifyPaymentAndComplete(
      response.orderId ?? response.paymentId ?? '',
      response.paymentId ?? '',
      response.signature ?? '',
    );
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    if (!mounted) return;
    setState(() => _isCheckingOut = false);
    ScaffoldMessenger.maybeOf(context)?.showSnackBar(
      SnackBar(content: Text('Payment Failed: ${response.message ?? 'Cancelled'}'), backgroundColor: Colors.red),
    );
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    if (!mounted) return;
    setState(() => _isCheckingOut = false);
    ScaffoldMessenger.maybeOf(context)?.showSnackBar(
      SnackBar(content: Text('External Wallet Selected: ${response.walletName}')),
    );
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

                  ...widget.cartItems.map((item) {
                    final qty = int.tryParse(item['quantity']?.toString() ?? '1') ?? 1;
                    final price = int.tryParse(item['price']?.toString() ?? '150') ?? 150;
                    final itemId = item['id'].toString();

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
                                Text('₹$price / ${item['unit']}', style: const TextStyle(color: AppConstants.darkEmeraldText, fontSize: 11, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                          Row(
                            children: [
                              InkWell(
                                onTap: () => widget.onUpdateQuantity(itemId, qty - 1),
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(color: AppConstants.lightMint, borderRadius: BorderRadius.circular(6)),
                                  child: const Icon(Icons.remove, size: 14, color: AppConstants.darkEmeraldText),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 8),
                                child: Text('$qty', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
                              ),
                              InkWell(
                                onTap: () => widget.onUpdateQuantity(itemId, qty + 1),
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(color: AppConstants.lightMint, borderRadius: BorderRadius.circular(6)),
                                  child: const Icon(Icons.add, size: 14, color: AppConstants.darkEmeraldText),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, color: Colors.grey, size: 18),
                            onPressed: () => widget.onRemoveItem(itemId),
                          )
                        ],
                      ),
                    );
                  }),
                  const SizedBox(height: 16),

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
                            onPressed: _isCheckingOut ? null : _handleCheckout,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppConstants.royalGold,
                              foregroundColor: AppConstants.headerEmerald,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                            child: _isCheckingOut
                                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: AppConstants.headerEmerald))
                                : const Text('PLACE ORDER & PAY', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 1.5)),
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
