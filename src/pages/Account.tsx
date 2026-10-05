import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
export default function Account() {
  const { user, loading } = useAuth(); const [p, setP] = useState<any>({}); const [orders, setOrders] = useState<any[]>([]); const [open, setOpen] = useState<string|null>(null)
  useEffect(() => { if (!user) return; supabase.from('profiles').select('*').eq('id', user.id).single().then(r => setP(r.data ?? {}))
    supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).then(r => setOrders(r.data ?? [])) }, [user?.id])
  if (loading) return <p>Loading…</p>; if (!user) return <Navigate to="/login" />
  const save = async (e: React.FormEvent) => { e.preventDefault(); const { error } = await supabase.from('profiles').update({ full_name: p.full_name, phone: p.phone, governorate: p.governorate, city: p.city, address: p.address }).eq('id', user.id); error ? toast.error(error.message) : toast.success('Profile updated') }
  const on = (k: string) => (e: any) => setP({ ...p, [k]: e.target.value })
  return (<div className="grid md:grid-cols-2 gap-10"><form onSubmit={save} className="space-y-3"><h2 className="text-xl font-bold">Profile & address</h2><p className="text-sm text-gray-500">{user.email}</p>
    <input className="inp" placeholder="Full name" value={p.full_name ?? ''} onChange={on('full_name')} /><input className="inp" placeholder="Phone" value={p.phone ?? ''} onChange={on('phone')} />
    <input className="inp" placeholder="Governorate" value={p.governorate ?? ''} onChange={on('governorate')} /><input className="inp" placeholder="City" value={p.city ?? ''} onChange={on('city')} />
    <textarea className="inp" placeholder="Address" value={p.address ?? ''} onChange={on('address')} /><button className="btn">Save</button></form>
    <div><h2 className="text-xl font-bold mb-3">My orders</h2>{!orders.length && <p className="text-gray-500">No orders yet.</p>}
      {orders.map(o => <div key={o.id} className="border rounded-lg p-3 mb-2"><button className="w-full flex justify-between" onClick={() => setOpen(open === o.id ? null : o.id)}><span>#{o.order_number} • {new Date(o.created_at).toLocaleDateString()}</span><span>{o.total} EGP • {o.status}</span></button>
        {open === o.id && <div className="mt-2 text-sm">{o.order_items.map((i: any) => <p key={i.id}>{i.product_name_snapshot} {[i.variant_snapshot?.color, i.variant_snapshot?.size].filter(Boolean).join('/')} ×{i.quantity} — {i.total_price}</p>)}<p className="mt-1">{o.governorate}, {o.address} • Cash on Delivery</p></div>}</div>)}</div></div>)
}
