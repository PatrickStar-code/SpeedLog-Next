'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/helpers'
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Truck,
  User,
  Settings,
  LogOut,
  ClipboardList,
  CreditCard,
  ShieldCheck,
  BarChart3,
} from 'lucide-react'

interface SidebarProps {
  role: 'cliente' | 'motoboy' | 'gerente'
  userName: string
  userEmail: string
  userImage?: string
  onLogout: () => void
  className?: string
}

const navigation = {
  cliente: [
    { name: 'Início', href: '/cliente', icon: LayoutDashboard },
    { name: 'Minhas Entregas', href: '/cliente/encomendas', icon: Package },
    { name: 'Nova Entrega', href: '/cliente/nova-entrega', icon: Truck },
    { name: 'Perfil', href: '/cliente/perfil', icon: User },
  ],
  motoboy: [
    { name: 'Início', href: '/motoboy', icon: LayoutDashboard },
    { name: 'Entregas Disponíveis', href: '/motoboy/entregas', icon: Package },
    { name: 'Minhas Entregas', href: '/motoboy/aceitos', icon: Truck },
    { name: 'Finalizadas', href: '/motoboy/finalizadas', icon: ClipboardList },
    { name: 'Perfil', href: '/motoboy/perfil', icon: User },
    { name: 'Ganhos', href: '/motoboy/ganhos', icon: CreditCard },
  ],
  gerente: [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Clientes', href: '/admin/clientes', icon: Users },
    { name: 'Motoboys', href: '/admin/motoboys', icon: Truck },
    { name: 'Entregas', href: '/admin/entregas', icon: Package },
    { name: 'CNHs Pendentes', href: '/admin/cnh', icon: ShieldCheck },
    { name: 'CNHs Negadas', href: '/admin/cnh/negadas', icon: FileText },
    { name: 'Tabelas de Preço', href: '/admin/precos', icon: Settings },
  ],
}

export function Sidebar({ role, userName, userEmail, userImage, onLogout, className }: SidebarProps) {
  const pathname = usePathname()
  const items = navigation[role]

  return (
    <aside className={cn("fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform lg:translate-x-0", className)}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href={role === 'cliente' ? '/cliente' : role === 'motoboy' ? '/motoboy' : '/admin'} className="font-bold text-xl text-primary">
            SpeedLog
          </Link>
        </div>

        {/* User Info */}
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              {userImage ? (
                <img src={userImage} alt={userName} className="h-10 w-10 rounded-full" />
              ) : (
                <span className="text-primary font-medium">{userName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary capitalize">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" role="navigation" aria-label="Main navigation">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="border-t p-4">
          <button
            onClick={onLogout}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground',
              'hover:bg-accent hover:text-accent-foreground transition-colors'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  )
}