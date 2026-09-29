import { Building2, ShieldCheck, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { signOutUser } from '../services/authService'

export default function PlatformAdmin() {
  const { profile } = useAuth()
  return <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-5 text-white">
    <section className="mx-auto max-w-6xl py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[.22em] text-cyan-300">Platformbeheer</p><h1 className="mt-2 text-4xl font-bold">Live Vertaal Service</h1><p className="mt-2 text-slate-300">Ingelogd als {profile?.email}</p></div><button onClick={()=>signOutUser()} className="rounded-xl border border-white/20 px-4 py-2 font-semibold">Uitloggen</button></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <AdminCard icon={Building2} title="Scholen" text="Pilot-scholen aanmaken en beheren. De beheerfuncties worden in de volgende backendstap aangesloten."/>
        <AdminCard icon={Users} title="Accounts & rollen" text="Schooladmins en medewerkers koppelen zonder een publieke registratiepagina."/>
        <AdminCard icon={ShieldCheck} title="Platformtoegang" text="Deze pagina staat niet in de navigatie en vereist daarnaast de platformAdmin-rol in Firestore."/>
      </div>
    </section>
  </main>
}
function AdminCard({icon:Icon,title,text}) { return <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"><Icon className="h-7 w-7 text-cyan-300"/><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mt-2 text-slate-300">{text}</p></div> }
