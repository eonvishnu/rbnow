import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/constants.dart';
import 'login_screen.dart';

class AccountScreen extends StatefulWidget {
  const AccountScreen({super.key});

  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  User? _user;
  num _walletBalance = 0;
  bool _loadingWallet = false;

  @override
  void initState() {
    super.initState();
    _user = Supabase.instance.client.auth.currentUser;
    if (_user != null) {
      _fetchWallet();
    }
    Supabase.instance.client.auth.onAuthStateChange.listen((data) {
      if (mounted) {
        setState(() {
          _user = data.session?.user;
          if (_user != null) {
            _fetchWallet();
          }
        });
      }
    });
  }

  Future<void> _fetchWallet() async {
    if (_user == null) return;
    setState(() => _loadingWallet = true);
    try {
      final res = await Supabase.instance.client
          .from('customer_wallets')
          .select('balance')
          .eq('user_id', _user!.id)
          .maybeSingle();
      if (res != null) {
        setState(() => _walletBalance = num.tryParse(res['balance'].toString()) ?? 0);
      }
    } catch (e) {
      debugPrint('Error fetching wallet: $e');
    } finally {
      if (mounted) setState(() => _loadingWallet = false);
    }
  }

  Future<void> _handleLogout() async {
    await Supabase.instance.client.auth.signOut();
  }

  @override
  Widget build(BuildContext context) {
    if (_user == null) {
      return const LoginScreen();
    }

    return Scaffold(
      backgroundColor: AppConstants.warmCreamBackground,
      appBar: AppBar(
        backgroundColor: AppConstants.headerEmerald,
        title: const Text('My Account', style: TextStyle(fontWeight: FontWeight.w900, color: AppConstants.royalGold, fontSize: 16)),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Profile Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppConstants.headerEmerald,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppConstants.royalGold.withOpacity(0.5), width: 1.5),
              ),
              child: Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppConstants.royalGold,
                    ),
                    child: Center(
                      child: Text(
                        (_user?.email?.isNotEmpty == true ? _user!.email![0] : 'U').toUpperCase(),
                        style: const TextStyle(color: AppConstants.primaryDarkEmerald, fontSize: 24, fontWeight: FontWeight.w900),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _user?.email ?? 'Royal Member',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Verified Royal Customer',
                          style: TextStyle(color: AppConstants.royalGold, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Wallet Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppConstants.cardBorder),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: const BoxDecoration(color: AppConstants.lightMint, shape: BoxShape.circle),
                        child: const Icon(Icons.wallet, color: AppConstants.darkEmeraldText, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Store Credit Balance', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppConstants.mutedGreyText)),
                          Text(_loadingWallet ? 'Loading...' : '₹$_walletBalance', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppConstants.headerEmerald)),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: AppConstants.lightMint, borderRadius: BorderRadius.circular(10)),
                    child: const Text('ACTIVE', style: TextStyle(color: AppConstants.darkEmeraldText, fontSize: 9, fontWeight: FontWeight.w900)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Logout Button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                onPressed: _handleLogout,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.red.shade700,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: Colors.red.shade200),
                  ),
                ),
                icon: const Icon(Icons.logout, size: 18),
                label: const Text('SIGN OUT', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 1.5)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
