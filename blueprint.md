# Project Blueprint & Implementation Plan: Cart Upsells and Add-to-Cart Fixes

## Overview

This blueprint tracks fixes and improvements for cart upsells and add-to-cart functionality on the Next.js storefront cart page (`website/app/cart/page.tsx`).

## Identified Issues & Bugs

1. **Upsell Product Name Overwrite**:
   - When mapping cart upsells from `cart_upsells`, `name: u.title || p?.name` assigned the custom upsell title (e.g. "Frequently Bought Together") to `name`, overwriting the actual product name with the upsell banner title.
2. **Variant ID vs Product ID Mismatch on Add-to-Cart**:
   - The recommended product objects mapped from `cart_upsells` assigned `id` to the product ID (`p?.id || u.product_id`) instead of the variant ID (`v?.id || u.variant_id`).
   - Cart items and stock validation (`product_variants`) require the item `id` to be the **variant ID** so that stock checks (`stockData[item.id]`) and cart relational sync (`cart_items.variant_id`) succeed. Passing the product ID caused stock lookup mismatches and failure to correctly add/track upsell items in the cart.
3. **Stock Propagation**:
   - Upsell recommendations hardcoded `stock: 999` without referencing actual variant stock (`v?.stock`), preventing real-time stock validation for upsell items.

## Proposed Changes

### [MODIFY] [website/app/cart/page.tsx](file:///home/vishnu/ecom/website/app/cart/page.tsx)
- Fix upsell mapping so `name` correctly resolves to product name (`p?.name`), while retaining `upsellTitle` (`u.title`).
- Ensure `id` and `variantId` correctly point to the variant ID (`v?.id || u.variant_id || p?.id`), and `product_id` points to `p?.id || u.product_id`.
- Populate real variant stock (`v?.stock ?? 999`) in recommended upsell items.
- Ensure `addToCart` invocation for recommended upsell items passes the correct variant ID (`p.variantId || p.id`) and product ID (`p.product_id || p.id`).

## Verification Plan

### Automated Checks
- Run `npm run build` in `website` (or root) to ensure successful compilation and static export.
- Run `npm run lint` if applicable.

### Manual Verification
- Review cart page in preview or verify code logic.
