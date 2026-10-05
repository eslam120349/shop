import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
export default function Dashboard() {
  const [s, setS] = useState<Record<string, number>>({})
  useEffect(() => { (async () => {
    const c = (t: string, f?: (q: any) => any) => { let q: any = supabase.from(t).select('*', { count: 'exact', head: true }); return (f ? f(q) : q).then((r: any) => r.count ?? 0) }
    const [p, ap, o, pe, de, ca, low, sales] = await Promise.all([c('products'), c('products', q => q.eq('is_active', true)), c('orders'), c('orders', q => q.eq('status', 'pending')),
      c('orders', q => q.eq('status', 'delivered')), c('orders', q => q.eq('status', 'cancelled')), c('product_variants', q => q.lt('stock_quantity', 5)),
      supabase.from('orders').select('total').eq('status', 'delivered').then(r => (r.data ?? []).reduce((a, x) => a + Number(x.total), 0))])
    setS({ 'Total products': p, 'Active products': ap, 'Total orders': o, 'Pending orders': pe, 'Delivered': de, 'Cancelled': ca, 'Low-stock variants (<5)': low, 'Total sales (EGP)': sales }) })() }, [])
  return (<div><h1 className="text-2xl font-bold mb-6">Dashboard</h1><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Object.entries(s).map(([k, v]) => <div key={k} className="border rounded-xl p-5"><p className="text-sm text-gray-500">{k}</p><p className="text-3xl font-bold">{v}</p></div>)}</div></div>)
}
