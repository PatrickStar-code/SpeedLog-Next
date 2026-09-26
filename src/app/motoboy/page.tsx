'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Truck, Package, MapPin, Clock, Loader2, CheckCircle, XCircle, Truck as TruckIcon } from 'lucide-react'
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils/helpers'

export default function MotoboyHomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <DashboardLayout
        role="motoboy"
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
    router.push('/login/motoboy')
    return null
  }

  const user = session?.user

  const handleLogout = () => {
    signOut({ callbackUrl: '/login/motoboy' })
  }

  return (
    <DashboardLayout
      role="motoboy"
      userName={user?.name || 'Motoboy'}
      userEmail={user?.email || ''}
      userImage={user?.image || undefined}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Painel do Motoboy</h1>
          <p className="text-muted-foreground">Bem-vindo, {user?.name?.split(' ')[0] || 'Motoboy'}!</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/motoboy/entregas">
                <Button className="w-full">Ver Entregas</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TruckIcon className="h-5 w-5 text-primary" />
                Em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/motoboy/aceitos">
                <Button className="w-full">Minhas Entregas</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Finalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/motoboy/finalizadas">
                <Button className="w-full">Ver Histórico</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Ganhos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/motoboy/ganhos">
                <Button className="w-full">Ver Ganhos</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entregas em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <TruckIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma entrega em andamento</p>
              <Link href="/motoboy/entregas" className="text-primary hover:underline mt-2 inline-block">
                Ver entregas disponíveis
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}