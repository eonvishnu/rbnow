import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'supabase_service.dart';

class CacheService {
  static const String _keyProducts = 'cached_products';
  static const String _keyCategories = 'cached_categories';
  static const String _keyOrders = 'cached_orders';
  static const String _keyStoreStatus = 'cached_store_status';

  // Save products cache
  static Future<void> saveProducts(List<Map<String, dynamic>> products) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyProducts, jsonEncode(products));
    } catch (e) {
      print('Error saving products cache: $e');
    }
  }

  static Future<List<Map<String, dynamic>>> getCachedProducts() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = prefs.getString(_keyProducts);
      if (str != null) {
        return List<Map<String, dynamic>>.from(jsonDecode(str));
      }
    } catch (e) {
      print('Error reading cached products: $e');
    }
    return [];
  }

  // Check store status from store_settings (is_store_open)
  static Future<bool> checkStoreStatus() async {
    try {
      final response = await SupabaseService.client
          .from('store_settings')
          .select('is_store_open')
          .eq('id', 'default')
          .maybeSingle();

      if (response != null) {
        final isOpen = response['is_store_open'] ?? true;
        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool(_keyStoreStatus, isOpen);
        return isOpen;
      }
    } catch (e) {
      print('Error checking store status from store_settings: $e');
    }
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getBool(_keyStoreStatus) ?? true;
    } catch (e) {
      return true;
    }
  }
}
