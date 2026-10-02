import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getLanguage, languages, t } from '../i18n/locales'
import { joinPublicSession, subscribePublicSession, touchPresence } from '../services/pilotRepository'

export default function ParentJoinV3(){
 const {publicCode}=useParams()
 const languageKey=`lvs:v3:language:${publicCode}`,participantKey=`lvs:v3:participant:${publicCode}`
 const [languageCode,setLanguageCode]=useState(()=>localStorage.getItem(languageKey)||'')
 const [session,setSession]=useState(undefined),[sessionError,setSessionError]=useState(''),[presenceError,setPresenceError]=useState('')
 const participantId=useMemo(()=>{let id=localStorage.getItem(participantKey);if(!id){id=crypto.randomUUID();localStorage.setItem(participantKey,id)}return id},[participantKey])
 const language=getLanguage(languageCode||'nl')
 useEffect(()=>subscribePublicSession(publicCode,s=>{setSession(s);setSessionError('')},e=>setSessionError(e.message||'Sessie kon niet worden geladen.')),[publicCode])
 useEffect(()=>{if(!languageCode||!session)return;localStorage.setItem(languageKey,languageCode);joinPublicSession(publicCode,participantId,languageCode).then(()=>setPresenceError('')).catch(e=>setPresenceError(e.message||'Aanmelden bij de wachtkamer mislukt.'));const timer=setInterval(()=>touchPresence(publicCode,participantId,languageCode).catch(()=>setPresenceError('Verbinding met de wachtkamer wordt hersteld…')),30000);return()=>clearInterval(timer)},[languageCode,session?.id,publicCode,participantId,languageKey])
 if(sessionError)return <Screen><h1 className="text-2xl font-bold">Deze sessie kan niet worden geopend</h1><p className="mt-3 text-slate-600">{sessionError}</p></Screen>
 if(session===undefined)return <Screen><p className="font-semibold text-indigo-600">Sessie laden…</p></Screen>
 if(session===null)return <Screen><h1 className="text-2xl font-bold">Sessie niet gevonden</h1><p className="mt-3 text-slate-600">Controleer de QR-code of vraag de leerkracht om een nieuwe link.</p></Screen>
 if(!languageCode)return <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-5 py-10 text-slate-950"><section className="mx-auto max-w-lg"><p className="text-sm font-semibold text-indigo-600">{session.title}</p><h1 className="mt-3 text-3xl font-bold">Kies uw voorkeurstaal</h1><p className="mt-1 text-xl">Choose your preferred language</p><p className="mt-1 text-xl" dir="rtl">اختر لغتك المفضلة</p><div className="mt-8 grid gap-3">{languages.map(item=><button key={item.code} type="button" dir={item.dir} onClick={()=>setLanguageCode(item.code)} className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-left text-lg font-semibold shadow-sm hover:border-indigo-300">{item.nativeName}</button>)}</div></section></main>
 return <main dir={language.dir} className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 px-5 py-12 text-white"><section className="mx-auto max-w-xl"><button className="mb-8 text-sm text-slate-300 underline" onClick={()=>{localStorage.removeItem(languageKey);setLanguageCode('')}}>{language.nativeName}</button><p className="text-sm font-semibold text-cyan-300">{session.title}</p><h1 className="mt-2 text-4xl font-bold">{t(languageCode,'welcome')}</h1><p className="mt-3 text-lg text-slate-300">{session.status==='live'?t(languageCode,'live'):t(languageCode,'waiting')}</p><div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6"><div className="flex items-center gap-3"><span className={`h-3 w-3 rounded-full ${presenceError?'bg-amber-400':'bg-emerald-400'}`}></span><p className="font-semibold">{presenceError||t(languageCode,'connection')}</p></div></div></section></main>
}
function Screen({children}){return <main className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-5"><section className="max-w-lg rounded-3xl bg-white p-8 shadow-xl">{children}</section></main>}
