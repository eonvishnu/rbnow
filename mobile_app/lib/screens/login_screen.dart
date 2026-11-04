import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/constants.dart';
import '../services/supabase_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();

  bool _otpSent = false;
  bool _loading = false;
  String? _errorMessage;
  String? _successMessage;

  void _handleSendOtp() async {
    final cleanPhone = _phoneController.text.replaceAll(RegExp(r'\D'), '');
    final tenDigit = cleanPhone.length >= 10 ? cleanPhone.substring(cleanPhone.length - 10) : cleanPhone;

    if (!RegExp(r'^[6-9]\d{9}$').hasMatch(tenDigit)) {
      setState(() {
        _errorMessage = 'Please enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.';
      });
      return;
    }

    setState(() {
      _loading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    final res = await SupabaseService.sendMsg91Otp(tenDigit);

    if (res['error'] != null) {
      setState(() {
        _loading = false;
        _errorMessage = res['error'].toString();
      });
    } else {
      setState(() {
        _loading = false;
        _otpSent = true;
        _successMessage = 'Verification code sent to +91 $tenDigit';
      });
    }
  }

  void _handleVerifyOtp() async {
    final code = _otpController.text.trim();
    if (code.length < 4) {
      setState(() {
        _errorMessage = 'Please enter a valid verification code.';
      });
      return;
    }

    setState(() {
      _loading = true;
      _errorMessage = null;
    });

    final cleanPhone = _phoneController.text.replaceAll(RegExp(r'\D'), '');
    final tenDigit = cleanPhone.length >= 10 ? cleanPhone.substring(cleanPhone.length - 10) : cleanPhone;

    final res = await SupabaseService.verifyMsg91Token(tenDigit, code);

    if (res['success'] == true && res['email'] != null && res['password'] != null) {
      try {
        await SupabaseService.client.auth.signInWithPassword(
          email: res['email'],
          password: res['password'],
        );
        if (mounted) {
          Navigator.pop(context, true);
        }
      } catch (e) {
        if (mounted) {
          Navigator.pop(context, true);
        }
      }
    } else {
      setState(() {
        _loading = false;
        _errorMessage = res['error'] ?? 'Invalid verification code. Please try again.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.primaryDarkEmerald,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppConstants.royalGold),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Container(
            padding: const EdgeInsets.all(28.0),
            decoration: BoxDecoration(
              color: AppConstants.headerEmerald.withValues(alpha: 0.85),
              borderRadius: BorderRadius.circular(36),
              border: Border.all(color: AppConstants.royalGold.withValues(alpha: 0.8), width: 2),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.5),
                  blurRadius: 30,
                  offset: const Offset(0, 10),
                )
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Circular Logo
                Container(
                  width: 72,
                  height: 72,
                  padding: const EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppConstants.primaryDarkEmerald,
                    border: Border.all(color: AppConstants.royalGold, width: 2),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(36),
                    child: Image.asset('assets/logo.png', fit: BoxFit.cover),
                  ),
                ),
                const SizedBox(height: 16),

                Text(
                  'ROYAL BENGAL',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    color: AppConstants.royalGold,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  AppConstants.bengaliTagline,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.white70,
                  ),
                ),
                const SizedBox(height: 24),

                if (_errorMessage != null)
                  Container(
                    width: double.infinity,
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.red.shade900.withValues(alpha: 0.8),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.red.shade400),
                    ),
                    child: Text(
                      _errorMessage!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),

                if (_successMessage != null)
                  Container(
                    width: double.infinity,
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppConstants.primaryDarkEmerald,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppConstants.royalGold),
                    ),
                    child: Text(
                      _successMessage!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: AppConstants.royalGold, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),

                if (!_otpSent) ...[
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'MOBILE NUMBER',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: AppConstants.royalGold.withValues(alpha: 0.9),
                        letterSpacing: 1.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),

                  TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    maxLength: 10,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                    decoration: InputDecoration(
                      prefixIcon: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                        child: Text('+91', style: TextStyle(color: AppConstants.royalGold, fontWeight: FontWeight.w900, fontSize: 16)),
                      ),
                      counterText: '',
                      hintText: '10-digit mobile number',
                      hintStyle: const TextStyle(color: Colors.white38, fontSize: 14),
                      filled: true,
                      fillColor: AppConstants.primaryDarkEmerald,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                        borderSide: const BorderSide(color: AppConstants.royalGold, width: 2),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                        borderSide: const BorderSide(color: AppConstants.royalGold, width: 2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: _loading ? null : _handleSendOtp,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppConstants.royalGold,
                        foregroundColor: AppConstants.primaryDarkEmerald,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        elevation: 4,
                      ),
                      child: _loading
                          ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2.5, color: AppConstants.primaryDarkEmerald))
                          : const Text('CONTINUE', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 2)),
                    ),
                  ),
                ] else ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'VERIFICATION CODE',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          color: AppConstants.royalGold.withValues(alpha: 0.9),
                          letterSpacing: 1.5,
                        ),
                      ),
                      GestureDetector(
                        onTap: () => setState(() => _otpSent = false),
                        child: const Text('Change Number', style: TextStyle(color: AppConstants.royalGold, fontSize: 10, fontWeight: FontWeight.bold, decoration: TextDecoration.underline)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  TextField(
                    controller: _otpController,
                    keyboardType: TextInputType.number,
                    maxLength: 6,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: AppConstants.royalGold, fontWeight: FontWeight.w900, fontSize: 24, letterSpacing: 8),
                    decoration: InputDecoration(
                      counterText: '',
                      hintText: '• • • • • •',
                      hintStyle: const TextStyle(color: Colors.white24, fontSize: 20),
                      filled: true,
                      fillColor: AppConstants.primaryDarkEmerald,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                        borderSide: const BorderSide(color: AppConstants.royalGold, width: 2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: _loading ? null : _handleVerifyOtp,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppConstants.royalGold,
                        foregroundColor: AppConstants.primaryDarkEmerald,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        elevation: 4,
                      ),
                      child: _loading
                          ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2.5, color: AppConstants.primaryDarkEmerald))
                          : const Text('VERIFY & PROCEED', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 2)),
                    ),
                  ),
                ],

                const SizedBox(height: 20),
                const Divider(color: Colors.white24),
                const SizedBox(height: 12),

                GestureDetector(
                  onTap: () async {
                    const url = 'https://rbnow.in/privacy';
                    if (await canLaunchUrl(Uri.parse(url))) {
                      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
                    }
                  },
                  child: const Text(
                    "By continuing, you agree to Royal Bengal's Terms of Service & Privacy Policy.",
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white60, fontSize: 10, height: 1.4),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
