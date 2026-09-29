import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import QRCode from 'qrcode'
import { ArrowLeft, CalendarDays, Copy, ExternalLink, Play, Users } from 'lucide-react'
import { getTeacherWorkspace, startSession } from '../services/pilotRepository'

export default function TeacherSession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [qr, setQr] = useState('')

  async function load() { setData(await getTeacherWorkspace()) }
  useEffect(() => { load() }, [sessionId])

  const session = data?.sessions.find((item) => item.id === sessionId)
  const group = data?.groups.find((item) => item.id === session?.groupId)
  const joinUrl = session ? `${window.location.origin}/join/${session.publicCode}` : ''

  useEffect(() => {
    if (joinUrl) QRCode.toDataURL(joinUrl, { width: 420, margin: 2 }).then(setQr)
  }, [joinUrl])

  if (!data) return <div className="min-h-screen grid place-items-center">Sessie laden…</div>
  if (!session) return <div className="min-h-screen grid place-items-center"><div><p>Sessie niet gevonden.</p><Link className="text-indigo-600 underline" to="/teacher">Terug</Link></div></div>

  async function begin() {
    await startSession(session.id)
    await load()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-5 py-8 text-gray-900">
      <section className="mx-auto max-w-6xl">
        <button onClick={() => navigate('/teacher')} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600"><ArrowLeft className="h-4 w-4"/> Terug naar {group?.name}</button>
        <div className="glass-effect rounded-3xl border border-white/80 p-6 shadow-xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div><p className="font-semibold text-indigo-600">{group?.name}</p><h1 className="mt-1 text-3xl font-bold">{session.title}</h1><div className="mt-3 flex items-center gap-2 text-gray-600"><CalendarDays className="h-4 w-4"/>{session.scheduledDate} · {session.scheduledStartTime}</div></div>
            <span className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${session.status === 'live' ? 'bg-emerald-100 text-emerald-700' : session.status === 'ended' ? 'bg-gray-100 text-gray-600' : 'bg-indigo-100 text-indigo-700'}`}>{session.status === 'planned' ? 'Gepland' : session.status === 'live' ? 'Live' : 'Afgerond'}</span>
          </div>

          {session.status !== 'ended' && (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.15fr]">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Deelnemen</p>
                <h2 className="mt-1 text-xl font-bold">Scan de QR-code óf open de link</h2>
                {qr && <img src={qr} alt="QR-code voor deze sessie" className="mx-auto mt-5 w-full max-w-[300px] rounded-xl"/>}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold text-gray-500">Sessie-link</p>
                <div className="mt-2 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                  <p className="break-all text-lg font-bold text-indigo-900">{joinUrl}</p>
                  <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => navigator.clipboard.writeText(joinUrl)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-indigo-700 shadow-sm"><Copy className="h-4 w-4"/> Kopiëren</button><a href={joinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-indigo-700 shadow-sm"><ExternalLink className="h-4 w-4"/> Test ouderweergave</a></div>
                </div>
                <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5"><div className="flex items-center gap-2"><Users className="h-5 w-5 text-indigo-600"/><strong>Wachtkamer</strong></div><p className="mt-2 text-gray-500">Nog geen aangemelde ouders. Straks verschijnt hier het aantal per taal in het Nederlands.</p></div>
                {session.status === 'planned' && <button onClick={begin} className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-4 text-lg font-bold text-white shadow-lg"><Play className="h-5 w-5"/> Start gesprek</button>}
                {session.status === 'live' && <div className="mt-5 rounded-xl bg-emerald-100 p-4 font-semibold text-emerald-800">De sessie is live. Nieuwe ouders mogen nog steeds deelnemen.</div>}
              </div>
            </div>
          )}

          {session.status === 'ended' && <div className="mt-8 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">Gesprek afgerond</h2><p className="mt-2 text-gray-600">{session.participantCount || 0} deelnames · Nederlands transcript wordt in een volgende batch aan deze historie gekoppeld.</p></div>}
        </div>
      </section>
    </main>
  )
}
