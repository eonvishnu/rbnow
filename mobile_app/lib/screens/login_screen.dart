import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:sendotp_flutter_sdk/sendotp_flutter_sdk.dart';
import 'dart:async';
import '../config/constants.dart';
import '../services/supabase_service.dart';
import '../services/notification_service.dart';

class LoginScreen extends StatefulWidget {
  final VoidCallback? onSkip;
  const LoginScreen({super.key, this.onSkip});

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
  String? _reqId;

  // Resend timer state
  int _resendCountdown = 60;
  bool _canResend = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    OTPWidget.initializeWidget(AppConstants.msg91WidgetId, AppConstants.msg91AuthToken);
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startResendTimer() {
    setState(() {
      _resendCountdown = 60;
      _canResend = false;
    });
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendCountdown > 0) {
        setState(() {
          _resendCountdown--;
        });
      } else {
        _timer?.cancel();
        setState(() {
          _canResend = true;
        });
      }
    });
  }

  void _handleSendOtp() async {
    if (_loading) return;
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

    try {
      final Map<String, dynamic> data = {'identifier': '91$tenDigit'};
      final response = await OTPWidget.sendOTP(data);

      if (!mounted) return;

      final resMap = response is Map ? Map<String, dynamic>.from(response as Map) : <String, dynamic>{};
      final reqId = resMap['reqId']?.toString() ?? resMap['message']?.toString();

      if (resMap['type'] == 'error' || resMap['success'] == false && reqId == null) {
        setState(() {
          _loading = false;
          _errorMessage = resMap['message']?.toString() ?? 'Failed to send OTP. Please try again.';
        });
      } else {
        setState(() {
          _loading = false;
          _otpSent = true;
          _reqId = reqId;
          _successMessage = 'Verification code sent via WhatsApp to +91 $tenDigit';
        });
        _startResendTimer();
      }
    } catch (e) {
      if (!mounted) return;
      try {
        final res = await SupabaseService.sendMsg91Otp(tenDigit);
        if (!mounted) return;
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
          _startResendTimer();
        }
      } catch (fallbackErr) {
        if (!mounted) return;
        setState(() {
          _loading = false;
          _errorMessage = 'Network error sending OTP. Please try again.';
        });
      }
    }
  }

  void _handleVerifyOtp() async {
    if (_loading) return;
    final code = _otpController.text.trim();
    if (!RegExp(r'^\d{4,6}$').hasMatch(code)) {
      setState(() {
        _errorMessage = 'Please enter a valid 4 or 6-digit verification code.';
      });
      return;
    }

    setState(() {
      _loading = true;
      _errorMessage = null;
    });

    final cleanPhone = _phoneController.text.replaceAll(RegExp(r'\D'), '');
    final tenDigit = cleanPhone.length >= 10 ? cleanPhone.substring(cleanPhone.length - 10) : cleanPhone;

    try {
      String? jwtToken;
      if (_reqId != null) {
        final verifyRes = await OTPWidget.verifyOTP({
          'reqId': _reqId!,
          'otp': code,
        } as Map<String, dynamic>);

        final verifyMap = verifyRes is Map ? Map<String, dynamic>.from(verifyRes as Map) : <String, dynamic>{};
        jwtToken = verifyMap['message']?.toString() ?? verifyMap['token']?.toString() ?? verifyMap['accessToken']?.toString();
      }

      final res = await SupabaseService.verifyMsg91Token(tenDigit, jwtToken ?? code);
      if (!mounted) return;

      if (res['success'] == true && res['email'] != null && res['password'] != null) {
        try {
          await SupabaseService.client.auth.signInWithPassword(
            email: res['email'],
            password: res['password'],
          );

          NotificationService.instance.initialize().catchError((err) {
            debugPrint('Notification init warning after login: $err');
          });

          if (!mounted) return;
          Navigator.pop(context, true);
        } catch (signInErr) {
          if (!mounted) return;
          setState(() {
            _loading = false;
            _errorMessage = 'Authentication failed: $signInErr';
          });
        }
      } else {
        setState(() {
          _loading = false;
          _errorMessage = res['error'] ?? 'Invalid verification code. Please try again.';
        });
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _errorMessage = 'Verification error. Please check your network and try again.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.loginBackground,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: widget.onSkip != null ? null : IconButton(
          icon: const Icon(Icons.arrow_back, color: AppConstants.loginTextEmerald),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Container(
            padding: const EdgeInsets.all(28.0),
            decoration: BoxDecoration(
              color: AppConstants.loginBackground,
              borderRadius: BorderRadius.circular(32),
              border: Border.all(color: AppConstants.loginCardBorder, width: 2),
              boxShadow: [
                BoxShadow(
                  color: AppConstants.loginTextEmerald.withValues(alpha: 0.15),
                  blurRadius: 35,
                  offset: const Offset(0, 12),
                )
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 72,
                  height: 72,
                  padding: const EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                    border: Border.all(color: AppConstants.loginTextEmerald, width: 3),
                    boxShadow: [
                      BoxShadow(
                        color: AppConstants.loginTextEmerald.withValues(alpha: 0.13),
                        blurRadius: 18,
                        offset: const Offset(0, 4),
                      )
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(36),
                    child: Image.asset('assets/logo.png', fit: BoxFit.cover),
                  ),
                ),
                const SizedBox(height: 16),

                Text(
                  AppConstants.bengaliTagline,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: AppConstants.loginTextEmerald,
                  ),
                ),
                const SizedBox(height: 24),

                if (_errorMessage != null)
                  Container(
                    width: double.infinity,
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.red.shade300),
                    ),
                    child: Text(
                      _errorMessage!,
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.red.shade800, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),

                if (_successMessage != null)
                  Container(
                    width: double.infinity,
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8F5E5),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFA5CDB0)),
                    ),
                    child: Text(
                      _successMessage!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: AppConstants.loginTextEmerald, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),

                if (!_otpSent) ...[
                  Container(
                    width: double.infinity,
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8F5E5),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFA5CDB0)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.chat_bubble_outline, size: 14, color: AppConstants.loginTextEmerald),
                        SizedBox(width: 8),
                        Text(
                          '💬 OTP will be sent via WhatsApp',
                          style: TextStyle(color: AppConstants.loginTextEmerald, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),

                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'MOBILE NUMBER',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: AppConstants.loginTextEmerald.withValues(alpha: 0.9),
                        letterSpacing: 1.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),

                  TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    maxLength: 10,
                    style: const TextStyle(color: AppConstants.loginTextEmerald, fontWeight: FontWeight.bold, fontSize: 16),
                    decoration: InputDecoration(
                      prefixIcon: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                        child: Text('+91', style: TextStyle(color: AppConstants.loginTextEmerald, fontWeight: FontWeight.w900, fontSize: 16)),
                      ),
                      counterText: '',
                      hintText: '10-digit mobile number',
                      hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
                      filled: true,
                      fillColor: const Color(0xFFE8F5E5),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFFA5CDB0), width: 2),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: AppConstants.loginTextEmerald, width: 2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _loading ? null : _handleSendOtp,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppConstants.loginGold,
                        foregroundColor: AppConstants.loginTextEmerald,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 2,
                      ),
                      child: _loading
                          ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2.5, color: AppConstants.loginTextEmerald))
                          : const Text('CONTINUE', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 2)),
                    ),
                  ),

                  if (widget.onSkip != null) ...[
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: OutlinedButton(
                        onPressed: widget.onSkip,
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppConstants.loginTextEmerald,
                          side: const BorderSide(color: AppConstants.loginCardBorder, width: 1.5),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: const Text('SKIP LOGIN / BROWSE STORE', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 11, letterSpacing: 1.5)),
                      ),
                    ),
                  ],
                ] else ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'VERIFICATION CODE',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          color: AppConstants.loginTextEmerald.withValues(alpha: 0.9),
                          letterSpacing: 1.5,
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            _otpSent = false;
                            _otpController.clear();
                            _errorMessage = null;
                            _successMessage = null;
                          });
                        },
                        child: const Text('Change Number', style: TextStyle(color: AppConstants.loginTextEmerald, fontSize: 10, fontWeight: FontWeight.bold, decoration: TextDecoration.underline)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  TextField(
                    controller: _otpController,
                    keyboardType: TextInputType.number,
                    maxLength: 6,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: AppConstants.loginTextEmerald, fontWeight: FontWeight.w900, fontSize: 24, letterSpacing: 8),
                    decoration: InputDecoration(
                      counterText: '',
                      hintText: '• • • • • •',
                      hintStyle: const TextStyle(color: Colors.grey, fontSize: 20),
                      filled: true,
                      fillColor: const Color(0xFFE8F5E5),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFFA5CDB0), width: 2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _loading ? null : _handleVerifyOtp,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppConstants.loginGold,
                        foregroundColor: AppConstants.loginTextEmerald,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 2,
                      ),
                      child: _loading
                          ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2.5, color: AppConstants.loginTextEmerald))
                          : const Text('VERIFY & PROCEED', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 2)),
                    ),
                  ),

                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: TextButton(
                      onPressed: (_loading || !_canResend) ? null : _handleSendOtp,
                      child: Text(
                        _canResend ? 'Resend OTP' : 'Resend OTP in ${_resendCountdown}s',
                        style: TextStyle(
                          color: _canResend ? AppConstants.loginTextEmerald : Colors.grey,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ),
                  ),
                ],

                const SizedBox(height: 20),
                const Divider(color: Colors.black12),
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
                    style: TextStyle(color: Colors.black54, fontSize: 10, height: 1.4),
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
