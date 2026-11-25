import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/constants.dart';

class SupabaseService {
  static SupabaseClient get client => Supabase.instance.client;

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

  // Fetch Products with Variants & Active Discounts
  static Future<List<Map<String, dynamic>>> getProducts({
    List<String>? parentSubcategoryIds,
    String? subCategoryId,
  }) async {
    try {
      List<Map<String, dynamic>> response = [];

      // A specific subcategory takes priority.
      if (subCategoryId != null && subCategoryId.trim().isNotEmpty) {
        final id = subCategoryId.trim();
        final res = await client
            .from('products')
            .select('*, product_variants(*)')
            .eq('category_id', id)
            .order('name');
        response = List<Map<String, dynamic>>.from(res);
      } else if (parentSubcategoryIds != null && parentSubcategoryIds.isNotEmpty) {
        final ids = parentSubcategoryIds.where((id) => id.trim().isNotEmpty).toList();
        if (ids.isNotEmpty) {
          final res = await client
              .from('products')
              .select('*, product_variants(*)')
              .inFilter('category_id', ids)
              .order('name');
          response = List<Map<String, dynamic>>.from(res);
        } else {
          response = [];
        }
      } else {
        final res = await client
            .from('products')
            .select('*, product_variants(*)')
            .order('name');
        response = List<Map<String, dynamic>>.from(res);
      }

      // Fetch active discounts and attach to products/variants
      try {
        final discountsRes = await client.from('discounts').select('*, discount_variants(*)');
        final discounts = List<Map<String, dynamic>>.from(discountsRes);

        for (var p in response) {
          final variants = p['product_variants'] as List? ?? [];
          for (var v in variants) {
            int maxDiscountPercent = 0;
            for (var disc in discounts) {
              final dVars = disc['discount_variants'] as List? ?? [];
              final isLinked = dVars.any((dv) => dv['variant_id'] == v['id']);
              if (isLinked) {
                final dType = disc['discount_type'];
                final dVal = num.tryParse(disc['discount_value']?.toString() ?? '0') ?? 0;
                if (dType == 'percentage') {
                  maxDiscountPercent = maxDiscountPercent > dVal.round() ? maxDiscountPercent : dVal.round();
                } else {
                  final vPrice = num.tryParse(v['price']?.toString() ?? '100') ?? 100;
                  if (vPrice > 0) {
                    final percentEquiv = ((dVal / vPrice) * 100).round();
                    maxDiscountPercent = maxDiscountPercent > percentEquiv ? maxDiscountPercent : percentEquiv;
                  }
                }
              }
            }
            if (maxDiscountPercent > 0) {
              v['discount_percent'] = maxDiscountPercent;
              if (v['original_price'] == null) {
                v['original_price'] = v['price'];
              }
              final basePrice = num.tryParse(v['price']?.toString() ?? '150') ?? 150;
              v['price'] = (basePrice * (1 - (maxDiscountPercent / 100))).round();
            }
          }
        }
      } catch (discErr) {
        print("Discounts fetch warning: $discErr");
      }

      return response;
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

  // Fetch Pre-order Products
  static Future<List<Map<String, dynamic>>> getPreorderProducts() async {
    try {
      final response = await client
          .from('products')
          .select('*, product_variants(*)')
          .eq('sale_mode', 'preorder')
          .eq('is_available', true)
          .order('created_at', ascending: false);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print("Error fetching preorder products: $e");
      return [];
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
          .select('*, order_items(*), order_status_history(*)')
          .eq('user_id', userId)
          .order('created_at', ascending: false);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print("Error fetching customer orders: $e");
      return [];
    }
  }

  // Fetch Banners
  static Future<List<Map<String, dynamic>>> getBannerBanners() async {
    try {
      final response = await client.from('banners').select('*').order('display_order');
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print("Error fetching banners: $e");
      return [];
    }
  }

  static Future<List<Map<String, dynamic>>> getBanners() async {
    try {
      final response = await client.from('banners').select('*');
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print("Error fetching banners: $e");
      return [];
    }
  }
}
