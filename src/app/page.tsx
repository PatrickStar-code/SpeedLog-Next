import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Package, Users, ShieldCheck, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              SpeedLog
              <span className="text-primary">.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Sistema completo de gerenciamento de entregas e logística.
              Conectamos clientes, motoboys e gerentes em uma plataforma única.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/login/cliente">
                <Button size="lg" className="gap-2">
                  Entrar como Cliente
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login/motoboy">
                <Button size="lg" variant="outline" className="gap-2">
                  Entrar como Motoboy
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Entregas realizadas</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Motoboys ativos</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Clientes satisfeitos</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Suporte disponível</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Funcionalidades para cada perfil
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Três áreas integradas com funcionalidades específicas
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Área do Cliente</CardTitle>
                <CardDescription>
                  Cadastro, criação de entregas, acompanhamento de status e histórico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><Package className="h-4 w-4" /> Nova entrega com cálculo automático de frete</li>
                  <li className="flex items-center gap-2"><Package className="h-4 w-4" /> Acompanhamento em tempo real</li>
                  <li className="flex items-center gap-2"><Package className="h-4 w-4" /> Histórico completo de entregas</li>
                  <li className="flex items-center gap-2"><Package className="h-4 w-4" /> Perfil e recuperação de senha</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Área do Motoboy</CardTitle>
                <CardDescription>
                  Aceitar entregas, iniciar transporte, finalizar com assinatura e ver ganhos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><Truck className="h-4 w-4" /> Visualizar entregas disponíveis</li>
                  <li className="flex items-center gap-2"><Truck className="h-4 w-4" /> Aceitar/recusar entregas</li>
                  <li className="flex items-center gap-2"><Truck className="h-4 w-4" /> Iniciar transporte com timer</li>
                  <li className="flex items-center gap-2"><Truck className="h-4 w-4" /> Finalizar com assinatura digital</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Área do Gerente</CardTitle>
                <CardDescription>
                  Dashboard completo, gestão de usuários, aprovação de CNHs e relatórios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Dashboard com métricas e gráficos</li>
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Gestão de clientes e motoboys</li>
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Aprovação/rejeição de CNHs</li>
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Configuração de tabelas de preço</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pronto para começar?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Cadastre-se agora e simplifique sua logística de entregas
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/login/cliente">
              <Button size="lg" className="gap-2">
                Cadastro Cliente
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login/motoboy">
              <Button size="lg" variant="outline" className="gap-2">
                Cadastro Motoboy
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 SpeedLog. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacidade</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Termos</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}