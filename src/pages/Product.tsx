import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, Product, variantPrice, mainImage } from '../lib/supabase'
import { setSEO } from '../lib/seo'
import { useCart } from '../contexts/CartContext'
export default function ProductPage() {
  const { slug } = useParams(); const { add } = useCart()
  const [p, setP] = useState<Product|null>(null); const [loading, setLoading] = useState(true)
  const [color, setColor] = useState<string|null>(null); const [size, setSize] = useState<string|null>(null); const [qty, setQty] = useState(1); const [img, setImg] = useState('')
  useEffect(() => { supabase.from('products').select('*, product_images(*), product_variants(*)').eq('slug', slug).eq('is_active', true).single()
    .then(({ data }) => { setP(data as Product); setImg(data ? mainImage(data as Product) : ''); setLoading(false); if (data) setSEO(data.name, data.description ?? data.name, location.href, mainImage(data as Product)) }) }, [slug])
  const vs = useMemo(() => (p?.product_variants ?? []).filter(v => v.is_active), [p])
  const colors = [...new Set(vs.map(v => v.color).filter(Boolean))] as string[]
  const sizes = [...new Set(vs.map(v => v.size).filter(Boolean))] as string[]
  const find = (c: string|null, s: string|null) => vs.find(v => v.color === c && v.size === s)
  const selected = find(colors.length ? color : null, sizes.length ? size : null)
  const ready = (!colors.length || color) && (!sizes.length || size) && selected
  if (loading) return <p>Loading…</p>; if (!p) return <p>Product not found.</p>
  const price = variantPrice(p, selected); const base = selected?.price ?? p.base_price
  const opt = (on: boolean, ok: boolean) => `px-4 py-2 border rounded-lg ${on ? 'bg-black text-white' : ''} ${ok ? '' : 'opacity-40 line-through'}`
  return (<div className="grid md:grid-cols-2 gap-8">
    <div><div className="overflow-hidden rounded-lg bg-gray-100"><AnimatePresence mode="wait"><motion.img key={img} src={img} alt={p.name} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="w-full aspect-[3/4] object-cover" /></AnimatePresence></div>
      <div className="flex gap-2 mt-2 overflow-x-auto">{[...p.product_images].sort((a, b) => a.sort_order - b.sort_order).map(i => <img key={i.image_url} src={i.image_url} onClick={() => setImg(i.image_url)} className="w-16 h-20 object-cover rounded cursor-pointer" />)}</div></div>
    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="space-y-4"><h1 className="text-3xl font-bold">{p.name}</h1>
      <p className="text-xl">{price} EGP {price < base && <><s className="text-gray-400 text-base">{base}</s> <span className="text-red-600 text-sm">-{Math.round((1 - price / base) * 100)}%</span></>}</p>
      <p className="text-gray-600">{p.description}</p>
      {colors.length > 0 && <div><p className="font-medium mb-2">Color: {color}</p><div className="flex flex-wrap gap-2">{colors.map(c => {
        const ok = vs.some(v => v.color === c && v.stock_quantity > 0 && (!size || v.size === size))
        return <button key={c} disabled={!ok} onClick={() => { setColor(c); const vi = vs.find(v => v.color === c && v.image_url)?.image_url; if (vi) setImg(vi) }} className={opt(color === c, ok)}>{c}{!ok && ' (Out of Stock)'}</button> })}</div></div>}
      {sizes.length > 0 && <div><p className="font-medium mb-2">Size: {size}</p><div className="flex flex-wrap gap-2">{sizes.map(s => {
        const ok = vs.some(v => v.size === s && v.stock_quantity > 0 && (!color || v.color === color))
        return <button key={s} disabled={!ok} onClick={() => setSize(s)} className={opt(size === s, ok)}>{s}{!ok && ' (Out of Stock)'}</button> })}</div></div>}
      {ready && selected && <p className={selected.stock_quantity > 0 ? 'text-green-700' : 'text-red-600'}>{selected.stock_quantity > 0 ? `In stock (${selected.stock_quantity})` : 'Out of Stock'}</p>}
      <div className="flex items-center gap-3"><button className="border w-10 h-10 rounded" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span>{qty}</span><button className="border w-10 h-10 rounded" onClick={() => setQty(qty + 1)}>+</button></div>
      <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }} className="btn w-full" disabled={!ready || !selected || selected.stock_quantity < 1}
        onClick={() => add({ variant_id: selected!.id, product_id: p.id, slug: p.slug, name: p.name, color: selected!.color, size: selected!.size, image: selected!.image_url ?? mainImage(p), unit_price: price, quantity: qty, stock: selected!.stock_quantity })}>
        {ready ? 'Add to cart' : 'Select options'}</motion.button></motion.div></div>)
}
