import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { loading, user, profile } = useAuth()
  const location = useLocation()

  if (loading) return <div className="min-h-screen grid place-items-center text-indigo-600">Toegang controleren…</div>
  if (!user) return <Navigate to="/teacher/login" replace state={{ from: location.pathname }} />
  if (!profile?.role || (roles && !roles.includes(profile.role))) return <Navigate to="/teacher/no-access" replace />
  return children
}
