import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
export default function Checkout() {
  const { items, subtotal, clear } = useCart(); const { user } = useAuth(); const nav = useNavigate()
  const [f, setF] = useState({ name: '', phone: '', email: '', governorate: '', city: '', address: '', notes: '' })
  const [fee, setFee] = useState(0); const [busy, setBusy] = useState(false)
  useEffect(() => { supabase.from('store_settings').select('delivery_fee').single().then(r => setFee(Number(r.data?.delivery_fee ?? 0))) }, [])
  useEffect(() => { if (user) supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => data && setF(x => ({ ...x, name: data.full_name ?? '', phone: data.phone ?? '', email: data.email ?? '', governorate: data.governorate ?? '', city: data.city ?? '', address: data.address ?? '' }))) }, [user])
  if (!items.length && !busy) return <Navigate to="/cart" />
  const on = (k: keyof typeof f) => (e: any) => setF({ ...f, [k]: e.target.value })
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true)
    const { data, error } = await supabase.rpc('create_order', { p_customer: f, p_items: items.map(i => ({ variant_id: i.variant_id, quantity: i.quantity })) })
    if (error) { setBusy(false); return toast.error(error.message.includes('OUT_OF_STOCK') ? error.message.replace(/.*OUT_OF_STOCK: /, 'Out of stock: ') : error.message.includes('INVALID_VARIANT') ? 'An item is no longer available.' : 'Could not place order. Please check your details.') }
    toast.success('Order placed successfully'); nav('/order-confirmation', { state: { order: data, customer: f } }); clear()
  }
  return (<form onSubmit={submit} className="grid md:grid-cols-2 gap-8">
    <div className="space-y-3"><h2 className="text-xl font-bold">Delivery information</h2>
      <input className="inp" required placeholder="Full name" value={f.name} onChange={on('name')} />
      <input className="inp" required placeholder="Phone" value={f.phone} onChange={on('phone')} />
      <input className="inp" type="email" placeholder="Email (optional)" value={f.email} onChange={on('email')} />
      <input className="inp" required placeholder="Governorate" value={f.governorate} onChange={on('governorate')} />
      <input className="inp" placeholder="City" value={f.city} onChange={on('city')} />
      <textarea className="inp" required placeholder="Full address" value={f.address} onChange={on('address')} />
      <textarea className="inp" placeholder="Notes (optional)" value={f.notes} onChange={on('notes')} /></div>
    <div className="space-y-3 border rounded-lg p-4 h-fit"><h2 className="text-xl font-bold">Order summary</h2>
      {items.map(i => <p key={i.variant_id} className="flex justify-between text-sm"><span>{i.name} {[i.color, i.size].filter(Boolean).join('/')} ×{i.quantity}</span><span>{i.unit_price * i.quantity}</span></p>)}
      <hr /><p className="flex justify-between"><span>Subtotal</span>{subtotal} EGP</p><p className="flex justify-between"><span>Delivery</span>{fee} EGP</p>
      <p className="flex justify-between font-bold"><span>Total</span>{subtotal + fee} EGP</p>
      <p className="text-sm bg-gray-100 p-3 rounded">Cash on Delivery — Payment will be made in cash when the order is delivered.</p>
      <button className="btn w-full" disabled={busy}>{busy ? 'Placing order…' : 'Confirm order'}</button></div></form>)
}
