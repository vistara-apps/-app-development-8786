import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Campaigns from './pages/Campaigns'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Onboarding from './pages/Onboarding'
import Messaging from './pages/Messaging'
import { SalonProvider } from './contexts/SalonContext'

function App() {
  return (
    <SalonProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </AppShell>
    </SalonProvider>
  )
}

export default App
