import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Scissors,
  Menu
} from 'lucide-react'
import { useSalon } from '../contexts/SalonContext'

const AppShell = ({ children }) => {
  const location = useLocation()
  const { salon } = useSalon()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Campaigns', href: '/campaigns', icon: MessageSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-bg">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-surface border-r border-gray-200 transition-all duration-200`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-gray-200">
            <Scissors className="h-8 w-8 text-primary" />
            {sidebarOpen && (
              <div className="ml-3">
                <h1 className="text-xl font-bold text-primary">Salon Recovery</h1>
                {salon && <p className="text-sm text-muted">{salon.name}</p>}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-surface border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted">Welcome back!</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppShell