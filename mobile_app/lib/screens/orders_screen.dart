import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/constants.dart';
import '../services/supabase_service.dart';

class OrdersScreen extends StatefulWidget {
  final VoidCallback onBrowseMenu;

  const OrdersScreen({super.key, required this.onBrowseMenu});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  int _activeTab = 0; // 0: Active Orders, 1: Past Orders
  List<Map<String, dynamic>> _orders = [];
  bool _loading = true;
  final Map<String, bool> _expandedMap = {};

  @override
  void initState() {
    super.initState();
    _fetchCustomerOrders();
  }

  void _fetchCustomerOrders() async {
    final user = SupabaseService.client.auth.currentUser;
    if (user == null) {
      setState(() => _loading = false);
      return;
    }

    final data = await SupabaseService.getCustomerOrders(user.id);
    setState(() {
      _orders = data;
      _loading = false;

      // Smart initial expansion: if 1 active order, expand by default
      final activeList = _orders.where((o) => o['status'] != 'delivered' && o['status'] != 'cancelled').toList();
      if (activeList.length == 1) {
        _expandedMap[activeList[0]['id'].toString()] = true;
      }
    });
  }

  List<Map<String, dynamic>> get _activeOrders {
    return _orders.where((o) => o['status'] != 'delivered' && o['status'] != 'cancelled').toList();
  }

  List<Map<String, dynamic>> get _pastOrders {
    return _orders.where((o) => o['status'] == 'delivered' || o['status'] == 'cancelled').toList();
  }

  Widget _buildEmptyState() {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 24),
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 10)],
      ),
      child: Column(
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: AppConstants.lightMint,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppConstants.mintBorder),
            ),
            child: const Icon(Icons.inventory_2_outlined, color: AppConstants.headerEmerald, size: 36),
          ),
          const SizedBox(height: 16),

          Text(
            'NO ROYAL ORDERS YET',
            style: GoogleFonts.montserrat(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.grey.shade900, letterSpacing: 0.5),
          ),
          const SizedBox(height: 6),

          const Text(
            'EXPLORE FRESH RIVER FISH, MUTTON & AUTHENTIC BENGAL GROCERIES.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1.2, height: 1.4),
          ),
          const SizedBox(height: 20),

          SizedBox(
            height: 48,
            child: ElevatedButton(
              onPressed: widget.onBrowseMenu,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppConstants.headerEmerald,
                foregroundColor: AppConstants.royalGold,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                padding: const EdgeInsets.symmetric(horizontal: 32),
                elevation: 3,
              ),
              child: const Text('BROWSE MENU', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 11, letterSpacing: 2)),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.warmBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppConstants.darkCharcoalText),
          onPressed: widget.onBrowseMenu,
        ),
        title: Text(
          'ROYAL BENGAL',
          style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.w900, color: AppConstants.headerEmerald, letterSpacing: 1.5),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12.0),
            child: TextButton.icon(
              onPressed: widget.onBrowseMenu,
              style: TextButton.styleFrom(
                backgroundColor: AppConstants.lightMint,
                foregroundColor: AppConstants.darkEmeraldText,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: const BorderSide(color: AppConstants.mintBorder),
                ),
              ),
              icon: const Icon(Icons.eco, size: 14, color: AppConstants.darkEmeraldText),
              label: const Text('SHOP FRESH', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 10)),
            ),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppConstants.headerEmerald))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  // 50% / 50% Even Split Tabs Bar
                  Container(
                    decoration: BoxDecoration(border: Border(bottom: BorderSide(color: Colors.grey.shade300))),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _activeTab = 0),
                            child: Container(
                              padding: const EdgeInsets.only(bottom: 12),
                              decoration: BoxDecoration(
                                border: Border(
                                  bottom: BorderSide(
                                    color: _activeTab == 0 ? AppConstants.headerEmerald : Colors.transparent,
                                    width: 3,
                                  ),
                                ),
                              ),
                              child: Text(
                                'ACTIVE ORDERS (${_activeOrders.length})',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w900,
                                  color: _activeTab == 0 ? AppConstants.headerEmerald : Colors.grey,
                                  letterSpacing: 1,
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _activeTab = 1),
                            child: Container(
                              padding: const EdgeInsets.only(bottom: 12),
                              decoration: BoxDecoration(
                                border: Border(
                                  bottom: BorderSide(
                                    color: _activeTab == 1 ? AppConstants.headerEmerald : Colors.transparent,
                                    width: 3,
                                  ),
                                ),
                              ),
                              child: Text(
                                'PAST ORDERS (${_pastOrders.length})',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w900,
                                  color: _activeTab == 1 ? AppConstants.headerEmerald : Colors.grey,
                                  letterSpacing: 1,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // TAB CONTENT
                  if (_activeTab == 0) ...[
                    if (_activeOrders.isEmpty)
                      _buildEmptyState()
                    else
                      ..._activeOrders.map((order) => _buildOrderCard(order)),
                  ] else ...[
                    if (_pastOrders.isEmpty)
                      _buildEmptyState()
                    else
                      ..._pastOrders.map((order) => _buildOrderCard(order)),
                  ]
                ],
              ),
            ),
    );
  }

  Widget _buildOrderCard(Map<String, dynamic> order) {
    final idStr = order['id'].toString();
    final isExpanded = _expandedMap[idStr] == true;
    final orderId = 'RB-${order['order_number'] ?? idStr.substring(0, 5).toUpperCase()}';
    final status = order['status'] ?? 'pending';

    return Container(
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 8)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Text(orderId, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppConstants.headerEmerald)),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: Colors.amber.shade100, borderRadius: BorderRadius.circular(12)),
                    child: Text(status, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.amber.shade900)),
                  ),
                ],
              ),

              OutlinedButton.icon(
                onPressed: () async {
                  const url = 'tel:+916304076069';
                  if (await canLaunchUrl(Uri.parse(url))) await launchUrl(Uri.parse(url));
                },
                icon: const Icon(Icons.phone, size: 12, color: AppConstants.headerEmerald),
                label: const Text('Call Support', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppConstants.headerEmerald)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppConstants.headerEmerald, width: 1.5),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                ),
              ),
            ],
          ),

          const SizedBox(height: 8),
          const Text("We're preparing your order.", style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: AppConstants.headerEmerald)),
          const Text("Your payment is confirmed. We'll notify you when your order is ready for dispatch.", style: TextStyle(fontSize: 11, color: Colors.grey)),
          const SizedBox(height: 16),

          // 5-Stage Vertical Stepper
          _buildStageRow('Placed & Paid', 'Payment confirmed successfully.', true, true),
          _buildStageRow('Processing & Packing', 'Your items are being checked and packed.', status != 'pending', false),
          _buildStageRow('Ready for Dispatch', 'Your order is ready for delivery assignment.', status == 'ready_for_dispatch' || status == 'out_for_delivery' || status == 'delivered', false),
          _buildStageRow('Out for Delivery', 'Handed to delivery partner.', status == 'out_for_delivery' || status == 'delivered', false),
          _buildStageRow('Delivered', 'Delivered to your address.', status == 'delivered', false),

          const Divider(height: 24),

          // Address & Total Summary
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppConstants.lightMint,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppConstants.mintBorder),
            ),
            child: Row(
              children: [
                const Icon(Icons.location_on, color: AppConstants.darkEmeraldText, size: 18),
                const SizedBox(width: 8),
                const Expanded(
                  child: Text('HOME - 5th Floor, Mithila, Hyderabad', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                ),
                Container(height: 20, width: 1, color: AppConstants.mintBorder),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Text('Total Paid', style: TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.bold)),
                    Text('₹${order['total'] ?? 294}', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppConstants.headerEmerald)),
                  ],
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStageRow(String title, String subtitle, bool isDone, bool isFirst) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isDone ? AppConstants.darkEmeraldText : Colors.grey.shade200,
            ),
            child: Icon(Icons.check, size: 14, color: isDone ? Colors.white : Colors.grey),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, color: isDone ? AppConstants.darkCharcoalText : Colors.grey)),
                Text(subtitle, style: const TextStyle(fontSize: 10, color: Colors.grey)),
              ],
            ),
          )
        ],
      ),
    );
  }
}
