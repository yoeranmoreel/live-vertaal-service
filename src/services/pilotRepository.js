import { db, firebaseConfigured } from './firebase'
import { addDoc, collection, doc, getDoc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
const DEMO_KEY='lvs:v3:demo-data'
export const PILOT_SCHOOL_ID='school-demo'
const seed={school:{id:PILOT_SCHOOL_ID,name:'Basisschool De Horizon'},teacher:{id:'teacher-demo',displayName:'Melissa',role:'teacher'},groups:[],sessions:[]}
const cloneSeed=()=>JSON.parse(JSON.stringify(seed))
function readDemo(){try{const stored=localStorage.getItem(DEMO_KEY);return stored?JSON.parse(stored):cloneSeed()}catch{return cloneSeed()}}
function writeDemo(data){localStorage.setItem(DEMO_KEY,JSON.stringify(data));window.dispatchEvent(new Event('lvs-demo-change'))}
function makeCode(){
 const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
 const bytes=new Uint8Array(16)
 crypto.getRandomValues(bytes)
 return Array.from(bytes,byte=>alphabet[byte%alphabet.length]).join('')
}
const mapSnapshot=snapshot=>snapshot.docs.map(item=>({id:item.id,...item.data()}))
function firebaseWorkspaceError(error){if(error?.code==='permission-denied')return new Error('Je account heeft geen toegang tot deze schoolomgeving.');return error instanceof Error?error:new Error('De gedeelde schoolomgeving kon niet worden geladen.')}
export function subscribeTeacherWorkspace(onData,onError=console.error){
 if(!firebaseConfigured||!db){const emit=()=>onData(readDemo());emit();window.addEventListener('lvs-demo-change',emit);return()=>window.removeEventListener('lvs-demo-change',emit)}
 const schoolRef=doc(db,'schools',PILOT_SCHOOL_ID),groupsRef=query(collection(db,'schools',PILOT_SCHOOL_ID,'groups'),orderBy('name')),sessionsRef=query(collection(db,'schools',PILOT_SCHOOL_ID,'sessions'),orderBy('scheduledDate','desc')),state={school:null,groups:null,sessions:null}
 const emit=()=>{if(state.school&&state.groups&&state.sessions)onData({school:state.school,groups:state.groups,sessions:state.sessions})},fail=error=>onError(firebaseWorkspaceError(error))
 const unsub=[onSnapshot(schoolRef,s=>{state.school=s.exists()?{id:s.id,...s.data()}:{id:PILOT_SCHOOL_ID,name:'Pilot-school'};emit()},fail),onSnapshot(groupsRef,s=>{state.groups=mapSnapshot(s);emit()},fail),onSnapshot(sessionsRef,s=>{state.sessions=mapSnapshot(s);emit()},fail)]
 return()=>unsub.forEach(fn=>fn())
}
export async function createPlannedSession(input){
 const publicCode=makeCode(),payload={...input,publicCode,status:'planned',participantCount:0,createdAt:new Date().toISOString()}
 if(!firebaseConfigured||!db){const data=readDemo(),session={id:crypto.randomUUID(),...payload};data.sessions.push(session);writeDemo(data);return session}
 const sessionRef=doc(collection(db,'schools',PILOT_SCHOOL_ID,'sessions'))
 const publicRef=doc(db,'publicSessions',publicCode)
 const batch=writeBatch(db)
 batch.set(sessionRef,{...payload,createdAt:serverTimestamp()})
 batch.set(publicRef,{sessionId:sessionRef.id,schoolId:PILOT_SCHOOL_ID,groupId:input.groupId,title:input.title,scheduledDate:input.scheduledDate,scheduledStartTime:input.scheduledStartTime,status:'planned',createdAt:serverTimestamp()})
 await batch.commit()
 return{id:sessionRef.id,...payload}
}
export async function startSession(sessionId){
 if(!firebaseConfigured||!db){const data=readDemo(),session=data.sessions.find(item=>item.id===sessionId);if(!session)throw new Error('Sessie niet gevonden');session.status='live';session.startedAt=new Date().toISOString();writeDemo(data);return session}
 const sessionRef=doc(db,'schools',PILOT_SCHOOL_ID,'sessions',sessionId)
 const sessionSnap = await getDoc(sessionRef)
 if(!sessionSnap.exists()) throw new Error('Sessie niet gevonden')
 const publicCode=sessionSnap.data().publicCode
 if(!publicCode) throw new Error('Deze sessie heeft geen publieke sessiecode.')
 const publicRef=doc(db,'publicSessions',publicCode)
 const publicSnap=await getDoc(publicRef)
 if(!publicSnap.exists()) throw new Error('Publieke sessie niet gevonden.')
 const startedAt=serverTimestamp()
 await updateDoc(publicRef,{status:'live',startedAt})
 await updateDoc(sessionRef,{status:'live',startedAt})
}
export async function endSession(sessionId){
 if(!firebaseConfigured||!db){const data=readDemo(),session=data.sessions.find(item=>item.id===sessionId);if(!session)throw new Error('Sessie niet gevonden');session.status='ended';session.endedAt=new Date().toISOString();writeDemo(data);return session}
 const sessionRef=doc(db,'schools',PILOT_SCHOOL_ID,'sessions',sessionId)
 const sessionSnap=await getDoc(sessionRef)
 if(!sessionSnap.exists()) throw new Error('Sessie niet gevonden')
 const publicCode=sessionSnap.data().publicCode
 const endedAt=serverTimestamp()
 if(publicCode){
  const publicRef=doc(db,'publicSessions',publicCode)
  const publicSnap=await getDoc(publicRef)
  if(publicSnap.exists()) await updateDoc(publicRef,{status:'ended',endedAt})
 }
 await updateDoc(sessionRef,{status:'ended',endedAt})
}
export function subscribePublicSession(publicCode,onData,onError=console.error){
 if(!firebaseConfigured||!db){onError(new Error('Firebase is niet verbonden.'));return()=>{}}
 return onSnapshot(doc(db,'publicSessions',publicCode),s=>onData(s.exists()?{id:s.id,...s.data()}:null),onError)
}
export async function joinPublicSession(publicCode,participantId,languageCode){
 // Parents are intentionally not allowed to read participant documents.
 // A merge write works for both first join and returning visitors under the public presence rules.
 await setDoc(doc(db,'publicSessions',publicCode,'participants',participantId),{
  participantId,
  languageCode,
  lastSeenAt:serverTimestamp()
 },{merge:true})
}
export async function syncPublicSessionStatus(session){
 if(!firebaseConfigured||!db||!session?.publicCode||!session?.status)return
 const publicRef=doc(db,'publicSessions',session.publicCode)
 const publicSnap=await getDoc(publicRef)
 if(!publicSnap.exists())return
 if(publicSnap.data().status!==session.status){
  await updateDoc(publicRef,{status:session.status})
 }
}
export async function touchPresence(publicCode,participantId,languageCode){
 await setDoc(doc(db,'publicSessions',publicCode,'participants',participantId),{participantId,languageCode,lastSeenAt:serverTimestamp()},{merge:true})
}
export function subscribeSessionParticipants(publicCode,onData,onError=console.error){
 if(!publicCode||!db)return()=>{}
 return onSnapshot(collection(db,'publicSessions',publicCode,'participants'),s=>onData(mapSnapshot(s)),onError)
}
export async function publishPilotMessage(publicCode,texts,meta={}){
 if(!firebaseConfigured||!db)throw new Error('Firebase is niet verbonden.')
 const clean=Object.fromEntries(Object.entries(texts||{}).filter(([,value])=>typeof value==='string'&&value.trim()).map(([code,value])=>[code,value.trim()]))
 if(!clean.nl)throw new Error('Voer minimaal de Nederlandse tekst in.')
 await addDoc(collection(db,'publicSessions',publicCode,'messages'),{texts:clean,sourceLanguage:'nl',mode:meta.mode||'demo',createdAt:serverTimestamp()})
}
export async function appendTranscriptSegment(sessionId,text){
 if(!firebaseConfigured||!db)throw new Error('Firebase is niet verbonden.')
 const sourceText=text?.trim()
 if(!sourceText)return
 await addDoc(collection(db,'schools',PILOT_SCHOOL_ID,'sessions',sessionId,'transcript'),{sourceText,sourceLanguage:'nl',createdAt:serverTimestamp()})
}
export function subscribeSessionTranscript(sessionId,onData,onError=console.error){
 if(!firebaseConfigured||!db||!sessionId)return()=>{}
 const transcript=query(collection(db,'schools',PILOT_SCHOOL_ID,'sessions',sessionId,'transcript'),orderBy('createdAt','asc'),limit(200))
 return onSnapshot(transcript,s=>onData(mapSnapshot(s)),onError)
}
export function subscribePublicMessages(publicCode,onData,onError=console.error){
 if(!firebaseConfigured||!db)return()=>{}
 const messages=query(collection(db,'publicSessions',publicCode,'messages'),orderBy('createdAt','desc'),limit(30))
 return onSnapshot(messages,s=>onData(mapSnapshot(s).reverse()),onError)
}
export function resetDemoData(){localStorage.removeItem(DEMO_KEY);window.dispatchEvent(new Event('lvs-demo-change'))}
