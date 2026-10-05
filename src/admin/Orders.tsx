import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
const STATUSES = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'returned']
export function Orders() {
  const [rows, setRows] = useState<any[]>([]); const [st, setSt] = useState(''); const [q, setQ] = useState(''); const [date, setDate] = useState('')
  useEffect(() => { let qb = supabase.from('orders').select('id,order_number,customer_name,customer_phone,total,status,created_at').order('created_at', { ascending: false }).limit(100)
    if (st) qb = qb.eq('status', st); if (date) qb = qb.gte('created_at', date).lt('created_at', date + 'T23:59:59')
    if (q) qb = qb.or(`customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%`); qb.then(r => setRows(r.data ?? [])) }, [st, q, date])
  return (<div><h1 className="text-2xl font-bold mb-4">Orders</h1><div className="flex flex-wrap gap-2 mb-4">
    <input className="inp max-w-xs" placeholder="Customer or phone" value={q} onChange={e => setQ(e.target.value)} /><select className="inp max-w-[10rem]" value={st} onChange={e => setSt(e.target.value)}><option value="">All statuses</option>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
    <input type="date" className="inp max-w-[10rem]" value={date} onChange={e => setDate(e.target.value)} /></div>
    <table className="w-full text-sm min-w-[560px]"><tbody>{rows.map(o => <tr key={o.id} className="border-b"><td className="py-2"><Link className="underline" to={`/admin/orders/${o.id}`}>#{o.order_number}</Link></td><td>{o.customer_name}</td><td>{o.customer_phone}</td><td>{o.total} EGP</td><td>{o.status}</td><td>{new Date(o.created_at).toLocaleDateString()}</td></tr>)}</tbody></table>
    {!rows.length && <p className="text-gray-500 py-8 text-center">No orders found.</p>}</div>)
}
export function OrderDetail() {
  const { id } = useParams(); const [o, setO] = useState<any>(null)
  const load = () => supabase.from('orders').select('*, order_items(*)').eq('id', id).single().then(r => setO(r.data)); useEffect(() => { load() }, [id])
  const setStatus = async (status: string) => { if (['cancelled', 'returned'].includes(status) && !confirm(`Mark as ${status}? Stock will be restored.`)) return
    const { error } = await supabase.from('orders').update({ status }).eq('id', id); error ? toast.error(error.message) : (toast.success('Order updated'), load()) }
  if (!o) return <p>Loading…</p>
  return (<div className="max-w-2xl space-y-3"><h1 className="text-2xl font-bold">Order #{o.order_number}</h1>
    <p>{o.customer_name} • {o.customer_phone} • {o.customer_email}</p><p>{o.governorate}, {o.city} — {o.address}</p>{o.notes && <p className="italic">{o.notes}</p>}
    <select className="inp max-w-[12rem]" value={o.status} onChange={e => setStatus(e.target.value)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
    <div className="flex gap-2"><button className="btn" onClick={() => setStatus('delivered')}>Mark delivered</button><button className="border px-4 rounded-lg" onClick={() => setStatus('cancelled')}>Cancel order</button></div>
    {o.order_items.map((i: any) => <p key={i.id} className="flex justify-between border-b py-1"><span>{i.product_name_snapshot} {[i.variant_snapshot?.color, i.variant_snapshot?.size].filter(Boolean).join('/')} ×{i.quantity}</span><span>{i.total_price}</span></p>)}
    <p>Subtotal {o.subtotal} • Delivery {o.delivery_fee} • <b>Total {o.total} EGP</b> (Cash on Delivery)</p></div>)
}
