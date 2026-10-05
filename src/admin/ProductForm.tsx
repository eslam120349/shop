import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { slugify } from './Categories'
type V = { id?: string; image_url?: string|null; color: string|null; size: string|null; sku: string; stock_quantity: number; price: string; sale_price: string; is_active: boolean }
const num = (s: any) => (s === '' || s == null ? null : Number(s))
export default function ProductForm() {
  const { id } = useParams(); const nav = useNavigate()
  const [f, setF] = useState<any>({ name: '', slug: '', description: '', brand: '', base_price: '', sale_price: '', sku: '', category_id: '', is_active: true, is_featured: false, is_new: false })
  const [cats, setCats] = useState<any[]>([]); const [colors, setColors] = useState(''); const [sizes, setSizes] = useState('')
  const [vars, setVars] = useState<V[]>([{ color: null, size: null, sku: '', stock_quantity: 0, price: '', sale_price: '', is_active: true }])
  const [imgs, setImgs] = useState<{ image_url: string; is_primary: boolean }[]>([]); const [busy, setBusy] = useState(false)
  useEffect(() => { supabase.from('categories').select('id,name').then(r => setCats(r.data ?? []))
    if (id) supabase.from('products').select('*, product_images(*), product_variants(*)').eq('id', id).single().then(({ data: d }) => { if (!d) return
      setF({ ...d, base_price: d.base_price ?? '', sale_price: d.sale_price ?? '', category_id: d.category_id ?? '' })
      const vs = d.product_variants.map((v: any) => ({ ...v, sku: v.sku ?? '', price: v.price ?? '', sale_price: v.sale_price ?? '' })); setVars(vs)
      setColors([...new Set(vs.map((v: V) => v.color).filter(Boolean))].join(', ')); setSizes([...new Set(vs.map((v: V) => v.size).filter(Boolean))].join(', '))
      setImgs([...d.product_images].sort((a: any, b: any) => a.sort_order - b.sort_order)) }) }, [id])
  const list = (s: string) => [...new Set(s.split(',').map(x => x.trim()).filter(Boolean))]
  const generate = () => { const cs = list(colors), ss = list(sizes); const out: V[] = []
    for (const c of cs.length ? cs : [null]) for (const s of ss.length ? ss : [null]) {
      const old = vars.find(v => v.color === c && v.size === s)
      out.push(old ?? { color: c, size: s, sku: [f.sku, c, s].filter(Boolean).join('-').toUpperCase().replace(/\s+/g, ''), stock_quantity: 0, price: '', sale_price: '', is_active: true }) }
    setVars(out) }
  const upload = async (files: FileList | null) => { if (!files) return
    for (const file of Array.from(files)) { const path = `${crypto.randomUUID()}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('product-images').upload(path, file); if (error) { toast.error('Image upload failed: ' + error.message); continue }
      const url = supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl; setImgs(x => [...x, { image_url: url, is_primary: x.length === 0 }]) } }
  const save = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true)
    const row = { name: f.name, slug: f.slug || slugify(f.name), description: f.description, brand: f.brand, base_price: Number(f.base_price), sale_price: num(f.sale_price), sku: f.sku || null, category_id: f.category_id || null, is_active: f.is_active, is_featured: f.is_featured, is_new: f.is_new }
    const r = id ? await supabase.from('products').update(row).eq('id', id).select('id').single() : await supabase.from('products').insert(row).select('id').single()
    if (r.error) { setBusy(false); return toast.error(r.error.message) }
    const pid = r.data.id; const keep = vars.filter(v => v.id).map(v => v.id!)
    if (id) await supabase.from('product_variants').delete().eq('product_id', pid).not('id', 'in', `(${keep.join(',') || '00000000-0000-0000-0000-000000000000'})`)
    const mk = (v: V) => ({ ...(v.id ? { id: v.id } : {}), product_id: pid, color: v.color, size: v.size, sku: v.sku || null, stock_quantity: Number(v.stock_quantity) || 0, image_url: v.image_url || null, price: num(v.price), sale_price: num(v.sale_price), is_active: v.is_active })
    const e1 = vars.some(v => v.id) ? (await supabase.from('product_variants').upsert(vars.filter(v => v.id).map(mk))).error : null
    const nw = vars.filter(v => !v.id); const e2 = nw.length ? (await supabase.from('product_variants').insert(nw.map(mk))).error : null
    await supabase.from('product_images').delete().eq('product_id', pid)
    const e3 = imgs.length ? (await supabase.from('product_images').insert(imgs.map((i, n) => ({ product_id: pid, image_url: i.image_url, is_primary: i.is_primary, sort_order: n })))).error : null
    setBusy(false); const err = e1 || e2 || e3; if (err) return toast.error(err.message)
    toast.success('Product updated successfully'); nav('/admin/products') }
  const setV = (i: number, k: keyof V, val: any) => setVars(vars.map((v, n) => n === i ? { ...v, [k]: val } : v))
  const on = (k: string) => (e: any) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  return (<form onSubmit={save} className="max-w-4xl space-y-6"><h1 className="text-2xl font-bold">{id ? 'Edit' : 'New'} product</h1>
    <div className="grid md:grid-cols-2 gap-3">
      <input className="inp" required placeholder="Name" value={f.name} onChange={on('name')} /><input className="inp" placeholder="Slug (auto)" value={f.slug} onChange={on('slug')} />
      <input className="inp" placeholder="Brand" value={f.brand ?? ''} onChange={on('brand')} /><input className="inp" placeholder="SKU" value={f.sku ?? ''} onChange={on('sku')} />
      <input className="inp" required type="number" min="0" step="0.01" placeholder="Base price" value={f.base_price} onChange={on('base_price')} /><input className="inp" type="number" min="0" step="0.01" placeholder="Sale price" value={f.sale_price} onChange={on('sale_price')} />
      <select className="inp" value={f.category_id} onChange={on('category_id')}><option value="">No category</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <div className="flex gap-4 items-center">{(['is_active', 'is_featured', 'is_new'] as const).map(k => <label key={k}><input type="checkbox" checked={f[k]} onChange={on(k)} /> {k.slice(3)}</label>)}</div>
      <textarea className="inp md:col-span-2" placeholder="Description" value={f.description ?? ''} onChange={on('description')} /></div>
    <section><h2 className="font-bold mb-2">Images</h2><input type="file" accept="image/*" multiple onChange={e => upload(e.target.files)} />
      <div className="flex flex-wrap gap-3 mt-3">{imgs.map((i, n) => <div key={i.image_url} className="text-xs text-center"><img src={i.image_url} className={`w-24 h-28 object-cover rounded ${i.is_primary ? 'ring-2 ring-black' : ''}`} />
        <button type="button" onClick={() => setImgs(imgs.map((x, m) => ({ ...x, is_primary: m === n })))}>Main</button> <button type="button" className="text-red-600" onClick={() => setImgs(imgs.filter((_, m) => m !== n).map((x, m, a) => ({ ...x, is_primary: a.some(y => y.is_primary) ? x.is_primary : m === 0 })))}>Delete</button></div>)}</div></section>
    <section><h2 className="font-bold mb-2">Variants</h2><div className="grid md:grid-cols-3 gap-2"><input className="inp" placeholder="Colors: Black, White" value={colors} onChange={e => setColors(e.target.value)} />
      <input className="inp" placeholder="Sizes: S, M, L" value={sizes} onChange={e => setSizes(e.target.value)} /><button type="button" className="btn" onClick={generate}>Generate combinations</button></div>
      <div className="overflow-x-auto mt-3"><table className="w-full text-sm min-w-[640px]"><thead><tr className="text-left"><th>Color</th><th>Size</th><th>SKU</th><th>Stock</th><th>Price</th><th>Sale</th><th>Image</th><th>Active</th></tr></thead><tbody>
        {vars.map((v, i) => <tr key={i}><td>{v.color ?? '—'}</td><td>{v.size ?? '—'}</td>
          <td><input className="inp" value={v.sku} onChange={e => setV(i, 'sku', e.target.value)} /></td><td><input className="inp w-20" type="number" min="0" value={v.stock_quantity} onChange={e => setV(i, 'stock_quantity', e.target.value)} /></td>
          <td><input className="inp w-24" type="number" placeholder="override" value={v.price} onChange={e => setV(i, 'price', e.target.value)} /></td><td><input className="inp w-24" type="number" placeholder="override" value={v.sale_price} onChange={e => setV(i, 'sale_price', e.target.value)} /></td>
          <td><select className="inp w-28" value={v.image_url ?? ''} onChange={e => setV(i, 'image_url', e.target.value || null)}><option value="">—</option>{imgs.map((im, n) => <option key={im.image_url} value={im.image_url}>Image {n + 1}</option>)}</select></td><td><input type="checkbox" checked={v.is_active} onChange={e => setV(i, 'is_active', e.target.checked)} /></td></tr>)}</tbody></table></div></section>
    <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save product'}</button></form>)
}
