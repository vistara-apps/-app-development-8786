import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Scissors,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'
import { useSalon } from '../contexts/SalonContext'

const AppShell = ({ children }) => {
  const location = useLocation()
  const { salon } = useSalon()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768 && sidebarOpen) {
        setSidebarOpen(false)
      } else if (window.innerWidth >= 1024 && !sidebarOpen) {
        setSidebarOpen(true)
      }
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [sidebarOpen])

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Campaigns', href: '/campaigns', icon: MessageSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-bg">
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
        } fixed md:static z-30 h-full bg-surface border-r border-gray-200 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-16'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Scissors className="h-8 w-8 text-primary flex-shrink-0" />
              {sidebarOpen && (
                <div className="ml-3 overflow-hidden">
                  <h1 className="text-xl font-bold text-primary truncate">Salon Recovery</h1>
                  {salon && <p className="text-sm text-muted truncate">{salon.name}</p>}
                </div>
              )}
            </div>
            {isMobile && sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-text hover:bg-gray-100'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <span className="ml-3 truncate">{item.name}</span>
                      )}
                      {isActive && !sidebarOpen && (
                        <span className="absolute left-0 inset-y-0 w-1 bg-primary rounded-r-md" aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="bg-surface border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <span className="text-sm text-muted">Welcome back!</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {salon?.name?.charAt(0) || 'S'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Page title breadcrumb */}
            <div className="mb-2 text-sm text-muted flex items-center">
              <span className="capitalize">{location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1)}</span>
              <ChevronRight className="h-3 w-3 mx-1" />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppShell
