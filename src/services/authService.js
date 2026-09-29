import { auth, db, firebaseConfigured } from './firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { PILOT_SCHOOL_ID } from './pilotRepository'

export async function signInTeacher(email, password) {
  if (!firebaseConfigured || !auth) throw new Error('Firebase Authentication is niet geconfigureerd.')
  return signInWithEmailAndPassword(auth, email.trim(), password)
}

export function signOutUser() {
  return auth ? signOut(auth) : Promise.resolve()
}

export async function loadAccessProfile(user) {
  if (!user || !db) return null

  const [platformSnap, memberSnap] = await Promise.all([
    getDoc(doc(db, 'platformAdmins', user.uid)),
    getDoc(doc(db, 'schools', PILOT_SCHOOL_ID, 'members', user.uid)),
  ])

  const member = memberSnap.exists() ? memberSnap.data() : null
  return {
    uid: user.uid,
    email: user.email,
    displayName: member?.displayName || user.displayName || user.email?.split('@')[0] || 'Gebruiker',
    schoolId: member ? PILOT_SCHOOL_ID : null,
    role: platformSnap.exists() ? 'platformAdmin' : member?.role || null,
    groupIds: member?.groupIds || [],
    isPlatformAdmin: platformSnap.exists(),
  }
}

export function observeAuth(callback) {
  if (!auth) {
    callback({ loading: false, user: null, profile: null })
    return () => {}
  }

  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback({ loading: false, user: null, profile: null })
      return
    }
    try {
      callback({ loading: true, user, profile: null })
      const profile = await loadAccessProfile(user)
      callback({ loading: false, user, profile })
    } catch (error) {
      callback({ loading: false, user, profile: null, error })
    }
  })
}
