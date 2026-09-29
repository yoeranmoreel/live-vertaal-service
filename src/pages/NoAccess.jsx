import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'
import { signOutUser } from '../services/authService'

export default function NoAccess() {
  return <main className="min-h-screen grid place-items-center bg-slate-50 p-5"><div className="max-w-lg rounded-3xl bg-white p-7 text-center shadow-xl"><ShieldX className="mx-auto h-10 w-10 text-amber-500"/><h1 className="mt-4 text-2xl font-bold">Nog geen toegang toegewezen</h1><p className="mt-2 text-gray-600">Je account bestaat, maar is nog niet gekoppeld aan een schoolrol.</p><Link to="/teacher/login" onClick={()=>signOutUser()} className="mt-5 inline-block font-semibold text-indigo-600 underline">Uitloggen en terug</Link></div></main>
}
