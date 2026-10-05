import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
const C = createContext<{ ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void }>(null as any)
export const useWishlist = () => useContext(C)
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); const [ids, setIds] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('wishlist') || '[]') } catch { return [] } })
  useEffect(() => localStorage.setItem('wishlist', JSON.stringify(ids)), [ids])
  useEffect(() => { if (!user) return; (async () => {
    const { data } = await supabase.from('wishlists').select('product_id'); const db = (data ?? []).map(r => r.product_id)
    const extra = ids.filter(i => !db.includes(i)); if (extra.length) await supabase.from('wishlists').insert(extra.map(product_id => ({ user_id: user.id, product_id })))
    setIds([...new Set([...db, ...ids])]) })() }, [user?.id])
  const toggle = async (id: string) => { const on = ids.includes(id); setIds(on ? ids.filter(i => i !== id) : [...ids, id])
    toast.success(on ? 'Product removed from wishlist' : 'Product added to wishlist')
    if (user) { const { error } = on ? await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', id) : await supabase.from('wishlists').insert({ user_id: user.id, product_id: id }); if (error) toast.error(error.message) } }
  return <C.Provider value={{ ids, has: id => ids.includes(id), toggle }}>{children}</C.Provider>
}
