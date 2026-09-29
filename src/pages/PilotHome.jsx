import { Link } from 'react-router-dom'
import { Languages, ShieldCheck, Radio, Users } from 'lucide-react'
import { firebaseConfigured } from '../services/firebase'

export default function PilotHome() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Pilot V3</p>
        <h1 className="max-w-3xl text-5xl font-bold leading-tight">Live Vertaal Service</h1>
        <p className="mt-6 max-w-2xl text-xl text-slate-300">Plan vooraf. Toon QR + URL. Praat Nederlands. Ouders volgen live in hun eigen taal.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/teacher" className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-950">Leerkrachtomgeving</Link>
          <Link to="/join/DEMO" className="rounded-xl border border-slate-600 px-6 py-3 font-semibold">Ouderflow bekijken</Link>
        </div>
        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
          Firebase: <strong className={firebaseConfigured ? 'text-emerald-300' : 'text-amber-300'}>{firebaseConfigured ? 'geconfigureerd' : 'nog niet gekoppeld'}</strong>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {[[Users,'Geen ouderaccount'],[Languages,'Volledig meertalig'],[Radio,'Realtime'],[ShieldCheck,'Privacy-by-design']].map(([Icon,label]) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><Icon className="mb-4 h-6 w-6 text-cyan-300"/><p className="font-semibold">{label}</p></div>
          ))}
        </div>
      </section>
    </main>
  )
}
