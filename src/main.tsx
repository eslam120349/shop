import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { CartProvider } from './contexts/CartContext'
import { Layout, AdminRoute } from './components/Layout'
import './index.css'
const AdminLayout = lazy(() => import('./admin/AdminLayout')), Dashboard = lazy(() => import('./admin/Dashboard')), Products = lazy(() => import('./admin/Products')), ProductForm = lazy(() => import('./admin/ProductForm')), Categories = lazy(() => import('./admin/Categories')), Inventory = lazy(() => import('./admin/Inventory'))
const Orders = lazy(() => import('./admin/Orders').then(m => ({ default: m.Orders }))), OrderDetail = lazy(() => import('./admin/Orders').then(m => ({ default: m.OrderDetail })))
const Home = lazy(() => import('./pages/Home')), Account = lazy(() => import('./pages/Account')), Wishlist = lazy(() => import('./pages/Wishlist'))
const Shop = lazy(() => import('./pages/Shop')), Product = lazy(() => import('./pages/Product')), Cart = lazy(() => import('./pages/Cart')),
  Checkout = lazy(() => import('./pages/Checkout')), Confirmation = lazy(() => import('./pages/Confirmation')), Login = lazy(() => import('./pages/Login'))
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><AuthProvider><WishlistProvider><CartProvider><MotionConfig reducedMotion="user"><Toaster position="top-center" />
    <Suspense fallback={<p className="p-8">Loading…</p>}><Routes><Route element={<Layout />}>
      <Route path="/" element={<Home />} /><Route path="/account" element={<Account />} /><Route path="/wishlist" element={<Wishlist />} /><Route path="/shop" element={<Shop />} />
      <Route path="/products/:slug" element={<Product />} /><Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} /><Route path="/order-confirmation" element={<Confirmation />} />
      <Route path="/login" element={<Login />} />
    </Route><Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}><Route index element={<Dashboard />} /><Route path="products" element={<Products />} /><Route path="products/new" element={<ProductForm />} /><Route path="products/:id/edit" element={<ProductForm />} /><Route path="categories" element={<Categories />} /><Route path="orders" element={<Orders />} /><Route path="orders/:id" element={<OrderDetail />} /><Route path="inventory" element={<Inventory />} /></Route></Routes></Suspense></MotionConfig></CartProvider></WishlistProvider></AuthProvider></BrowserRouter></React.StrictMode>)
