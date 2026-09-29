import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { KeyRound, Languages } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { signInTeacher } from '../services/authService'

export default function TeacherLogin() {
  const { loading, user, profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && user && profile?.role) return <Navigate to={location.state?.from || (profile.isPlatformAdmin ? '/platform-beheer-portal' : '/teacher')} replace />

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      await signInTeacher(email, password)
      navigate(location.state?.from || '/teacher', { replace: true })
    } catch (problem) {
      setError(problem?.code === 'auth/invalid-credential' ? 'E-mailadres of wachtwoord is niet juist.' : 'Inloggen is niet gelukt. Probeer het opnieuw.')
    } finally { setBusy(false) }
  }

  return <main className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-5">
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white bg-white/90 p-7 shadow-xl">
      <div className="flex items-center gap-3"><div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 p-3 text-white"><Languages/></div><div><p className="text-sm font-semibold text-indigo-600">Live Vertaal Service</p><h1 className="text-2xl font-bold">Inloggen voor medewerkers</h1></div></div>
      <p className="mt-4 text-gray-600">Log in met het account dat door jouw schoolbeheerder is toegewezen.</p>
      <label className="mt-6 block text-sm font-semibold">E-mailadres<input required type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal"/></label>
      <label className="mt-4 block text-sm font-semibold">Wachtwoord<input required type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal"/></label>
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}
      <button disabled={busy} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-5 py-3.5 font-bold text-white shadow-md disabled:opacity-60"><KeyRound className="h-5 w-5"/>{busy ? 'Inloggen…' : 'Inloggen'}</button>
    </form>
  </main>
}
