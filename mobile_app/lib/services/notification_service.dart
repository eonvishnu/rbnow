import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';

@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  try {
    if (Firebase.apps.isEmpty) {
      await Firebase.initializeApp();
    }
  } catch (e) {
    debugPrint('Background handler Firebase init error: $e');
  }
  debugPrint('Handling a background message: ${message.messageId}');
}

class NotificationService {
  static final NotificationService instance = NotificationService._();
  NotificationService._();

  bool _isInitialized = false;
  StreamSubscription<String>? _tokenRefreshSub;
  StreamSubscription<AuthState>? _authChangeSub;
  StreamSubscription<RemoteMessage>? _foregroundSub;

  FirebaseMessaging get _firebaseMessaging => FirebaseMessaging.instance;

  Future<void> initialize() async {
    if (_isInitialized || kIsWeb) return;

    try {
      if (Firebase.apps.isEmpty) {
        await Firebase.initializeApp();
      }

      FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

      await _firebaseMessaging.setForegroundNotificationPresentationOptions(
        alert: true,
        badge: true,
        sound: true,
      );

      NotificationSettings settings = await _firebaseMessaging.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      );

      debugPrint('Notification permission status: ${settings.authorizationStatus}');

      try {
        String? token = await _firebaseMessaging.getToken();
        if (token != null && token.isNotEmpty) {
          await saveTokenToDatabase(token);
        }
      } catch (tokenErr) {
        debugPrint('Error getting FCM token: $tokenErr');
      }

      await _tokenRefreshSub?.cancel();
      _tokenRefreshSub = _firebaseMessaging.onTokenRefresh.listen((newToken) {
        saveTokenToDatabase(newToken);
      });

      await _authChangeSub?.cancel();
      _authChangeSub = Supabase.instance.client.auth.onAuthStateChange.listen((data) {
        final event = data.event;
        if (event == AuthChangeEvent.signedIn || event == AuthChangeEvent.tokenRefreshed) {
          _firebaseMessaging.getToken().then((token) {
            if (token != null && token.isNotEmpty) saveTokenToDatabase(token);
          });
        }
      });

      await _foregroundSub?.cancel();
      _foregroundSub = FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        debugPrint('Received foreground message: ${message.notification?.title}');
      });

      _isInitialized = true;
    } catch (e) {
      debugPrint('NotificationService initialization error: $e');
    }
  }

  Future<void> saveTokenToDatabase(String token) async {
    try {
      final user = Supabase.instance.client.auth.currentUser;
      final platform = Platform.isIOS ? 'ios' : 'android';

      await Supabase.instance.client.from('device_tokens').upsert({
        'user_id': user?.id,
        'token': token,
        'platform': platform,
        'updated_at': DateTime.now().toIso8601String(),
      }, onConflict: 'token');
      debugPrint('Successfully saved FCM device token to Supabase for platform: $platform');
    } catch (e) {
      debugPrint('Error saving FCM token to database: $e');
    }
  }

  void dispose() {
    _tokenRefreshSub?.cancel();
    _authChangeSub?.cancel();
    _foregroundSub?.cancel();
    _isInitialized = false;
  }
}
