# Fashion Store (React + Vite + TS + Tailwind + Supabase, COD only)

## Database setup
1. Create a Supabase project.
2. SQL Editor -> paste and run `supabase/migrations/001_init.sql`.
2b. (Optional demo data) run `supabase/migrations/002_seed.sql` (re-runnable; images live in `public/demo/`).
3. Sign up through the app, then promote yourself:
   `update public.profiles set role='admin' where email='you@example.com';`
4. Copy `.env.example` to `.env` and fill in the URL and anon key (never the service-role key).

## Design notes
- Every product has at least one row in `product_variants`. No-variant products use one row with color/size NULL, so stock is always variant-level.
- Orders are created only through `rpc('create_order', {p_customer, p_items:[{variant_id, quantity}]})`. Prices and stock are read and locked in the DB.
- Guests can call `create_order` but cannot read orders back (RLS); show the confirmation from the RPC result.

## Run
`npm install && npm run dev` — build: `npm run build` — deploy `dist/` to Netlify/Vercel (add the two env vars; SPA fallback to index.html).
Storage buckets `product-images` / `category-images` are created by the migration. Replace YOUR-DOMAIN.com in `public/robots.txt` and `sitemap.xml`.
