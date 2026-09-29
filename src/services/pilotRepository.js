import { db, firebaseConfigured } from './firebase'
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, updateDoc, doc } from 'firebase/firestore'

const DEMO_KEY = 'lvs:v3:demo-data'

const seed = {
  school: { id: 'school-demo', name: 'Basisschool De Horizon' },
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

function readDemo() {
  try {
    const stored = localStorage.getItem(DEMO_KEY)
    return stored ? JSON.parse(stored) : structuredClone(seed)
  } catch {
    return structuredClone(seed)
  }
}

function writeDemo(data) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(data))
  window.dispatchEvent(new Event('lvs-demo-change'))
}

function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
}

export async function getTeacherWorkspace() {
  if (!firebaseConfigured || !db) return readDemo()

  // Pilot Firestore path. Auth/group security rules are connected in the auth batch.
  const schoolId = 'school-demo'
  const sessionsSnap = await getDocs(query(collection(db, 'schools', schoolId, 'sessions'), orderBy('scheduledDate', 'desc')))
  return { ...seed, sessions: sessionsSnap.docs.map((item) => ({ id: item.id, ...item.data() })) }
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

  const schoolId = 'school-demo'
  const ref = await addDoc(collection(db, 'schools', schoolId, 'sessions'), { ...payload, createdAt: serverTimestamp() })
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

  const schoolId = 'school-demo'
  await updateDoc(doc(db, 'schools', schoolId, 'sessions', sessionId), { status: 'live', startedAt: serverTimestamp() })
}

export function resetDemoData() {
  localStorage.removeItem(DEMO_KEY)
  window.dispatchEvent(new Event('lvs-demo-change'))
}
