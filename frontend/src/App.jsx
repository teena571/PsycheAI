import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import Dashboard from './pages/Dashboard'
import MoodJournal from './pages/MoodJournal'
import StressTracker from './pages/StressTracker'
import BreathingTool from './pages/BreathingTool'
import MoodSupport from './pages/MoodSupport'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/mood-journal" element={<MoodJournal />} />
          <Route path="/stress-tracker" element={<StressTracker />} />
          <Route path="/breathing-tool" element={<BreathingTool />} />
          <Route path="/mood-support" element={<MoodSupport />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
