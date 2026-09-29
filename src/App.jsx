import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PilotHome from './pages/PilotHome'
import ParentJoinV3 from './pages/ParentJoinV3'
import TeacherWorkspace from './pages/TeacherWorkspace'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PilotHome />} />
        <Route path="/teacher" element={<TeacherWorkspace />} />
        <Route path="/join/:publicCode" element={<ParentJoinV3 />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
