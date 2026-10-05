import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase, Product } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'
import { Reveal, StaggerGrid, Item, fadeUp, stagger } from '../components/motion'
import { setSEO } from '../lib/seo'
const Row = ({ title, rows }: { title: string; rows: Product[] }) => rows.length ? <section className="mb-12"><Reveal><h2 className="text-2xl font-bold mb-4">{title}</h2></Reveal>
  <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-4">{rows.map(p => <Item key={p.id}><ProductCard p={p} /></Item>)}</StaggerGrid></section> : null
export default function Home() {
  const [feat, setFeat] = useState<Product[]>([]); const [nw, setNw] = useState<Product[]>([]); const [cats, setCats] = useState<any[]>([])
  useEffect(() => { setSEO('Store — Fashion & Clothing', 'Shop the latest fashion. Cash on delivery.', location.origin)
    const q = (f: string) => supabase.from('products').select('*, product_images(*), product_variants(*)').eq('is_active', true).eq(f, true).limit(4).then(r => (r.data as Product[]) ?? [])
    q('is_featured').then(setFeat); q('is_new').then(setNw); supabase.from('categories').select('id,name').eq('is_active', true).then(r => setCats(r.data ?? [])) }, [])
  return (<div>
    <motion.section variants={stagger} initial="hidden" animate="show" className="relative overflow-hidden bg-gray-900 text-white rounded-2xl p-10 md:p-20 mb-10">
      <motion.div aria-hidden className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-white/10" animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.h1 variants={fadeUp} className="relative text-4xl md:text-6xl font-bold mb-4">New season, new style</motion.h1>
      <motion.p variants={fadeUp} className="relative mb-6 text-gray-300">Pay when your order arrives.</motion.p>
      <motion.div variants={fadeUp} className="relative inline-block"><motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}><Link to="/shop" className="bg-white text-black px-6 py-3 rounded-lg inline-block">Shop now</Link></motion.div></motion.div></motion.section>
    <StaggerGrid now className="flex flex-wrap gap-2 mb-12">{cats.map(c => <Item key={c.id}><Link to={`/shop?cat=${c.id}`} className="border rounded-full px-4 py-2 inline-block hover:bg-black hover:text-white transition-colors">{c.name}</Link></Item>)}</StaggerGrid>
    <Row title="Featured" rows={feat} /><Row title="New arrivals" rows={nw} />
    <Reveal><section className="bg-gray-100 rounded-2xl p-8 text-center"><h2 className="text-2xl font-bold">Free returns • Cash on delivery</h2></section></Reveal></div>)
}
