import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
export default function Cart() {
  const { items, subtotal, setQty, remove, clear } = useCart()
  if (!items.length) return <div className="text-center py-20"><p className="mb-4">Your cart is empty.</p><Link className="btn" to="/shop">Shop now</Link></div>
  return (<div className="space-y-4"><AnimatePresence initial={false}>{items.map(i => (
    <motion.div key={i.variant_id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }} className="flex gap-4 border-b pb-4 overflow-hidden"><img src={i.image} className="w-20 h-24 object-cover rounded" />
      <div className="flex-1"><Link to={`/products/${i.slug}`} className="font-medium">{i.name}</Link><p className="text-sm text-gray-500">{[i.color, i.size].filter(Boolean).join(' / ')}</p><p>{i.unit_price} EGP</p>
        <div className="flex gap-2 items-center mt-1"><button onClick={() => setQty(i.variant_id, i.quantity - 1)}>−</button>{i.quantity}<button onClick={() => setQty(i.variant_id, i.quantity + 1)}>+</button><button className="ml-4 text-red-600 text-sm" onClick={() => remove(i.variant_id)}>Remove</button></div></div></motion.div>))}</AnimatePresence>
    <p>Subtotal: <b>{subtotal} EGP</b> <span className="text-sm text-gray-500">(delivery fee added at checkout)</span></p>
    <div className="flex gap-3"><Link className="btn" to="/checkout">Checkout</Link><button className="border px-4 rounded-lg" onClick={() => confirm('Clear cart?') && clear()}>Clear cart</button></div></div>)
}
