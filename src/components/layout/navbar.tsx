'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/helpers'
import { Menu, LogOut, User, Package, Truck, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  role: 'cliente' | 'motoboy' | 'gerente' | 'public'
  userName?: string
  userImage?: string
  onLogout?: () => void
  onMenuClick?: () => void
}

const publicNav = [
  { name: 'Início', href: '/' },
  { name: 'Cliente', href: '/login/cliente' },
  { name: 'Motoboy', href: '/login/motoboy' },
  { name: 'Gerente', href: '/login/gerente' },
]

export function Navbar({ role, userName, userImage, onLogout, onMenuClick }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (role === 'public') {
    return (
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4" aria-label="Main navigation">
          <Link href="/" className="font-bold text-xl text-primary">
            SpeedLog
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            {publicNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t py-4 px-4">
            <div className="flex flex-col gap-4">
              {publicNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    )
  }

  // Authenticated navbar
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:ml-64">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3" aria-label="User navigation">
        <button
          className="lg:hidden p-2"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex-1 flex items-center justify-between">
          <Link
            href={role === 'cliente' ? '/cliente' : role === 'motoboy' ? '/motoboy' : '/admin'}
            className="font-bold text-xl text-primary"
          >
            SpeedLog
          </Link>

          <div className="flex items-center gap-4">
            {/* User menu */}
            <div className="relative group">
              <button className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {userImage ? (
                    <img src={userImage} alt={userName} className="h-8 w-8 object-cover" />
                  ) : (
                    <span className="text-primary font-medium">{userName?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium">{userName}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-popover p-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="px-3 py-2 text-xs text-muted-foreground border-b">
                  {role === 'cliente' && 'Cliente'}
                  {role === 'motoboy' && 'Motoboy'}
                  {role === 'gerente' && 'Gerente'}
                </div>
                <Link
                  href={role === 'cliente' ? '/cliente/perfil' : role === 'motoboy' ? '/motoboy/perfil' : '/admin'}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Perfil
                </Link>
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-accent rounded"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}