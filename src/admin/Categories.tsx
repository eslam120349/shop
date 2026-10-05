import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
export const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06ff]+/g, '-').replace(/(^-|-$)/g, '')
export default function Categories() {
  const [rows, setRows] = useState<any[]>([]); const [name, setName] = useState(''); const [edit, setEdit] = useState<any>(null)
  const load = () => supabase.from('categories').select('*').order('name').then(r => setRows(r.data ?? []))
  useEffect(() => { load() }, [])
  const done = (error: any, msg: string) => { error ? toast.error(error.message) : (toast.success(msg), load()) }
  const add = async () => { if (!name.trim()) return; const { error } = await supabase.from('categories').insert({ name: name.trim(), slug: slugify(name) }); setName(''); done(error, 'Category created') }
  const save = async () => { const { error } = await supabase.from('categories').update({ name: edit.name, slug: slugify(edit.name) }).eq('id', edit.id); setEdit(null); done(error, 'Category updated') }
  return (<div className="max-w-2xl"><h1 className="text-2xl font-bold mb-4">Categories</h1>
    <div className="flex gap-2 mb-4"><input className="inp" placeholder="New category name" value={name} onChange={e => setName(e.target.value)} /><button className="btn" onClick={add}>Add</button></div>
    {rows.map(c => <div key={c.id} className="flex items-center gap-3 border-b py-2">
      {edit?.id === c.id ? <><input className="inp" value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} /><button onClick={save}>Save</button></> : <><span className="flex-1">{c.name} <span className="text-gray-400 text-sm">/{c.slug}</span></span><button onClick={() => setEdit(c)}>Edit</button></>}
      <button onClick={async () => done((await supabase.from('categories').update({ is_active: !c.is_active }).eq('id', c.id)).error, 'Updated')}>{c.is_active ? 'Active' : 'Inactive'}</button>
      <button className="text-red-600" onClick={async () => confirm('Delete category?') && done((await supabase.from('categories').delete().eq('id', c.id)).error, 'Category deleted')}>Delete</button></div>)}</div>)
}
