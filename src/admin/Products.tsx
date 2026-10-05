import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
export default function Products() {
  const [rows, setRows] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const load = () => supabase.from('products').select('id,name,base_price,sale_price,is_active,is_featured,is_new,product_variants(stock_quantity)').order('created_at', { ascending: false }).then(r => { setRows(r.data ?? []); setLoading(false) })
  useEffect(() => { load() }, [])
  const patch = async (id: string, v: object) => { const { error } = await supabase.from('products').update(v).eq('id', id); error ? toast.error(error.message) : (toast.success('Product updated successfully'), load()) }
  return (<div><div className="flex justify-between mb-4"><h1 className="text-2xl font-bold">Products</h1><Link className="btn" to="/admin/products/new">New product</Link></div>
    {loading ? <p>Loading…</p> : <table className="w-full text-sm min-w-[640px]"><thead><tr className="text-left border-b"><th>Name</th><th>Price</th><th>Stock</th><th>Active</th><th>Featured</th><th>New</th><th></th></tr></thead><tbody>
      {rows.map(p => <tr key={p.id} className="border-b"><td className="py-2">{p.name}</td><td>{p.sale_price ?? p.base_price}</td><td>{p.product_variants.reduce((a: number, v: any) => a + v.stock_quantity, 0)}</td>
        {(['is_active', 'is_featured', 'is_new'] as const).map(k => <td key={k}><input type="checkbox" checked={p[k]} onChange={e => patch(p.id, { [k]: e.target.checked })} /></td>)}
        <td className="space-x-3"><Link to={`/admin/products/${p.id}/edit`}>Edit</Link><button className="text-red-600" onClick={async () => { if (!confirm('Delete product?')) return; const { error } = await supabase.from('products').delete().eq('id', p.id); error ? toast.error(error.message) : (toast.success('Product deleted'), load()) }}>Delete</button></td></tr>)}</tbody></table>}</div>)
}
