# Project Blueprint

## Overview

Royal Bengal is a multi-surface e-commerce project. The admin and storefront are separate Next.js App Router applications, deployed as static exports to distinct Firebase Hosting sites. Both use Supabase for PostgreSQL, Auth, Storage, and Edge Functions; payment processing uses Razorpay. Firebase Functions and a mobile app are also present in the workspace.

## Existing Admin Capabilities

The admin app currently provides the dashboard, catalog/product and category management, banners, coupons, orders and manual order creation, customers, carts, preorders, procurement, staff permissions, and store/payment/delivery settings. Routes and UI are under `admin/app/`; shared UI is in `admin/app/components/`; auth state is in `admin/context/`; Supabase and other clients are in `admin/lib/`.

The current admin uses direct client-side Supabase queries across many route components. Static export is an intentional hosting constraint: request-time Server Components and API routes are not available in the deployed admin app. Browser-side operations continue to be subject to Supabase RLS. Payment verification, webhook handling, order confirmation, and inventory adjustment remain in trusted Supabase Edge Functions and database functions.

Existing data tables, names, relationships, and policies are part of the compatibility contract. Do not change the Supabase schema or delete the divergent `admin/testapp/`, generated export output, or archived ZIP files without separately confirming their purpose.

## Admin Target Architecture

Keep route entries in `admin/app/` and organize domain logic under `admin/features/<feature>/`, with only needed `components/`, `repositories/`, `services/`, `schemas/`, and `types/` per feature. Shared admin UI belongs in `admin/components/`; Supabase initialization and general utilities belong in `admin/lib/`. Use Server Components for static UI where practical, and Client Components for browser state, interactivity, and client-side Supabase access required by the current static deployment. Use strict feature types and Zod validation at input boundaries. Repositories own useful database access boundaries; services own business rules. Avoid redundant layers and preserve existing routes, UI, and behavior.

Payment secrets must not be delivered to browser code. Admin credential management needs an approved trusted server-side boundary; do not make payment secrets safer merely by hiding them in the UI. Keep payment processing and order/inventory integrity operations server-side.

## Admin Migration Plan

1. Establish current behavior and validation baseline; preserve Firebase static hosting and all admin routes.
2. Refactor the catalog/product list and create/edit flows into feature types, Zod schemas, repositories, and a small service boundary; preserve Supabase tables and storage buckets.
3. Validate catalog behavior and run admin type-check and production build.
4. Continue one admin feature at a time, keeping route components focused on UI and browser interaction.
5. Address payment credential administration separately, only with a trusted backend boundary compatible with the deployment; do not expose credentials in client code or alter payment verification behavior.

## Completed Admin Feature Refactors

Admin route data boundaries now use feature-scoped types, Zod schemas, repositories, and services for products/catalog, categories, banners, promotions/coupons, staff, orders/manual orders, procurement, preorders, carts, customers, dashboard, auth/profile access, and non-secret store settings. Product and category image uploads use shared browser-side conversion to compressed WebP before upload; category uploads are limited to a 512 px longest dimension at 75% quality. Customer segmentation/order history, cart abandonment classification and recovery-message construction, dashboard order/funnel mapping, guest-cart synchronization, profile access, and store-settings persistence are handled outside route/context UI. Existing routes, UI, Supabase tables and relationships, storage buckets, order/audit writes, and existing payment/inventory trusted execution paths were retained.

The cart, customer, and dashboard routes continue to be Client Components because they need browser state and client-side Supabase access under the static-export deployment. No API routes, runtime Server Components, database migrations, or RLS changes were introduced. The admin app does not yet have a validated lint command: its current `next lint` script is incompatible with Next.js 16 (`Invalid project directory provided`). The environment's Node version is below the project's declared Node >=22 engine.

Validation after the latest cart/customer/dashboard changes: `cd admin && npx tsc --noEmit` passes; `cd admin && npm run build` succeeds and statically exports the existing routes (`/`, `/banner`, `/carts`, `/categories`, `/coupons`, `/customers`, `/login`, `/orders`, `/orders/create`, `/preorders`, `/procurement`, `/products`, `/products/add`, `/settings`, `/staff`).

## Remaining Admin Work and Constraints

1. Refactor non-secret store and delivery settings through a typed feature boundary.
2. Gateway credential settings currently read and write `secret_key` and `webhook_secret` in browser code. This existing behavior is insecure and cannot be safely refactored by client-side organization alone. Resolve it through a trusted backend (for example a Supabase Edge Function with secrets configured server-side) before changing credential workflows; the user must approve backend/Edge Function scope.
3. Review remaining legacy shared UI components for loosely typed props or unnecessary data access.
4. Re-run the admin type-check and production build after each remaining stage. Do not modify the storefront, mobile app, Firebase Functions, Supabase schema/policies, or `admin/testapp/` as part of this admin-only work.

## Checkout Security Sandbox Plan

1. Run a non-mutating Deno type-check on the current `place-order` and `verify-payment` Edge Functions.
2. A full isolated order-flow run requires a dedicated Supabase staging project and Razorpay test credentials, or Docker/Podman for a local Supabase stack. Do not run the existing E2E scripts against production because they create orders and decrement inventory.
3. Keep Razorpay Basic-auth credentials bound to the official Razorpay API host; do not add an unrestricted API URL override for testing.
4. Live invalid-signature and anonymous RLS/RPC checks passed previously. Full valid-payment conversion remains untested until isolated sandbox infrastructure is available.
