import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import toast from 'react-hot-toast'
export type CartItem = { variant_id: string; product_id: string; slug: string; name: string; color: string|null; size: string|null; image: string; unit_price: number; quantity: number; stock: number }
type Ctx = { items: CartItem[]; count: number; subtotal: number; add: (i: CartItem) => void; setQty: (id: string, q: number) => void; remove: (id: string) => void; clear: () => void }
const C = createContext<Ctx>(null as any)
export const useCart = () => useContext(C)
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => { try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] } })
  useEffect(() => localStorage.setItem('cart', JSON.stringify(items)), [items])
  const add = (i: CartItem) => {
    const ex = items.find(x => x.variant_id === i.variant_id); const q = (ex?.quantity ?? 0) + i.quantity
    if (q > i.stock) return toast.error(`Only ${i.stock} left in stock`)
    setItems(ex ? items.map(x => x.variant_id === i.variant_id ? { ...x, quantity: q, stock: i.stock } : x) : [...items, i]); toast.success('Product added to cart')
  }
  const setQty = (id: string, q: number) => {
    const it = items.find(x => x.variant_id === id); if (!it) return
    if (q > it.stock) return toast.error(`Only ${it.stock} left in stock`)
    setItems(q <= 0 ? items.filter(x => x.variant_id !== id) : items.map(x => x.variant_id === id ? { ...x, quantity: q } : x))
  }
  const remove = (id: string) => setItems(items.filter(x => x.variant_id !== id))
  const value = { items, count: items.reduce((s, i) => s + i.quantity, 0), subtotal: items.reduce((s, i) => s + i.unit_price * i.quantity, 0), add, setQty, remove, clear: () => setItems([]) }
  return <C.Provider value={value}>{children}</C.Provider>
}
