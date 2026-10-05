import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase, Product } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'
import { StaggerGrid, Item } from '../components/motion'
const PAGE = 12
export default function Shop() {
  const [sp, setSp] = useSearchParams(); const [rows, setRows] = useState<Product[]>([]); const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true); const [q, setQ] = useState(sp.get('q') ?? '')
  const [cats, setCats] = useState<{ id: string; name: string }[]>([])
  const page = Number(sp.get('page') ?? 1), cat = sp.get('cat'), sort = sp.get('sort') ?? 'new', search = sp.get('q') ?? ''
  useEffect(() => { supabase.from('categories').select('id,name').eq('is_active', true).then(r => setCats(r.data ?? [])) }, [])
  useEffect(() => { const t = setTimeout(() => setSp(p => { q ? p.set('q', q) : p.delete('q'); p.set('page', '1'); return p }), 400); return () => clearTimeout(t) }, [q])
  useEffect(() => {
    setLoading(true)
    let qb = supabase.from('products').select('*, product_images(*), product_variants(*)', { count: 'exact' }).eq('is_active', true)
    if (cat) qb = qb.eq('category_id', cat)
    if (search) qb = qb.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`)
    qb = sort === 'low' ? qb.order('base_price') : sort === 'high' ? qb.order('base_price', { ascending: false }) : sort === 'popular' ? qb.order('sales_count', { ascending: false }) : qb.order('created_at', { ascending: false })
    qb.range((page - 1) * PAGE, page * PAGE - 1).then(({ data, count, error }) => { if (error) console.error(error); setRows((data as Product[]) ?? []); setTotal(count ?? 0); setLoading(false) })
  }, [page, cat, sort, search])
  const set = (k: string, v: string) => setSp(p => { v ? p.set(k, v) : p.delete(k); p.set('page', '1'); return p })
  return (<div>
    <div className="flex flex-wrap gap-3 mb-6">
      <input className="inp max-w-xs" placeholder="Search products…" value={q} onChange={e => setQ(e.target.value)} />
      <select className="inp max-w-[12rem]" value={cat ?? ''} onChange={e => set('cat', e.target.value)}><option value="">All categories</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <select className="inp max-w-[12rem]" value={sort} onChange={e => set('sort', e.target.value)}><option value="new">Newest</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="popular">Most Popular</option></select></div>
    {loading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-lg" />)}</div>
      : rows.length === 0 ? <p className="text-center py-20 text-gray-500">No products found.</p>
      : <StaggerGrid now key={`${page}-${cat}-${sort}-${search}`} className="grid grid-cols-2 md:grid-cols-4 gap-4">{rows.map(p => <Item key={p.id}><ProductCard p={p} /></Item>)}</StaggerGrid>}
    <div className="flex justify-center gap-3 mt-8"><button className="btn" disabled={page <= 1} onClick={() => setSp(p => { p.set('page', String(page - 1)); return p })}>Prev</button>
      <button className="btn" disabled={page * PAGE >= total} onClick={() => setSp(p => { p.set('page', String(page + 1)); return p })}>Next</button></div></div>)
}
