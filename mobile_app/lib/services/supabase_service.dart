import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/constants.dart';

class SupabaseService {
  static final SupabaseClient client = Supabase.instance.client;

  // Fetch Parent & Subcategories
  static Future<Map<String, dynamic>> getCategoryWorkspace() async {
    try {
      final response = await client.from('categories').select('*').order('name');
      final List<Map<String, dynamic>> allCats = List<Map<String, dynamic>>.from(response);

      final List<Map<String, dynamic>> parentCats = [];
      final Map<String, List<Map<String, dynamic>>> subMap = {};

      for (var cat in allCats) {
        if (cat['parent_id'] == null) {
          parentCats.add(cat);
        } else {
          final pId = cat['parent_id'].toString();
          subMap[pId] = subMap[pId] ?? [];
          subMap[pId]!.add(cat);
        }
      }

      return {
        'parents': parentCats,
        'subMap': subMap,
      };
    } catch (e) {
      print("Error fetching category workspace: $e");
      return {'parents': [], 'subMap': {}};
    }
  }

  // Fetch Products with Variants
  static Future<List<Map<String, dynamic>>> getProducts({String? categoryFilter, String? subCategoryFilter, String? subCategoryId}) async {
    try {
      dynamic query = client.from('products').select('*, product_variants(*)');

      if (categoryFilter != null && categoryFilter.toLowerCase() != 'all') {
        final firstWord = categoryFilter.split(" ")[0];
        query = query.ilike('category_name', '%$firstWord%');
      }

      final response = await query.order('name');
      final List<Map<String, dynamic>> list = List<Map<String, dynamic>>.from(response);

      if (subCategoryId != null && subCategoryId.isNotEmpty) {
        final subFiltered = list.where((p) => p['category_id']?.toString() == subCategoryId).toList();
        if (subFiltered.isNotEmpty) return subFiltered;
      }

      return list;
    } catch (e) {
      print("Error fetching products: $e");
      return [];
    }
  }

  // Fetch Delivery Settings
  static Future<Map<String, dynamic>?> getDeliverySettings() async {
    try {
      final response = await client.from('delivery_settings').select('*').eq('id', 'default').maybeSingle();
      return response;
    } catch (e) {
      print("Error fetching delivery_settings: $e");
      return null;
    }
  }

  // Send MSG91 SMS OTP
  static Future<Map<String, dynamic>> sendMsg91Otp(String phone) async {
    try {
      final res = await http.post(
        Uri.parse('${AppConstants.supabaseUrl}/functions/v1/send-msg91-otp'),
        headers: {
          'apikey': AppConstants.supabaseAnonKey,
          'Authorization': 'Bearer ${AppConstants.supabaseAnonKey}',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'phone': phone}),
      );
      return jsonDecode(res.body);
    } catch (e) {
      return {'error': e.toString()};
    }
  }

  // Verify MSG91 SMS OTP Token
  static Future<Map<String, dynamic>> verifyMsg91Token(String phone, String token) async {
    try {
      final res = await http.post(
        Uri.parse('${AppConstants.supabaseUrl}/functions/v1/send-msg91-otp'),
        headers: {
          'apikey': AppConstants.supabaseAnonKey,
          'Authorization': 'Bearer ${AppConstants.supabaseAnonKey}',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'action': 'verify_token',
          'phone': phone,
          'accessToken': token,
        }),
      );
      return jsonDecode(res.body);
    } catch (e) {
      return {'error': e.toString()};
    }
  }

  // Fetch Customer Active & Past Orders
  static Future<List<Map<String, dynamic>>> getCustomerOrders(String userId) async {
    try {
      final response = await client
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', userId)
          .order('created_at', ascending: false);
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print("Error fetching customer orders: $e");
      return [];
    }
  }

  // Fetch Active Banners
  static Future<List<Map<String, dynamic>>> getBanners() async {
    try {
      final response = await client
          .from('banners')
          .select('*')
          .eq('status', 'active')
          .order('order_index');
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print("Error fetching banners: $e");
      return [];
    }
  }
}
