import { db, firebaseConfigured } from './firebase'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
const DEMO_KEY='lvs:v3:demo-data'
export const PILOT_SCHOOL_ID='school-demo'
const seed={school:{id:PILOT_SCHOOL_ID,name:'Basisschool De Horizon'},teacher:{id:'teacher-demo',displayName:'Melissa',role:'teacher'},groups:[{id:'groep-3a',name:'Groep 3A',teacherNames:['Melissa','Jolka']},{id:'groep-4',name:'Groep 4',teacherNames:['Melissa']}],sessions:[{id:'welcome-3a',groupId:'groep-3a',title:'Kennismakingsavond',scheduledDate:'2026-09-03',scheduledStartTime:'19:00',status:'ended',publicCode:'K3A903',summaryEnabled:true,participantCount:14},{id:'info-3a',groupId:'groep-3a',title:'Informatieavond',scheduledDate:'2026-10-08',scheduledStartTime:'19:00',status:'planned',publicCode:'K3A108',summaryEnabled:true,participantCount:0}]}
const cloneSeed=()=>JSON.parse(JSON.stringify(seed))
function readDemo(){try{const stored=localStorage.getItem(DEMO_KEY);return stored?JSON.parse(stored):cloneSeed()}catch{return cloneSeed()}}
function writeDemo(data){localStorage.setItem(DEMO_KEY,JSON.stringify(data));window.dispatchEvent(new Event('lvs-demo-change'))}
function makeCode(){const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return Array.from({length:10},()=>alphabet[Math.floor(Math.random()*alphabet.length)]).join('')}
const mapSnapshot=snapshot=>snapshot.docs.map(item=>({id:item.id,...item.data()}))
function firebaseWorkspaceError(error){if(error?.code==='permission-denied')return new Error('Je account heeft geen toegang tot deze schoolomgeving.');return error instanceof Error?error:new Error('De gedeelde schoolomgeving kon niet worden geladen.')}
export function subscribeTeacherWorkspace(onData,onError=console.error){
 if(!firebaseConfigured||!db){const emit=()=>onData(readDemo());emit();window.addEventListener('lvs-demo-change',emit);return()=>window.removeEventListener('lvs-demo-change',emit)}
 const schoolRef=doc(db,'schools',PILOT_SCHOOL_ID),groupsRef=query(collection(db,'schools',PILOT_SCHOOL_ID,'groups'),orderBy('name')),sessionsRef=query(collection(db,'schools',PILOT_SCHOOL_ID,'sessions'),orderBy('scheduledDate','desc')),state={school:null,groups:null,sessions:null}
 const emit=()=>{if(state.school&&state.groups&&state.sessions)onData({school:state.school,groups:state.groups,sessions:state.sessions})},fail=error=>onError(firebaseWorkspaceError(error))
 const unsub=[onSnapshot(schoolRef,s=>{state.school=s.exists()?{id:s.id,...s.data()}:{id:PILOT_SCHOOL_ID,name:'Pilot-school'};emit()},fail),onSnapshot(groupsRef,s=>{state.groups=mapSnapshot(s);emit()},fail),onSnapshot(sessionsRef,s=>{state.sessions=mapSnapshot(s);emit()},fail)]
 return()=>unsub.forEach(fn=>fn())
}
export async function createPlannedSession(input){const payload={...input,publicCode:makeCode(),status:'planned',participantCount:0,createdAt:new Date().toISOString()};if(!firebaseConfigured||!db){const data=readDemo(),session={id:crypto.randomUUID(),...payload};data.sessions.push(session);writeDemo(data);return session}const ref=await addDoc(collection(db,'schools',PILOT_SCHOOL_ID,'sessions'),{...payload,createdAt:serverTimestamp()});return{id:ref.id,...payload}}
export async function startSession(sessionId){if(!firebaseConfigured||!db){const data=readDemo(),session=data.sessions.find(item=>item.id===sessionId);if(!session)throw new Error('Sessie niet gevonden');session.status='live';session.startedAt=new Date().toISOString();writeDemo(data);return session}await updateDoc(doc(db,'schools',PILOT_SCHOOL_ID,'sessions',sessionId),{status:'live',startedAt:serverTimestamp()})}
export function resetDemoData(){localStorage.removeItem(DEMO_KEY);window.dispatchEvent(new Event('lvs-demo-change'))}
