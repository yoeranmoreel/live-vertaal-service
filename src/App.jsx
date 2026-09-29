import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PilotHome from './pages/PilotHome'
import ParentJoinV3 from './pages/ParentJoinV3'
import TeacherWorkspace from './pages/TeacherWorkspace'
import TeacherSession from './pages/TeacherSession'
import TeacherLogin from './pages/TeacherLogin'
import NoAccess from './pages/NoAccess'
import PlatformAdmin from './pages/PlatformAdmin'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import './index.css'

export default function App() {
  return <BrowserRouter><AuthProvider><Routes>
    <Route path="/" element={<PilotHome />} />
    <Route path="/teacher/login" element={<TeacherLogin />} />
    <Route path="/teacher/no-access" element={<NoAccess />} />
    <Route path="/teacher" element={<ProtectedRoute roles={['teacher','schoolAdmin','platformAdmin']}><TeacherWorkspace /></ProtectedRoute>} />
    <Route path="/teacher/session/:sessionId" element={<ProtectedRoute roles={['teacher','schoolAdmin','platformAdmin']}><TeacherSession /></ProtectedRoute>} />
    <Route path="/platform-beheer-portal" element={<ProtectedRoute roles={['platformAdmin']}><PlatformAdmin /></ProtectedRoute>} />
    <Route path="/join/:publicCode" element={<ParentJoinV3 />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></AuthProvider></BrowserRouter>
}
