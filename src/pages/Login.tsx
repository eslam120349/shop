import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
export default function Login() {
  const [mode, setMode] = useState<'in'|'up'>('in'); const [email, setEmail] = useState(''); const [password, setPw] = useState(''); const [name, setName] = useState(''); const nav = useNavigate()
  const submit = async (e: React.FormEvent) => { e.preventDefault()
    const { error } = mode === 'in' ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) return toast.error(error.message); toast.success(mode === 'in' ? 'Welcome back' : 'Account created'); nav('/') }
  const forgot = async () => { if (!email) return toast.error('Enter your email first'); const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/login' }); error ? toast.error(error.message) : toast.success('Reset link sent') }
  return (<form onSubmit={submit} className="max-w-sm mx-auto space-y-3"><h1 className="text-2xl font-bold">{mode === 'in' ? 'Login' : 'Register'}</h1>
    {mode === 'up' && <input className="inp" required placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />}
    <input className="inp" type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
    <input className="inp" type="password" required minLength={6} placeholder="Password" value={password} onChange={e => setPw(e.target.value)} />
    <button className="btn w-full">{mode === 'in' ? 'Login' : 'Create account'}</button>
    <button type="button" className="text-sm underline" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>{mode === 'in' ? 'Create an account' : 'I have an account'}</button>
    {mode === 'in' && <button type="button" className="text-sm underline block" onClick={forgot}>Forgot password?</button>}</form>)
}
