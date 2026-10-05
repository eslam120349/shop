import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
export default function Inventory() {
  const [rows, setRows] = useState<any[]>([]); const [edit, setEdit] = useState<Record<string, string>>({})
  const load = () => supabase.from('product_variants').select('id,sku,color,size,stock_quantity,products(name)').order('stock_quantity').then(r => setRows(r.data ?? [])); useEffect(() => { load() }, [])
  const save = async (id: string) => { const { error } = await supabase.from('product_variants').update({ stock_quantity: Number(edit[id]) }).eq('id', id); error ? toast.error(error.message) : (toast.success('Stock updated'), setEdit(({ [id]: _, ...r }) => r), load()) }
  return (<div><h1 className="text-2xl font-bold mb-4">Inventory</h1><table className="w-full text-sm min-w-[560px]"><thead><tr className="text-left border-b"><th>Product</th><th>Variant</th><th>SKU</th><th>Stock</th><th></th></tr></thead><tbody>
    {rows.map(v => <tr key={v.id} className="border-b"><td className="py-2">{v.products?.name}</td><td>{[v.color, v.size].filter(Boolean).join(' / ') || '—'}</td><td>{v.sku}</td>
      <td><input className="inp w-20" type="number" min="0" value={edit[v.id] ?? v.stock_quantity} onChange={e => setEdit({ ...edit, [v.id]: e.target.value })} /> {v.stock_quantity === 0 ? <b className="text-red-600">Out</b> : v.stock_quantity < 5 && <b className="text-amber-600">Low</b>}</td>
      <td>{edit[v.id] !== undefined && <button className="btn !py-1" onClick={() => save(v.id)}>Save</button>}</td></tr>)}</tbody></table></div>)
}
