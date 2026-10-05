import { useLocation, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
export default function Confirmation() {
  const s = useLocation().state as any; if (!s) return <Navigate to="/" />
  return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto text-center space-y-3"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }} className="mx-auto w-16 h-16 rounded-full bg-green-100 text-green-700 text-3xl flex items-center justify-center">✓</motion.div><h1 className="text-3xl font-bold">Your order has been received successfully.</h1>
    <p>Order #{s.order.order_number} • Status: Pending</p><p>{s.customer.name} — {s.customer.governorate}, {s.customer.address}</p>
    <p>Total: <b>{s.order.total} EGP</b> (incl. delivery {s.order.delivery_fee})</p><p>Payment method: Cash on Delivery</p><Link className="btn inline-block" to="/shop">Continue shopping</Link></motion.div>)
}
