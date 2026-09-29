import { db, firebaseConfigured } from './firebase'
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'

const DEMO_KEY = 'lvs:v3:demo-data'
export const PILOT_SCHOOL_ID = 'school-demo'

const seed = {
  school: { id: PILOT_SCHOOL_ID, name: 'Basisschool De Horizon' },
  teacher: { id: 'teacher-demo', displayName: 'Melissa', role: 'teacher' },
  groups: [
    { id: 'groep-3a', name: 'Groep 3A', teacherNames: ['Melissa', 'Jolka'] },
    { id: 'groep-4', name: 'Groep 4', teacherNames: ['Melissa'] },
  ],
  sessions: [
    { id: 'welcome-3a', groupId: 'groep-3a', title: 'Kennismakingsavond', scheduledDate: '2026-09-03', scheduledStartTime: '19:00', status: 'ended', publicCode: 'K3A903', summaryEnabled: true, participantCount: 14 },
    { id: 'info-3a', groupId: 'groep-3a', title: 'Informatieavond', scheduledDate: '2026-10-08', scheduledStartTime: '19:00', status: 'planned', publicCode: 'K3A108', summaryEnabled: true, participantCount: 0 },
  ],
}

function cloneSeed() {
  return JSON.parse(JSON.stringify(seed))
}

function readDemo() {
  try {
    const stored = localStorage.getItem(DEMO_KEY)
    return stored ? JSON.parse(stored) : cloneSeed()
  } catch {
    return cloneSeed()
  }
}

function writeDemo(data) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(data))
  window.dispatchEvent(new Event('lvs-demo-change'))
}

function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 10 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
}

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

function firebaseWorkspaceError(error) {
  if (error?.code === 'permission-denied') {
    return new Error('Firebase is gekoppeld, maar deze browser heeft nog geen leerkrachttoegang. Dat zetten we in de auth-stap aan.')
  }
  return error instanceof Error ? error : new Error('De gedeelde schoolomgeving kon niet worden geladen.')
}

export function subscribeTeacherWorkspace(onData, onError = console.error) {
  if (!firebaseConfigured || !db) {
    const emit = () => onData(readDemo())
    emit()
    window.addEventListener('lvs-demo-change', emit)
    return () => window.removeEventListener('lvs-demo-change', emit)
  }

  const schoolRef = doc(db, 'schools', PILOT_SCHOOL_ID)
  const groupsRef = query(collection(db, 'schools', PILOT_SCHOOL_ID, 'groups'), orderBy('name'))
  const sessionsRef = query(collection(db, 'schools', PILOT_SCHOOL_ID, 'sessions'), orderBy('scheduledDate', 'desc'))
  const state = { school: null, groups: null, sessions: null }

  const emitWhenReady = () => {
    if (!state.school || !state.groups || !state.sessions) return
    onData({
      school: state.school,
      teacher: seed.teacher,
      groups: state.groups,
      sessions: state.sessions,
    })
  }

  const fail = (error) => onError(firebaseWorkspaceError(error))
  const unsubscribers = [
    onSnapshot(schoolRef, (snapshot) => {
      state.school = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : { id: PILOT_SCHOOL_ID, name: 'Pilot-school' }
      emitWhenReady()
    }, fail),
    onSnapshot(groupsRef, (snapshot) => {
      state.groups = mapSnapshot(snapshot)
      emitWhenReady()
    }, fail),
    onSnapshot(sessionsRef, (snapshot) => {
      state.sessions = mapSnapshot(snapshot)
      emitWhenReady()
    }, fail),
  ]

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe())
}

export async function createPlannedSession(input) {
  const payload = {
    ...input,
    publicCode: makeCode(),
    status: 'planned',
    participantCount: 0,
    createdAt: new Date().toISOString(),
  }

  if (!firebaseConfigured || !db) {
    const data = readDemo()
    const session = { id: crypto.randomUUID(), ...payload }
    data.sessions.push(session)
    writeDemo(data)
    return session
  }

  const ref = await addDoc(collection(db, 'schools', PILOT_SCHOOL_ID, 'sessions'), {
    ...payload,
    createdAt: serverTimestamp(),
  })
  return { id: ref.id, ...payload }
}

export async function startSession(sessionId) {
  if (!firebaseConfigured || !db) {
    const data = readDemo()
    const session = data.sessions.find((item) => item.id === sessionId)
    if (!session) throw new Error('Sessie niet gevonden')
    session.status = 'live'
    session.startedAt = new Date().toISOString()
    writeDemo(data)
    return session
  }

  await updateDoc(doc(db, 'schools', PILOT_SCHOOL_ID, 'sessions', sessionId), {
    status: 'live',
    startedAt: serverTimestamp(),
  })
}

export function resetDemoData() {
  localStorage.removeItem(DEMO_KEY)
  window.dispatchEvent(new Event('lvs-demo-change'))
}
