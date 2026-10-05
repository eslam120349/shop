import { Link, Outlet, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useWishlist } from '../contexts/WishlistContext'
import { supabase } from '../lib/supabase'
export function Layout() {
  const { count } = useCart(); const { pathname } = useLocation(); const { ids } = useWishlist(); const { user } = useAuth()
  return (<div className="min-h-screen flex flex-col">
    <header className="border-b sticky top-0 bg-white z-10"><nav className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4 sm:gap-6">
      <Link to="/" className="font-bold text-xl mr-auto">STORE</Link>
      <Link to="/shop">Shop</Link>
      <Link to="/wishlist">♡{ids.length ? ` (${ids.length})` : ''}</Link>{user ? <><Link to="/account">Account</Link><button onClick={() => supabase.auth.signOut()}>Logout</button></> : <Link to="/login">Login</Link>}
      <Link to="/cart">Cart (<motion.span key={count} className="inline-block" initial={{ scale: 1.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>{count}</motion.span>)</Link></nav></header>
    <motion.main key={pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="flex-1 max-w-6xl w-full mx-auto px-4 py-6"><Outlet /></motion.main>
    <footer className="border-t text-center text-sm py-6 text-gray-500">Cash on Delivery • © Store</footer></div>)
}
export function AdminRoute({ children }: { children: JSX.Element }) {
  const { isAdmin, loading } = useAuth(); if (loading) return <p className="p-8">Loading…</p>
  return isAdmin ? children : <Navigate to="/" replace />
}
