import { NavLink, Outlet, Link } from 'react-router-dom'
const links = [['/admin', 'Dashboard'], ['/admin/products', 'Products'], ['/admin/categories', 'Categories'], ['/admin/orders', 'Orders'], ['/admin/inventory', 'Inventory']]
export default function AdminLayout() {
  return (<div className="min-h-screen md:flex">
    <aside className="md:w-52 bg-gray-900 text-white p-4 flex md:block gap-3 overflow-x-auto"><b className="hidden md:block mb-4">Admin</b>
      {links.map(([to, l]) => <NavLink key={to} end={to === '/admin'} to={to} className={({ isActive }) => `block py-2 px-3 rounded whitespace-nowrap ${isActive ? 'bg-white text-black' : ''}`}>{l}</NavLink>)}
      <Link to="/" className="block py-2 px-3 text-gray-400">← Store</Link></aside>
    <main className="flex-1 p-4 md:p-8 overflow-x-auto"><Outlet /></main></div>)
}
