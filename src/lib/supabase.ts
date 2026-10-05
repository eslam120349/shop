import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
export type Variant = { id: string; color: string|null; size: string|null; price: number|null; sale_price: number|null; stock_quantity: number; image_url: string|null; is_active: boolean }
export type Product = { id: string; name: string; slug: string; description: string|null; base_price: number; sale_price: number|null; product_images: { image_url: string; is_primary: boolean; sort_order: number }[]; product_variants: Variant[] }
export const variantPrice = (p: Product, v?: Variant) => v?.sale_price ?? v?.price ?? p.sale_price ?? p.base_price
export const mainImage = (p: Product) => (p.product_images.find(i => i.is_primary) ?? p.product_images[0])?.image_url ?? ''
