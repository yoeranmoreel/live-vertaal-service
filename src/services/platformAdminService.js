import { db } from './firebase'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'

export const PILOT_SCHOOL_ID = 'school-demo'
const slugify = (value) => value.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function subscribePlatformAdmin(onData, onError) {
  const state = { school: null, groups: [], members: [] }
  const emit = () => onData({ ...state })
  const schoolRef = doc(db, 'schools', PILOT_SCHOOL_ID)
  const unsubs = [
    onSnapshot(schoolRef, (snap) => { state.school = snap.exists() ? { id: snap.id, ...snap.data() } : null; emit() }, onError),
    onSnapshot(query(collection(schoolRef, 'groups'), orderBy('name')), (snap) => { state.groups = snap.docs.map((item) => ({ id: item.id, ...item.data() })); emit() }, onError),
    onSnapshot(collection(schoolRef, 'members'), (snap) => { state.members = snap.docs.map((item) => ({ id: item.id, ...item.data() })).sort((a,b) => (a.displayName || a.email || '').localeCompare(b.displayName || b.email || '', 'nl')); emit() }, onError),
  ]
  return () => unsubs.forEach((unsubscribe) => unsubscribe())
}

export async function saveSchoolName(name) {
  await setDoc(doc(db, 'schools', PILOT_SCHOOL_ID), { name: name.trim(), updatedAt: serverTimestamp() }, { merge: true })
}

export async function createGroup(name) {
  const cleanName = name.trim()
  if (!cleanName) throw new Error('Vul een groepsnaam in.')
  const id = slugify(cleanName) || ('groep-' + Date.now())
  await setDoc(doc(db, 'schools', PILOT_SCHOOL_ID, 'groups', id), { name: cleanName, active: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
}

export async function updateGroup(groupId, data) {
  await updateDoc(doc(db, 'schools', PILOT_SCHOOL_ID, 'groups', groupId), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteGroup(groupId) {
  await deleteDoc(doc(db, 'schools', PILOT_SCHOOL_ID, 'groups', groupId))
}

export async function saveMember(uid, data) {
  const cleanUid = uid.trim()
  if (!cleanUid) throw new Error('Firebase UID ontbreekt.')
  await setDoc(doc(db, 'schools', PILOT_SCHOOL_ID, 'members', cleanUid), {
    displayName: data.displayName.trim(),
    email: data.email.trim().toLowerCase(),
    role: data.role,
    groupIds: data.groupIds || [],
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export async function deleteMember(uid) {
  await deleteDoc(doc(db, 'schools', PILOT_SCHOOL_ID, 'members', uid))
}
