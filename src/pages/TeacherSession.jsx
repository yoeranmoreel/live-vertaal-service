import { useEffect,useMemo,useState } from 'react'
import { Link,useNavigate,useParams } from 'react-router-dom'
import QRCode from 'qrcode'
import { ArrowLeft,CalendarDays,Copy,ExternalLink,Play,Users } from 'lucide-react'
import { endSession,startSession,subscribeSessionParticipants,subscribeTeacherWorkspace,syncPublicSessionStatus } from '../services/pilotRepository'
import { getLanguage } from '../i18n/locales'
export default function TeacherSession(){
 const {sessionId}=useParams(),navigate=useNavigate()
 const [data,setData]=useState(null),[error,setError]=useState(''),[qr,setQr]=useState(''),[participants,setParticipants]=useState([]),[presenceClock,setPresenceClock]=useState(Date.now())
 useEffect(()=>subscribeTeacherWorkspace(r=>{setData(r);setError('')},p=>setError(p.message)),[sessionId])
 const session=data?.sessions.find(s=>s.id===sessionId),group=data?.groups.find(g=>g.id===session?.groupId)
 const publicOrigin=(import.meta.env.VITE_PUBLIC_APP_ORIGIN||window.location.origin).replace(/\/$/,'')
 const joinUrl=session?`${publicOrigin}/join/${session.publicCode}`:''
 useEffect(()=>{if(joinUrl)QRCode.toDataURL(joinUrl,{width:420,margin:2}).then(setQr)},[joinUrl])
 useEffect(()=>session?.publicCode?subscribeSessionParticipants(session.publicCode,setParticipants,e=>setError(e.message)):()=>{},[session?.publicCode])
 useEffect(()=>{const timer=setInterval(()=>setPresenceClock(Date.now()),15000);return()=>clearInterval(timer)},[])
 useEffect(()=>{
  if(!session?.publicCode||!['live','ended'].includes(session.status))return
  syncPublicSessionStatus(session).catch(e=>setError(e.message||'Publieke sessiestatus kon niet worden hersteld.'))
 },[session?.id,session?.publicCode,session?.status])
 const activeParticipants=useMemo(()=>participants.filter(p=>{
  const lastSeen=p.lastSeenAt?.toMillis?.()??0
  return lastSeen>0&&presenceClock-lastSeen<75000
 }),[participants,presenceClock])
 const languageCounts=useMemo(()=>activeParticipants.reduce((a,p)=>{a[p.languageCode]=(a[p.languageCode]||0)+1;return a},{}),[activeParticipants])
 if(error)return <div className="min-h-screen grid place-items-center p-5"><div className="max-w-lg rounded-2xl bg-white p-6 shadow-xl"><p className="font-bold">Sessie niet toegankelijk</p><p className="mt-2 text-gray-600">{error}</p><Link className="mt-4 inline-block text-indigo-600 underline" to="/teacher">Terug</Link></div></div>
 if(!data)return <div className="min-h-screen grid place-items-center">Sessie laden…</div>
 if(!session)return <div className="min-h-screen grid place-items-center"><Link to="/teacher">Sessie niet gevonden · terug</Link></div>
 async function begin(){try{await startSession(session.id)}catch(p){setError(p.message||'Starten mislukt.')}}
 async function finish(){if(!window.confirm('Sessie stoppen? De ouderweergave wordt afgesloten.'))return;try{await endSession(session.id)}catch(p){setError(p.message||'Stoppen mislukt.')}}
 return <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-5 py-8 text-gray-900"><section className="mx-auto max-w-6xl">
 <button onClick={()=>navigate('/teacher')} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600"><ArrowLeft className="h-4 w-4"/>Terug naar {group?.name}</button>
 <div className="glass-effect rounded-3xl border border-white/80 p-6 shadow-xl md:p-8"><div className="flex justify-between gap-5"><div><p className="font-semibold text-indigo-600">{group?.name}</p><h1 className="mt-1 text-3xl font-bold">{session.title}</h1><div className="mt-3 flex items-center gap-2 text-gray-600"><CalendarDays className="h-4 w-4"/>{session.scheduledDate} · {session.scheduledStartTime}</div></div><span className="h-fit rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">{session.status==='planned'?'Gepland':session.status==='live'?'Live':'Afgerond'}</span></div>
 {session.status!=='ended'&&<div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.15fr]"><div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-gray-500">Deelnemen</p><h2 className="mt-1 text-xl font-bold">Scan de QR-code óf open de link</h2>{qr&&<img src={qr} alt="QR-code" className="mx-auto mt-5 w-full max-w-[300px] rounded-xl"/>}</div>
 <div className="flex flex-col justify-center"><p className="text-sm font-semibold text-gray-500">Sessie-link</p><div className="mt-2 rounded-2xl border border-indigo-100 bg-indigo-50 p-5"><p className="break-all text-lg font-bold text-indigo-900">{joinUrl}</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>navigator.clipboard.writeText(joinUrl)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-indigo-700"><Copy className="h-4 w-4"/>Kopiëren</button><a href={joinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-indigo-700"><ExternalLink className="h-4 w-4"/>Test ouderweergave</a></div></div>
 <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5"><div className="flex items-center gap-2"><Users className="h-5 w-5 text-indigo-600"/><strong>Wachtkamer · {activeParticipants.length} {activeParticipants.length===1?'deelnemer':'deelnemers'}</strong></div>{activeParticipants.length===0?<p className="mt-2 text-gray-500">Nog geen aangemelde ouders.</p>:<div className="mt-4 flex flex-wrap gap-2">{Object.entries(languageCounts).map(([code,count])=><span key={code} className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">{getLanguage(code).teacherName} · {count}</span>)}</div>}</div>
 {session.status==='planned'&&<button onClick={begin} className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-4 text-lg font-bold text-white shadow-lg"><Play className="h-5 w-5"/>Start gesprek</button>}{session.status==='live'&&<><div className="mt-5 rounded-xl bg-emerald-100 p-4 font-semibold text-emerald-800">De sessie is live. Nieuwe ouders mogen nog steeds deelnemen.</div><button onClick={finish} className="mt-3 w-full rounded-xl border-2 border-red-200 bg-white px-6 py-3 font-bold text-red-700 hover:bg-red-50">Sessie stoppen</button></>}</div></div>}
 </div></section></main>
}