import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CalendarDays, History, Plus, Radio, Users, X } from 'lucide-react'
import { createPlannedSession, subscribeTeacherWorkspace } from '../services/pilotRepository'

const statusMeta = {
  planned: { label: 'Gepland', icon: CalendarDays, accent: 'text-indigo-600', empty: 'Nog geen geplande sessies.' },
  live: { label: 'Live', icon: Radio, accent: 'text-emerald-600', empty: 'Geen actieve sessie.' },
  ended: { label: 'Historie', icon: History, accent: 'text-slate-500', empty: 'Nog geen sessiehistorie.' },
}

function prettyDate(session) {
  const date = new Date(`${session.scheduledDate}T${session.scheduledStartTime || '12:00'}`)
  return new Intl.DateTimeFormat('nl-NL', { weekday: 'short', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(date)
}

export default function TeacherWorkspace() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [groupId, setGroupId] = useState('')
  const [planning, setPlanning] = useState(false)

  useEffect(() => subscribeTeacherWorkspace((result) => {
    setError('')
    setData(result)
    setGroupId((current) => current || result.groups[0]?.id || '')
  }, (problem) => setError(problem.message)), [])

  const group = data?.groups.find((item) => item.id === groupId)
  const sessions = useMemo(() => (data?.sessions || []).filter((item) => item.groupId === groupId), [data, groupId])

  if (error) return <BackendGate message={error} />
  if (!data) return <div className="min-h-screen grid place-items-center text-indigo-600">Gedeelde schoolomgeving laden…</div>

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 text-gray-900">
      <header className="border-b border-white/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Live Vertaal Service · Pilot V3</p>
            <h1 className="mt-1 text-3xl font-bold">Welkom terug, {data.teacher.displayName}! 👋</h1>
            <p className="mt-1 text-gray-600">Plan oudercontacten rustig vooraf en beheer ze samen met je collega's.</p>
          </div>
          <button onClick={() => setPlanning(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5">
            <Plus className="h-5 w-5" /> Sessie plannen
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-7 flex flex-wrap gap-3">
          {data.groups.map((item) => (
            <button key={item.id} onClick={() => setGroupId(item.id)} className={`rounded-xl border px-4 py-2.5 font-semibold transition ${item.id === groupId ? 'border-indigo-200 bg-indigo-600 text-white shadow-md' : 'border-white bg-white/80 text-gray-700 hover:border-indigo-200'}`}>
              {item.name}
            </button>
          ))}
        </div>

        {data.groups.length === 0 ? (
          <div className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm"><h2 className="text-xl font-bold">Firebase is verbonden</h2><p className="mt-2 text-gray-600">Er zijn nog geen groepen voor deze school. Na de auth/bootstrap-stap vullen we de pilot-school eenmalig met groepen en leden.</p></div>
        ) : (
          <div className="glass-effect rounded-3xl border border-white/80 p-6 shadow-xl shadow-indigo-100/50">
            <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-sm font-medium text-gray-500">Gezamenlijke groepsomgeving</p><h2 className="text-2xl font-bold">{group?.name}</h2></div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><Users className="h-4 w-4"/><span>Beheerd door {group?.teacherNames?.join(' & ') || 'schoolteam'}</span></div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {Object.entries(statusMeta).map(([status, meta]) => {
                const Icon = meta.icon
                const items = sessions.filter((item) => item.status === status)
                return (
                  <section key={status} className="rounded-2xl border border-gray-100 bg-white/80 p-4">
                    <div className="flex items-center gap-2"><Icon className={`h-5 w-5 ${meta.accent}`}/><h3 className="font-bold">{meta.label}</h3><span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">{items.length}</span></div>
                    <div className="mt-4 space-y-3">
                      {items.length === 0 && <p className="py-5 text-sm text-gray-400">{meta.empty}</p>}
                      {items.map((session) => (
                        <button key={session.id} onClick={() => navigate(`/teacher/session/${session.id}`)} className="w-full rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                          <div className="flex items-start justify-between gap-2"><p className="font-bold text-gray-800">{session.title}</p>{status === 'live' && <span className="mt-1 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"/>}</div>
                          <p className="mt-2 text-sm text-gray-500">{prettyDate(session)}</p>
                          {status === 'ended' && <p className="mt-2 text-xs font-medium text-indigo-600">{session.participantCount || 0} deelnames · Transcript beschikbaar</p>}
                        </button>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        )}
      </section>
      {planning && <Planner groups={data.groups} initialGroupId={groupId} onClose={() => setPlanning(false)} onCreated={(session) => { setPlanning(false); navigate(`/teacher/session/${session.id}`) }} />}
    </main>
  )
}

function BackendGate({ message }) {
  return <main className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-5"><div className="max-w-xl rounded-3xl border border-amber-100 bg-white p-7 shadow-xl"><div className="flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-amber-500"/><h1 className="text-xl font-bold">Firebase staat aan — toegang is nog dicht</h1></div><p className="mt-3 text-gray-600">{message}</p><p className="mt-3 text-sm text-gray-500">Dit is expres: de database wordt niet tijdelijk openbaar gemaakt om de pilot te testen.</p></div></main>
}

function Planner({ groups, initialGroupId, onClose, onCreated }) {
  const [form, setForm] = useState({ groupId: initialGroupId, title: '', scheduledDate: '', scheduledStartTime: '19:00', summaryEnabled: true })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const change = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))

  async function submit(event) {
    event.preventDefault(); setSaving(true); setError('')
    try { onCreated(await createPlannedSession(form)) } catch (problem) { setError(problem.message || 'Opslaan mislukt.') } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-indigo-600">Rustig vooraf klaarzetten</p><h2 className="text-2xl font-bold">Sessie plannen</h2></div><button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100"><X/></button></div>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">Groep<select required value={form.groupId} onChange={change('groupId')} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal">{groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label>
          <label className="block text-sm font-semibold">Naam van het gesprek<input required value={form.title} onChange={change('title')} placeholder="Bijv. Informatieavond" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal"/></label>
          <div className="grid grid-cols-2 gap-3"><label className="block text-sm font-semibold">Datum<input required type="date" value={form.scheduledDate} onChange={change('scheduledDate')} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-3 font-normal"/></label><label className="block text-sm font-semibold">Begintijd<input required type="time" value={form.scheduledStartTime} onChange={change('scheduledStartTime')} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-3 font-normal"/></label></div>
          <label className="flex items-start gap-3 rounded-xl bg-indigo-50 p-4"><input type="checkbox" checked={form.summaryEnabled} onChange={change('summaryEnabled')} className="mt-1 h-4 w-4"/><span><strong className="block text-sm">Samenvatting voor ouders</strong><span className="text-sm text-gray-600">Na afloop pas beschikbaar nadat een leerkracht de samenvatting heeft gecontroleerd en goedgekeurd.</span></span></label>
          {error && <p className="rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-800">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl px-4 py-3 font-semibold text-gray-600">Annuleren</button><button disabled={saving || groups.length === 0} className="rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-5 py-3 font-semibold text-white shadow-md disabled:opacity-50">{saving ? 'Opslaan…' : 'Sessie plannen'}</button></div>
      </form>
    </div>
  )
}
