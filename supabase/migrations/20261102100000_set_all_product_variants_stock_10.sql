-- Update all product_variants stock to 10 & is_available to true
UPDATE public.product_variants
SET stock = 10,
    is_available = true,
    updated_at = NOW();

-- Update all products availability to true
UPDATE public.products
SET is_available = true,
    updated_at = NOW();
