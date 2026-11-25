import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'config/constants.dart';
import 'services/notification_service.dart';
import 'screens/home_screen.dart';
import 'screens/cart_screen.dart';
import 'screens/login_screen.dart';
import 'screens/orders_screen.dart';
import 'screens/account_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const RoyalBengalAppLoader());
}

class RoyalBengalAppLoader extends StatefulWidget {
  const RoyalBengalAppLoader({super.key});

  @override
  State<RoyalBengalAppLoader> createState() => _RoyalBengalAppLoaderState();
}

class _RoyalBengalAppLoaderState extends State<RoyalBengalAppLoader> {
  bool _initializing = true;
  bool _supabaseInitialized = false;

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    setState(() => _initializing = true);

    try {
      await Supabase.initialize(
        url: AppConstants.supabaseUrl,
        anonKey: AppConstants.supabaseAnonKey,
      );
      _supabaseInitialized = true;
    } catch (e) {
      debugPrint("Supabase init error: $e");
      _supabaseInitialized = false;
    }

    if (mounted) {
      setState(() => _initializing = false);
    }

    // Initialize Firebase and notifications in background without blocking startup (Mobile only)
    if (!kIsWeb) {
      Future.microtask(() async {
        try {
          await Firebase.initializeApp();
          await NotificationService.instance.initialize();
        } catch (e) {
          debugPrint("Background Firebase/Notification init error: $e");
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_initializing) {
      return MaterialApp(
        title: 'RB fresh',
        debugShowCheckedModeBanner: false,
        home: Scaffold(
          backgroundColor: AppConstants.warmCreamBackground,
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                CircularProgressIndicator(color: AppConstants.headerEmerald),
                SizedBox(height: 16),
                Text('Loading RB fresh...', style: TextStyle(fontWeight: FontWeight.bold, color: AppConstants.darkCharcoalText)),
              ],
            ),
          ),
        ),
      );
    }

    if (!_supabaseInitialized) {
      return MaterialApp(
        title: 'RB fresh',
        debugShowCheckedModeBanner: false,
        home: Scaffold(
          backgroundColor: AppConstants.warmCreamBackground,
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 64, color: Colors.red),
                  const SizedBox(height: 16),
                  const Text(
                    'Connection Error',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppConstants.darkCharcoalText),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Failed to connect to backend server. Please check your internet connection and try again.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 13, color: AppConstants.mutedGreyText),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: _initializeApp,
                    style: ElevatedButton.styleFrom(backgroundColor: AppConstants.royalGold, foregroundColor: AppConstants.headerEmerald),
                    child: const Text('RETRY', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    return const RoyalBengalApp();
  }
}

class RoyalBengalApp extends StatefulWidget {
  const RoyalBengalApp({super.key});

  @override
  State<RoyalBengalApp> createState() => _RoyalBengalAppState();
}

class _RoyalBengalAppState extends State<RoyalBengalApp> {
  int _currentIndex = 0;
  bool _skippedLogin = false;
  final List<Map<String, dynamic>> _cartItems = [];
  User? _currentUser;
  late final StreamSubscription<AuthState> _authSubscription;

  @override
  void initState() {
    super.initState();
    _currentUser = Supabase.instance.client.auth.currentUser;
    _authSubscription = Supabase.instance.client.auth.onAuthStateChange.listen((data) {
      if (!mounted) return;
      setState(() {
        _currentUser = data.session?.user;
        if (_currentUser != null) {
          _skippedLogin = false;
        }
      });
    });
  }

  @override
  void dispose() {
    _authSubscription.cancel();
    super.dispose();
  }

  bool get _shouldShowLoginFirst {
    return _currentUser == null && !_skippedLogin;
  }

  bool _sameCartItem(Map<String, dynamic> a, Map<String, dynamic> b) {
    final aProdId = (a['product_id'] ?? a['id']).toString();
    final bProdId = (b['product_id'] ?? b['id']).toString();

    final aVarId = a['variant_id']?.toString();
    final bVarId = b['variant_id']?.toString();

    return aProdId == bProdId && aVarId == bVarId;
  }

  void _addToCart(Map<String, dynamic> item) {
    setState(() {
      final index = _cartItems.indexWhere((element) => _sameCartItem(element, item));
      final addQty = int.tryParse(item['quantity']?.toString() ?? '1') ?? 1;
      if (index != -1) {
        final currentQty = int.tryParse(_cartItems[index]['quantity']?.toString() ?? '1') ?? 1;
        _cartItems[index]['quantity'] = currentQty + addQty;
      } else {
        final newItem = Map<String, dynamic>.from(item);
        newItem['quantity'] = addQty;
        _cartItems.add(newItem);
      }
    });
    ScaffoldMessenger.maybeOf(context)?.showSnackBar(
      SnackBar(
        content: Text('${item['name']} added to cart!'),
        duration: const Duration(seconds: 2),
        backgroundColor: AppConstants.primaryDarkEmerald,
      ),
    );
  }

  void _updateCartQuantity(String id, int quantity) {
    setState(() {
      if (quantity <= 0) {
        _cartItems.removeWhere((item) => item['id'].toString() == id);
        return;
      }
      final index = _cartItems.indexWhere((item) => item['id'].toString() == id);
      if (index != -1) {
        _cartItems[index]['quantity'] = quantity;
      }
    });
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

  int get _totalCartCount {
    return _cartItems.fold(0, (sum, item) {
      final q = int.tryParse(item['quantity']?.toString() ?? '');
      return sum + (q != null && q > 0 ? q : 1);
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RB fresh',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: AppConstants.warmCreamBackground,
        colorScheme: ColorScheme.light(
          primary: AppConstants.headerEmerald,
          secondary: AppConstants.royalGold,
          surface: Colors.white,
          onPrimary: Colors.white,
          onSecondary: AppConstants.headerEmerald,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: AppConstants.headerEmerald,
          foregroundColor: AppConstants.royalGold,
          elevation: 0,
        ),
        cardTheme: CardThemeData(
          color: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: const BorderSide(color: AppConstants.cardBorder),
          ),
        ),
        useMaterial3: true,
      ),
      home: _shouldShowLoginFirst
          ? LoginScreen(
              onSkip: () {
                setState(() {
                  _skippedLogin = true;
                });
              },
            )
          : Scaffold(
              body: IndexedStack(
                index: _currentIndex,
                children: [
                  HomeScreen(
                    onOpenCart: () => setState(() => _currentIndex = 2),
                    onAddToCart: _addToCart,
                    onUpdateCartQuantity: _updateCartQuantity,
                    cartItems: _cartItems,
                  ),
                  OrdersScreen(
                    onBrowseMenu: () => setState(() => _currentIndex = 0),
                  ),
                  CartScreen(
                    cartItems: _cartItems,
                    onClearCart: _clearCart,
                    onRemoveItem: _removeFromCart,
                    onUpdateQuantity: _updateCartQuantity,
                  ),
                  const AccountScreen(),
                ],
              ),
              bottomNavigationBar: Container(
                decoration: const BoxDecoration(
                  color: Color(0xFFF4EFE6),
                  border: Border(top: BorderSide(color: Color(0xFFE3D9C6))),
                ),
                child: BottomNavigationBar(
                  currentIndex: _currentIndex,
                  onTap: (index) => setState(() => _currentIndex = index),
                  selectedItemColor: const Color(0xFF004D3B),
                  unselectedItemColor: const Color(0xFF555555),
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  type: BottomNavigationBarType.fixed,
                  selectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900),
                  unselectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                  items: [
                    const BottomNavigationBarItem(icon: Icon(Icons.home), label: 'HOME'),
                    const BottomNavigationBarItem(icon: Icon(Icons.inventory), label: 'ORDERS'),
                    BottomNavigationBarItem(
                      icon: Stack(
                        children: [
                          const Icon(Icons.shopping_bag),
                          if (_totalCartCount > 0)
                            Positioned(
                              right: 0,
                              top: 0,
                              child: Container(
                                padding: const EdgeInsets.all(2),
                                decoration: const BoxDecoration(color: Color(0xFFFFC400), shape: BoxShape.circle),
                                constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                                child: Text(
                                  '$_totalCartCount',
                                  style: const TextStyle(color: Color(0xFF004D3B), fontSize: 9, fontWeight: FontWeight.bold),
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
            ),
    );
  }
}
