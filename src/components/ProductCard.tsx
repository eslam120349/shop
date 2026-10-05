import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Product, mainImage } from '../lib/supabase'
import { useWishlist } from '../contexts/WishlistContext'
export function ProductCard({ p }: { p: Product }) {
  const { has, toggle } = useWishlist(); const liked = has(p.id)
  return (<motion.div className="relative group" whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
    <Link to={`/products/${p.slug}`}><div className="overflow-hidden rounded-lg bg-gray-100"><motion.img loading="lazy" src={mainImage(p)} alt={p.name} className="aspect-[3/4] object-cover w-full" whileHover={{ scale: 1.07 }} transition={{ duration: 0.5 }} /></div>
      <h3 className="mt-2 font-medium group-hover:underline">{p.name}</h3>
      <p>{p.sale_price ? <><b>{p.sale_price} EGP</b> <s className="text-gray-400 text-sm">{p.base_price}</s></> : <b>{p.base_price} EGP</b>}</p></Link>
    <motion.button aria-label="Wishlist" whileTap={{ scale: 0.8 }} onClick={() => toggle(p.id)} className="absolute top-2 right-2 bg-white/90 rounded-full w-9 h-9">
      <motion.span key={String(liked)} className="inline-block" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }}>{liked ? '♥' : '♡'}</motion.span></motion.button></motion.div>)
}
