import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import {
  Zap,
  Timer,
  PackageCheck,
  Check,
  ArrowRight,
  BarChart3,
  PenTool,
  MapPin,
  LayoutDashboard,
} from "lucide-react";

const stats = [
  { value: "500+", label: "Entregas realizadas" },
  { value: "100+", label: "Motoboys ativos" },
  { value: "50+", label: "Clientes satisfeitos" },
  { value: "24/7", label: "Suporte disponível" },
];

const vantagens = [
  {
    image: "/imgs/rapido_atendimento.png",
    title: "Atendimento ágil",
    description:
      "Pedidos processados em minutos e suporte pronto para ajudar a qualquer hora.",
  },
  {
    image: "/imgs/pronto_entrega.png",
    title: "Entrega expressa",
    description:
      "Frete e tempo calculados automaticamente, do pedido até a confirmação final.",
  },
  {
    image: "/imgs/privacidade.png",
    title: "Privacidade primeiro",
    description:
      "Autenticação segura e dados protegidos em todas as etapas da entrega.",
  },
  {
    image: "/imgs/Send gift-pana.png",
    title: "Para todas as ocasiões",
    description:
      "Presentes, documentos ou compras: o SpeedLog entrega com o mesmo cuidado.",
  },
];

const perfis = [
  {
    image: "/imgs/Cliente.png",
    alt: "Cliente SpeedLog recebendo uma entrega",
    title: "Área do Cliente",
    href: "/login/cliente",
    items: [
      "Nova entrega com cálculo automático de frete",
      "Acompanhamento em tempo real",
      "Histórico completo de entregas",
    ],
  },
  {
    image: "/imgs/motoboy.png",
    alt: "Motoboy SpeedLog em entrega",
    title: "Área do Motoboy",
    href: "/login/motoboy",
    items: [
      "Entregas disponíveis para aceitar ou recusar",
      "Transporte com timer e rota",
      "Finalização com assinatura digital e ganhos",
    ],
  },
  {
    image: "/imgs/adm.png",
    alt: "Gerente SpeedLog no dashboard",
    title: "Área do Gerente",
    href: "/login/gerente",
    items: [
      "Dashboard com métricas e gráficos",
      "Gestão de clientes, motoboys e CNHs",
      "Configuração de tabelas de preço",
    ],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar role="public" />

      {/* Hero — dark teal da marca */}
      <section className="relative overflow-hidden bg-night">
        {/* Brilhos decorativos */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-teal-bright/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-teal-bright ring-1 ring-white/15">
                <Zap className="h-4 w-4" aria-hidden="true" />
                Logística expressa para a sua cidade
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Entregas <span className="text-teal-bright">rápidas</span>, do
                jeito que o seu negócio precisa
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
                O SpeedLog conecta clientes, motoboys e gerentes em uma única
                plataforma: frete calculado automaticamente, acompanhamento em
                tempo real e finalização com assinatura digital.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/cadastro/cliente">
                  <Button size="lg" className="gap-2">
                    Criar conta como cliente
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/cadastro/motoboy">
                  <Button
                    size="lg"
                    className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  >
                    Quero ser motoboy
                  </Button>
                </Link>
              </div>

              <p className="mt-4 text-sm text-white/50">
                Já tem conta?{" "}
                <Link
                  href="/login/cliente"
                  className="font-medium text-teal-bright hover:underline"
                >
                  Entrar agora
                </Link>
              </p>
            </div>

            {/* Ilustração do motoboy + chips flutuantes */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
              <img
                src="/imgs/motoboy.png"
                alt="Motoboy do SpeedLog pronto para uma entrega"
                className="pointer-events-none w-full select-none drop-shadow-2xl"
              />
              <div className="absolute left-0 top-6 hidden items-center gap-3 rounded-xl bg-night-soft/90 px-4 py-3 shadow-lg ring-1 ring-white/10 backdrop-blur sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
                  <Timer
                    className="h-5 w-5 text-teal-bright"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Tempo real</p>
                  <p className="text-xs text-white/60">Acompanhe cada etapa</p>
                </div>
              </div>
              <div className="absolute bottom-8 right-0 hidden items-center gap-3 rounded-xl bg-night-soft/90 px-4 py-3 shadow-lg ring-1 ring-white/10 backdrop-blur sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/20">
                  <PackageCheck
                    className="h-5 w-5 text-success"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Assinatura digital
                  </p>
                  <p className="text-xs text-white/60">
                    Entrega confirmada na hora
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Por que o SpeedLog?
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Feito para entregar mais, todos os dias
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {vantagens.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={v.image}
                  alt={v.title}
                  className="mx-auto h-36 w-36 object-contain transition-transform group-hover:scale-105"
                />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfis */}
      <section className="bg-secondary/50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Uma plataforma, três perfis
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Funcionalidades para cada necessidade
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {perfis.map((perfil) => (
              <div
                key={perfil.title}
                className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={perfil.image}
                  alt={perfil.alt}
                  className="mx-auto h-44 object-contain"
                />
                <h3 className="mt-4 text-center text-lg font-semibold text-foreground">
                  {perfil.title}
                </h3>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
                  {perfil.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-success"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={perfil.href} className="mt-6">
                  <Button variant="outline" className="w-full gap-2">
                    Acessar
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plataforma */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              {/* Moldura estilo navegador */}
              <div className="overflow-hidden rounded-2xl border bg-night-soft shadow-2xl ring-1 ring-black/10">
                <div className="flex items-center gap-1.5 border-b border-white/10 bg-night-deep px-4 py-3">
                  <span
                    className="h-3 w-3 rounded-full bg-red-400/80"
                    aria-hidden="true"
                  />
                  <span
                    className="h-3 w-3 rounded-full bg-yellow-400/80"
                    aria-hidden="true"
                  />
                  <span
                    className="h-3 w-3 rounded-full bg-green-400/80"
                    aria-hidden="true"
                  />
                  <span className="ml-3 rounded-md bg-white/10 px-3 py-0.5 text-xs text-white/60">
                    speedlog.app
                  </span>
                </div>
                <img
                  src="/imgs/Home.PNG"
                  alt="Tela inicial do painel do SpeedLog"
                  className="w-full object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                A plataforma
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Tudo sob controle, em um só lugar
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Do cálculo do frete à assinatura do destinatário, cada entrega
                passa por um fluxo claro e rastreável para clientes, motoboys e
                gerentes.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">
                      Frete automático
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Distância e peso calculados em tempo real.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <LayoutDashboard
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">
                      Acompanhamento ao vivo
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status atualizado de cada entrega.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <PenTool
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">
                      Assinatura digital
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Confirmação do recebedor ao finalizar.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">
                      Relatórios para gerentes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Métricas de desempenho e faturamento.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-night px-6 py-16 text-center sm:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto para acelerar suas entregas?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
              Cadastre-se agora e coloque a logística do seu negócio no piloto
              automático.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/cadastro/cliente">
                <Button size="lg" className="gap-2">
                  Cadastrar como cliente
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/cadastro/motoboy">
                <Button
                  size="lg"
                  className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  Cadastrar como motoboy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-night-deep py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
            <div className="text-center md:text-left">
              <img src="/imgs/Logo.PNG" alt="SpeedLog" className="h-9 w-auto" />
              <p className="mt-3 max-w-xs text-sm text-white/60">
                Sistema completo de gerenciamento de entregas e logística.
              </p>
            </div>

            <nav
              aria-label="Acesso rápido"
              className="flex flex-col items-center gap-2 text-sm md:items-start"
            >
              <p className="font-semibold text-white/90">Acessar</p>
              <Link
                href="/login/cliente"
                className="text-white/60 transition-colors hover:text-teal-bright"
              >
                Cliente
              </Link>
              <Link
                href="/login/motoboy"
                className="text-white/60 transition-colors hover:text-teal-bright"
              >
                Motoboy
              </Link>
              <Link
                href="/login/gerente"
                className="text-white/60 transition-colors hover:text-teal-bright"
              >
                Gerente
              </Link>
            </nav>

            <nav
              aria-label="Informações"
              className="flex flex-col items-center gap-2 text-sm md:items-start"
            >
              <p className="font-semibold text-white/90">Empresa</p>
              <Link
                href="#"
                className="text-white/60 transition-colors hover:text-teal-bright"
              >
                Privacidade
              </Link>
              <Link
                href="#"
                className="text-white/60 transition-colors hover:text-teal-bright"
              >
                Termos
              </Link>
              <Link
                href="#"
                className="text-white/60 transition-colors hover:text-teal-bright"
              >
                Contato
              </Link>
            </nav>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-white/50">
              © 2026 SpeedLog. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
