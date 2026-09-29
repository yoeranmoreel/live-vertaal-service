import { createContext, useContext, useEffect, useState } from 'react'
import { observeAuth } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, setState] = useState({ loading: true, user: null, profile: null, error: null })
  useEffect(() => observeAuth((next) => setState({ error: null, ...next })), [])
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
