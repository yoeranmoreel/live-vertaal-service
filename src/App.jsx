import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import { createPageUrl } from './utils'
import './index.css'

// Pages
import Home from './pages/Home'
import TeacherAuth from './pages/TeacherAuth'
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherLive from './pages/TeacherLive'
import ParentJoin from './pages/ParentJoin'
import ParentView from './pages/ParentView'

// NEW
import ProtectedRoute from '@/components/auth/ProtectedRoute'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path={createPageUrl("Home")} element={<Home />} />
          <Route path={createPageUrl("TeacherAuth")} element={<TeacherAuth />} />

          {/* PROTECTED ROUTES */}
          <Route
            path={createPageUrl("TeacherDashboard")}
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path={createPageUrl("TeacherLive")}
            element={
              <ProtectedRoute>
                <TeacherLive />
              </ProtectedRoute>
            }
          />

          {/* Public */}
          <Route path={createPageUrl("ParentJoin")} element={<ParentJoin />} />
          <Route path={createPageUrl("ParentView")} element={<ParentView />} />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
