import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
type Ctx = { user: User|null; isAdmin: boolean; loading: boolean }
const C = createContext<Ctx>({ user: null, isAdmin: false, loading: true })
export const useAuth = () => useContext(C)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User|null>(null); const [isAdmin, setAdmin] = useState(false); const [loading, setLoading] = useState(true)
  useEffect(() => {
    const load = async (u: User|null) => {
      setUser(u)
      if (u) { const { data } = await supabase.from('profiles').select('role').eq('id', u.id).single(); setAdmin(data?.role === 'admin') } else setAdmin(false)
      setLoading(false)
    }
    supabase.auth.getSession().then(({ data }) => load(data.session?.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { load(s?.user ?? null) })
    return () => sub.subscription.unsubscribe()
  }, [])
  return <C.Provider value={{ user, isAdmin, loading }}>{children}</C.Provider>
}
