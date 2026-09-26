'use client'

import { ReactNode, useState } from 'react'
import { Sidebar } from './sidebar'
import { Navbar } from './navbar'

interface DashboardLayoutProps {
  children: ReactNode
  role: 'cliente' | 'motoboy' | 'gerente'
  userName: string
  userEmail: string
  userImage?: string
  onLogout: () => void
}

export function DashboardLayout({ children, role, userName, userEmail, userImage, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        role={role}
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
        onLogout={onLogout}
        className={sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      />

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        <Navbar
          role={role}
          userName={userName}
          userImage={userImage}
          onLogout={onLogout}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="p-4 lg:p-6" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}