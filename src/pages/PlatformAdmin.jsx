import { useEffect, useMemo, useState } from 'react'
import { Building2, LogOut, Plus, Save, ShieldCheck, Trash2, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { signOutUser } from '../services/authService'
import { createGroup, deleteGroup, deleteMember, saveMember, saveSchoolName, subscribePlatformAdmin, updateGroup } from '../services/platformAdminService'

const emptyMember = { uid: '', displayName: '', email: '', role: 'teacher', groupIds: [] }

export default function PlatformAdmin() {
  const { profile } = useAuth()
  const [data, setData] = useState({ school: null, groups: [], members: [] })
  const [schoolName, setSchoolName] = useState('')
  const [groupName, setGroupName] = useState('')
  const [member, setMember] = useState(emptyMember)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => subscribePlatformAdmin((next) => {
    setData(next)
    if (next.school?.name) setSchoolName(next.school.name)
  }, (err) => setError(err.message)), [])

  const stats = useMemo(() => ({
    groups: data.groups.filter((g) => g.active !== false).length,
    members: data.members.length,
    admins: data.members.filter((m) => m.role === 'schoolAdmin').length,
  }), [data])

  async function run(action, success) {
    setBusy(true); setError(''); setMessage('')
    try { await action(); setMessage(success); return true }
    catch (err) { setError(err.message || 'Er ging iets mis.'); return false }
    finally { setBusy(false) }
  }

  async function addGroup(event) {
    event.preventDefault()
    if (await run(() => createGroup(groupName), 'Groep aangemaakt.')) setGroupName('')
  }

  function editMember(item) {
    setMember({ uid: item.id, displayName: item.displayName || '', email: item.email || '', role: item.role || 'teacher', groupIds: item.groupIds || [] })
  }

  const toggleGroup = (id) => setMember((current) => ({ ...current, groupIds: current.groupIds.includes(id) ? current.groupIds.filter((groupId) => groupId !== id) : [...current.groupIds, id] }))

  return <main className="min-h-screen bg-slate-950 p-5 text-white"><section className="mx-auto max-w-6xl py-8">
    <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[.22em] text-cyan-300">Platformbeheer</p><h1 className="mt-2 text-4xl font-bold">Live Vertaal Service</h1><p className="mt-2 text-slate-300">{profile?.email} · verborgen beheeromgeving</p></div><button onClick={signOutUser} className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 font-semibold"><LogOut className="h-4 w-4"/>Uitloggen</button></header>
    {error && <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-red-100">{error}</div>}{message && <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-100">{message}</div>}
    <div className="mt-8 grid gap-4 sm:grid-cols-3"><Stat icon={Building2} label="Actieve groepen" value={stats.groups}/><Stat icon={Users} label="Medewerkers" value={stats.members}/><Stat icon={ShieldCheck} label="Schooladmins" value={stats.admins}/></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <Panel title="School" subtitle="De pilotomgeving die nu rechtstreeks in Firestore staat."><label className="block text-sm text-slate-300">Schoolnaam</label><div className="mt-2 flex gap-2"><input value={schoolName} onChange={(e)=>setSchoolName(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"/><button disabled={busy || !schoolName.trim()} onClick={()=>run(()=>saveSchoolName(schoolName),'Schoolnaam opgeslagen.')} className="rounded-xl bg-cyan-400 px-4 font-bold text-slate-950 disabled:opacity-50"><Save className="h-5 w-5"/></button></div></Panel>
      <Panel title="Groepen" subtitle="Aanmaken, tijdelijk uitschakelen of verwijderen."><form onSubmit={addGroup} className="flex gap-2"><input value={groupName} onChange={(e)=>setGroupName(e.target.value)} placeholder="Bijv. Groep 7A" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"/><button disabled={busy || !groupName.trim()} className="rounded-xl bg-cyan-400 px-4 font-bold text-slate-950 disabled:opacity-50"><Plus className="h-5 w-5"/></button></form><div className="mt-4 space-y-2">{data.groups.length === 0 ? <Empty text="Nog geen groepen."/> : data.groups.map((group)=><div key={group.id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3"><div className="min-w-0 flex-1"><p className="font-semibold">{group.name}</p><p className="text-xs text-slate-400">{group.id}</p></div><button onClick={()=>run(()=>updateGroup(group.id,{active:group.active===false}),'Groep bijgewerkt.')} className="rounded-lg border border-white/10 px-3 py-2 text-sm">{group.active===false?'Activeren':'Pauzeren'}</button><button onClick={()=>window.confirm(`${group.name} verwijderen?`)&&run(()=>deleteGroup(group.id),'Groep verwijderd.')} className="rounded-lg p-2 text-red-300"><Trash2 className="h-4 w-4"/></button></div>)}</div></Panel>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Panel title="Medewerkers & rollen" subtitle="Firestore-toegang voor bestaande Firebase Authentication-accounts."><div className="space-y-2">{data.members.length === 0 ? <Empty text="Nog geen medewerkers."/> : data.members.map((item)=><button key={item.id} onClick={()=>editMember(item)} className="w-full rounded-xl bg-white/5 p-4 text-left hover:bg-white/10"><div className="flex justify-between gap-3"><div><p className="font-semibold">{item.displayName || item.email || item.id}</p><p className="text-sm text-slate-400">{item.email || 'Geen e-mail opgeslagen'}</p></div><span className="text-xs font-bold uppercase text-cyan-300">{item.role}</span></div><p className="mt-2 text-xs text-slate-500">{(item.groupIds||[]).length} groep(en) gekoppeld · klik om te bewerken</p></button>)}</div></Panel>
      <Panel title={member.uid ? 'Medewerker bewerken' : 'Medewerker koppelen'} subtitle="Het Authentication-account moet eerst bestaan; hier koppel je UID, rol en groepen."><div className="space-y-3"><input value={member.uid} onChange={(e)=>setMember({...member,uid:e.target.value})} placeholder="Firebase UID" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"/><input value={member.displayName} onChange={(e)=>setMember({...member,displayName:e.target.value})} placeholder="Naam" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"/><input value={member.email} onChange={(e)=>setMember({...member,email:e.target.value})} placeholder="E-mailadres" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"/><select value={member.role} onChange={(e)=>setMember({...member,role:e.target.value})} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"><option value="teacher">Leerkracht</option><option value="schoolAdmin">Schooladmin</option></select><div><p className="mb-2 text-sm text-slate-300">Groepen</p><div className="flex flex-wrap gap-2">{data.groups.map((group)=><button type="button" key={group.id} onClick={()=>toggleGroup(group.id)} className={`rounded-full border px-3 py-1.5 text-sm ${member.groupIds.includes(group.id)?'border-cyan-300 bg-cyan-300 text-slate-950':'border-white/15 bg-white/5'}`}>{group.name}</button>)}</div></div><div className="flex gap-2 pt-2"><button disabled={busy || !member.uid.trim() || !member.displayName.trim()} onClick={()=>run(()=>saveMember(member.uid,member),'Medewerker opgeslagen.')} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 disabled:opacity-50"><Save className="h-4 w-4"/>Opslaan</button>{member.uid && <button onClick={()=>window.confirm('Deze schoolkoppeling verwijderen? Het Authentication-account blijft bestaan.')&&run(()=>deleteMember(member.uid),'Schoolkoppeling verwijderd.')} className="rounded-xl border border-red-400/30 px-4 text-red-300"><Trash2 className="h-4 w-4"/></button>}</div>{member.uid && <button onClick={()=>setMember(emptyMember)} className="text-sm text-slate-400 underline">Formulier leegmaken</button>}</div></Panel>
    </div><p className="mt-8 text-center text-xs text-slate-500">Accountwachtwoorden en Firebase Authentication worden bewust niet vanuit de browser beheerd.</p>
  </section></main>
}
function Panel({title,subtitle,children}) { return <section className="rounded-3xl border border-white/10 bg-white/5 p-6"><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 mb-5 text-sm text-slate-400">{subtitle}</p>{children}</section> }
function Stat({icon:Icon,label,value}) { return <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><Icon className="h-5 w-5 text-cyan-300"/><p className="mt-3 text-3xl font-bold">{value}</p><p className="text-sm text-slate-400">{label}</p></div> }
function Empty({text}) { return <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-500">{text}</p> }
