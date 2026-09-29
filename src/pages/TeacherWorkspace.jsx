import { CalendarDays, History, Radio } from 'lucide-react'

const sections = [
  { title: 'Gepland', Icon: CalendarDays, empty: 'Nog geen geplande sessies.' },
  { title: 'Live', Icon: Radio, empty: 'Geen actieve sessie.' },
  { title: 'Historie', Icon: History, empty: 'Nog geen sessiehistorie.' },
]

export default function TeacherWorkspace() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b bg-white"><div className="mx-auto max-w-6xl px-6 py-6"><p className="text-sm font-semibold text-cyan-700">Live Vertaal Service · Pilot V3</p><h1 className="mt-1 text-3xl font-bold">Leerkrachtomgeving</h1></div></header>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between gap-4"><div><p className="text-sm text-slate-500">Groepsomgeving</p><h2 className="text-2xl font-bold">Groep 3A <span className="text-base font-normal text-slate-500">(demo)</span></h2></div><button className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">+ Sessie plannen</button></div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {sections.map(({title,Icon,empty}) => <section key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><Icon className="h-5 w-5"/><h3 className="font-bold">{title}</h3></div><p className="mt-8 text-sm text-slate-500">{empty}</p></section>)}
        </div>
      </section>
    </main>
  )
}
