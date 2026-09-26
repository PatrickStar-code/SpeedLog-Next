'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Truck, Package, Users, TrendingUp } from 'lucide-react'

export default function ClienteHomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <DashboardLayout
        role="cliente"
        userName="Carregando..."
        userEmail=""
        onLogout={() => {}}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login/cliente')
    return null
  }

  const user = session?.user

  const handleLogout = () => {
    signOut({ callbackUrl: '/login/cliente' })
  }

  return (
    <DashboardLayout
            role="cliente"
            userName={user?.name || 'Cliente'}
            userEmail={user?.email || ''}
            userImage={user?.image || undefined}
            onLogout={handleLogout}
          >
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo, {user?.name?.split(' ')[0] || 'Cliente'}!</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas entregas de forma simples e eficiente</p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Minhas Entregas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Acompanhe o status de todas as suas entregas</p>
              <Link href="/cliente/encomendas">
                <Button className="w-full">Ver Entregas</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Nova Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Crie uma nova solicitação de entrega</p>
              <Link href="/cliente/nova-entrega">
                <Button className="w-full">Criar Entrega</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Meu Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Gerencie seus dados pessoais</p>
              <Link href="/cliente/perfil">
                <Button variant="outline" className="w-full">Editar Perfil</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Veja o resumo das suas entregas</p>
              <Button variant="outline" className="w-full" disabled>Em breve</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Deliveries Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Entregas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma entrega recente</p>
              <Link href="/cliente/nova-entrega" className="text-primary hover:underline mt-2 inline-block">
                Criar sua primeira entrega
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}