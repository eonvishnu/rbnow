import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'config/constants.dart';
import 'screens/home_screen.dart';
import 'screens/cart_screen.dart';
import 'screens/login_screen.dart';
import 'screens/orders_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: AppConstants.supabaseUrl,
    anonKey: AppConstants.supabaseAnonKey,
  );

  runApp(const RoyalBengalApp());
}

class RoyalBengalApp extends StatefulWidget {
  const RoyalBengalApp({super.key});

  @override
  State<RoyalBengalApp> createState() => _RoyalBengalAppState();
}

class _RoyalBengalAppState extends State<RoyalBengalApp> {
  int _currentIndex = 0;
  final List<Map<String, dynamic>> _cartItems = [];

  void _addToCart(Map<String, dynamic> item) {
    setState(() {
      _cartItems.add(item);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${item['name']} added to cart!'),
        duration: const Duration(seconds: 2),
        backgroundColor: AppConstants.primaryDarkEmerald,
      ),
    );
  }

  void _removeFromCart(String id) {
    setState(() {
      _cartItems.removeWhere((item) => item['id'].toString() == id);
    });
  }

  void _clearCart() {
    setState(() {
      _cartItems.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Royal Bengal',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppConstants.headerEmerald,
          primary: AppConstants.headerEmerald,
          secondary: AppConstants.royalGold,
        ),
        useMaterial3: true,
      ),
      home: Scaffold(
        body: IndexedStack(
          index: _currentIndex,
          children: [
            HomeScreen(
              onOpenCart: () => setState(() => _currentIndex = 2),
              onAddToCart: _addToCart,
            ),
            OrdersScreen(
              onBrowseMenu: () => setState(() => _currentIndex = 0),
            ),
            CartScreen(
              cartItems: _cartItems,
              onClearCart: _clearCart,
              onRemoveItem: _removeFromCart,
            ),
            const LoginScreen(),
          ],
        ),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          selectedItemColor: AppConstants.royalGold,
          unselectedItemColor: Colors.white70,
          backgroundColor: AppConstants.primaryDarkEmerald,
          type: BottomNavigationBarType.fixed,
          selectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
          unselectedLabelStyle: const TextStyle(fontSize: 10),
          items: [
            const BottomNavigationBarItem(icon: Icon(Icons.home), label: 'HOME'),
            const BottomNavigationBarItem(icon: Icon(Icons.inventory), label: 'ORDERS'),
            BottomNavigationBarItem(
              icon: Stack(
                children: [
                  const Icon(Icons.shopping_bag),
                  if (_cartItems.isNotEmpty)
                    Positioned(
                      right: 0,
                      top: 0,
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: const BoxDecoration(color: AppConstants.royalGold, shape: BoxShape.circle),
                        constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                        child: Text(
                          '${_cartItems.length}',
                          style: const TextStyle(color: AppConstants.primaryDarkEmerald, fontSize: 9, fontWeight: FontWeight.bold),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              ),
              label: 'CART',
            ),
            const BottomNavigationBarItem(icon: Icon(Icons.person), label: 'ACCOUNT'),
          ],
        ),
      ),
    );
  }
}
