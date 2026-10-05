import { useEffect, useState } from 'react'
import { supabase, Product } from '../lib/supabase'
import { useWishlist } from '../contexts/WishlistContext'
import { ProductCard } from '../components/ProductCard'
import { Link } from 'react-router-dom'
export default function Wishlist() {
  const { ids } = useWishlist(); const [rows, setRows] = useState<Product[]>([])
  useEffect(() => { ids.length ? supabase.from('products').select('*, product_images(*), product_variants(*)').in('id', ids).eq('is_active', true).then(r => setRows((r.data as Product[]) ?? [])) : setRows([]) }, [ids])
  return rows.length ? <div><h1 className="text-2xl font-bold mb-4">Wishlist</h1><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{rows.map(p => <div key={p.id}><ProductCard p={p} /><Link className="text-sm underline" to={`/products/${p.slug}`}>Choose options & add to cart</Link></div>)}</div></div>
    : <p className="text-center py-20 text-gray-500">Your wishlist is empty.</p>
}
