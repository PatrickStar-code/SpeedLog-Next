# SpeedLog — Plataforma de Logística Urbana

[![CI](https://github.com/patrick/speedlog-next/actions/workflows/ci.yml/badge.svg)](https://github.com/patrick/speedlog-next/actions/workflows/ci.yml)
[![CD](https://github.com/patrick/speedlog-next/actions/workflows/cd.yml/badge.svg)](https://github.com/patrick/speedlog-next/actions/workflows/cd.yml)
[![Vercel](https://vercelbadge.vercel.app/api/patrick/speedlog-next)](https://vercel.com/patrick/speedlog-next)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql)](https://www.mysql.com/)

> **Rebuild completo** do sistema legado PHP/CodeIgniter → **Next.js 16 (App Router)**, TypeScript strict, Tailwind CSS 4, Prisma ORM (MySQL), NextAuth.js v5.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Quick Start](#-quick-start)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Banco de Dados](#-banco-de-dados)
- [API Routes](#-api-routes)
- [Autenticação e Autorização](#-autenticação-e-autorização)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Desenvolvimento](#-desenvolvimento)
- [CI/CD](#-cicd)
- [Deploy](#-deploy)
- [Testes](#-testes)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Licença](#-licença)

---

## 🎯 Visão Geral

**SpeedLog** é uma plataforma de logística para entregas urbanas, conectando **clientes** que precisam enviar pacotes a **motoboys** disponíveis. O sistema gerencia todo o ciclo: cadastro, cálculo de frete (peso + distância + tempo), criação de entregas, atribuição a motoboys, rastreamento de status e finalização com assinatura digital.

### Atores do Sistema

| Perfil | Descrição | Acesso |
|--------|-----------|--------|
| **Cliente** | Solicita entregas, acompanha status, histórico | `/cliente/*` |
| **Motoboy** | Recebe entregas, atualiza status, rota, ganhos | `/motoboy/*` |
| **Gerente/Admin** | Gestão de usuários, motoboys, preços, relatórios | `/login/gerente` |

---

## ✨ Funcionalidades

### 🔐 Autenticação
- [x] Login/Registro por **email + senha** (credentials provider)
- [x] Login/Registro por **magic link** (email provider)
- [x] **Middleware** de proteção de rotas por role
- [x] Sessão JWT com rotação de token
- [x] Recuperação de senha (email + hash temporário)

### 👤 Gestão de Usuários
- [x] Cadastro **Cliente** (nome, CPF, CEP, telefone, email, senha)
- [x] Cadastro **Motoboy** (dados pessoais + CNH + placa moto + conta bancária)
- [x] Validação **CPF/CNPJ**, **CEP**, **Telefone**, **CNH**, **Placa Mercosul/antiga**
- [x] Upload de foto (perfil + CNH motoboy)
- [x] Status CNH motoboy: `Em Análise` → `Aprovada` / `Rejeitada`

### 📦 Entregas
- [x] Criação: origem/destino (CEP + número + complemento), peso, descrição
- [x] **Cálculo automático de frete**: peso (tabela) + km (Google Maps) + tempo (Google Maps)
- [x] Atribuição a motoboy (manual ou automática por proximidade)
- [x] Status: `Pendente` → `Em Transporte` → `Entregue` / `Cancelada`
- [x] **Assinatura digital** na entrega (canvas)
- [x] Timestamps: pedido, início transporte, previsão, conclusão
- [x] Histórico completo por cliente/motoboy

### 💰 Precificação (Admin)
- [x] Tabela **Preço por Peso** (faixas min/max kg → valor)
- [x] Tabela **Preço por Km** (km rodado → valor/km)
- [x] Tabela **Preço por Tempo** (minutos → valor/min)
- [x] Cálculo: `valorTotal = peso + km + tempo` | `valor70p = valorTotal * 0.7` (repasse motoboy)

### 🗺 Integrações Externas
- [x] **Google Maps Distance Matrix API** — distância/tempo entre CEPs
- [x] **ViaCEP** — autocompletar endereço por CEP
- [x] **Nodemailer (Gmail SMTP)** — emails transacionais (boas-vindas, reset senha, notificações)
- [x] **Prisma + MySQL** — migrações versionadas, client type-safe

### 🎨 UI/UX
- [x] Design system: **Radix UI + Tailwind 4** (shadcn/ui patterns)
- [x] Componentes: Button, Input, MaskedInput (CPF/CEP/Telefone/CNH/Placa), Select, Dialog, Toast, Table, Badge, Card
- [x] Layout responsivo: Sidebar collapsível, Navbar, DashboardLayout
- [x] Dark mode ready (CSS variables)
- [x] Acessibilidade: ARIA labels, focus management, semantic HTML

---

## 🏗 Stack Tecnológica

| Camada | Tecnologia | Versão | Justificativa |
|--------|------------|--------|---------------|
| **Framework** | Next.js | 16.3.6 | App Router, Server Components, Turbopack |
| **Linguagem** | TypeScript | 5.x | Strict mode, type-safe Prisma client |
| **Banco** | MySQL | 8.0 | Relacional, ACID, custo-benefício |
| **ORM** | Prisma | 5.22.0 | Type-safe queries, migrações, studio UI |
| **Auth** | NextAuth.js | 5.0.0-beta.32 | Flexível, edge-compatible, múltiplos providers |
| **CSS** | Tailwind CSS | 4.x | Utility-first, JIT, design tokens |
| **Forms** | React Hook Form + Zod | 7.89 / 4.6 | Performático, validação schema-first |
| **UI Primitives** | Radix UI | 1.x | Acessíveis, unstyled, headless |
| **Lint/Format** | ESLint 9 + Prettier | 9.x | Flat config, TypeScript-aware |
| **CI/CD** | GitHub Actions | Latest | Nativo, matrix, services, OIDC |
| **Deploy** | Vercel | Latest | Zero-config Next.js, preview deployments |
| **Node** | Node.js | 20.x LTS | Suporte longo, performance |

---

## 🏛 Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT.JS APP ROUTER                       │
├─────────────────────────────────────────────────────────────────┤
│  middleware.ts  →  Auth guard (role-based route protection)    │
├─────────────────────────────────────────────────────────────────┤
│  src/app/                                                      │
│  ├── (auth)/              →  Login, Cadastro (cliente/motoboy) │
│  ├── api/                 →  REST endpoints (Server Actions)   │
│  │   ├── auth/[...nextauth]  →  NextAuth handler               │
│  │   ├── usuarios/           →  CRUD cliente/motoboy           │
│  │   ├── entregas/           →  CRUD entregas + status        │
│  │   └── frete/              →  Cálculo peso/km/tempo/distância│
│  ├── cliente/             →  Dashboard cliente (RSC + Client)  │
│  ├── motoboy/             →  Dashboard motoboy                 │
│  └── layout.tsx           →  Root layout + providers           │
├─────────────────────────────────────────────────────────────────┤
│  src/lib/                                                      │
│  ├── auth/                →  NextAuth config, callbacks, types │
│  ├── database/            →  Prisma singleton (globalThis)     │
│  ├── services/            →  Business logic (auth, entrega,    │
│  │                          frete, usuario, email)             │
│  ├── validations/         →  Zod schemas (input validation)    │
│  └── utils/               →  Helpers (formatação, máscaras)    │
├─────────────────────────────────────────────────────────────────┤
│  src/components/                                               │
│  ├── ui/                  →  Primitivas reutilizáveis          │
│  └── layout/              →  Navbar, Sidebar, DashboardLayout  │
├─────────────────────────────────────────────────────────────────┤
│  prisma/schema.prisma    →  Data model (MySQL)                 │
└─────────────────────────────────────────────────────────────────┘
```

### Princípios Arquiteturais

1. **Server-First**: RSC por default, Client Components só quando necessário (`'use client'`)
2. **Type Safety End-to-End**: Prisma → Zod → React Hook Form → API Routes
3. **Separation of Concerns**: Services = business logic, API Routes = HTTP layer, Components = UI
4. **Security by Default**: Middleware auth, CSRF via NextAuth, env-only secrets, SQL injection prevention via Prisma
5. **Performance**: Turbopack dev, static generation onde possível, image optimization, code splitting automático

---

## 🚀 Quick Start

### Pré-requisitos

- **Node.js 20.x LTS** (`node -v`)
- **npm 10.x** ou **pnpm** (`npm -v`)
- **MySQL 8.0** (local ou Docker)
- **Git**

### 1. Clone e Configure

```bash
git clone https://github.com/patrick/speedlog-next.git
cd speedlog-next

# Variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais reais
```

### 2. Banco de Dados (Docker Recomendado)

```bash
# MySQL 8.0 containerizado
docker run -d \
  --name speedlog-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=speedlog \
  -p 3306:3306 \
  mysql:8.0

# Verificar se subiu
docker logs speedlog-mysql | grep "ready for connections"
```

> **Alternativa**: MySQL local ou gerenciado (PlanetScale, Railway, AWS RDS). Atualize `DATABASE_URL` no `.env`.

### 3. Instale Dependências

```bash
npm ci  # Install exato do package-lock.json
```

### 4. Prisma Setup

```bash
# Gerar client type-safe
npx prisma generate

# Aplicar migrações (cria tabelas)
npx prisma migrate dev --name init

# Opcional: Visualizar banco
npx prisma studio  # http://localhost:5555
```

### 5. Desenvolvimento

```bash
npm run dev
# 🚀 http://localhost:3000
```

---

## 🔐 Variáveis de Ambiente

Copie `.env.example` → `.env` e preencha **todos** os valores:

```env
# ============================================================
# DATABASE (Obrigatório)
# ============================================================
DATABASE_URL="mysql://usuario:senha@host:3306/speedlog?connection_limit=10&pool_timeout=20"

# ============================================================
# NEXTAUTH (Obrigatório)
# ============================================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-com: openssl rand -base64 32"

# ============================================================
# EMAIL - Gmail SMTP (Obrigatório para magic link/reset senha)
# ============================================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="seu-email@gmail.com"
SMTP_PASSWORD="app-password-do-gmail"  # Não é a senha normal!
EMAIL_FROM="SpeedLog <noreply@seudominio.com>"

# ============================================================
# GOOGLE MAPS (Obrigatório para cálculo frete)
# ============================================================
GOOGLE_MAPS_API_KEY="sua-chave-com-billing-ativo"

# ============================================================
# APP (Opcional - defaults funcionam)
# ============================================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="SpeedLog"

# ============================================================
# UPLOAD S3/Cloudinary (Opcional - futuro)
# ============================================================
# AWS_ACCESS_KEY_ID=""
# AWS_SECRET_ACCESS_KEY=""
# AWS_REGION="us-east-1"
# AWS_S3_BUCKET=""
```

### Gerar `NEXTAUTH_SECRET`

```bash
# Opção 1: OpenSSL
openssl rand -base64 32

# Opção 2: Node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opção 3: Online (não recomendado para produção)
# https://generate-secret.vercel.app/32
```

### Gmail App Password

1. Ative **2FA** na conta Google
2. Acesse: https://myaccount.google.com/apppasswords
3. Crie "App Password" → nome: "SpeedLog"
4. Use a senha de 16 chars no `SMTP_PASSWORD`

---

## 📁 Estrutura de Pastas Detalhada

```
speedlog-next/
├── .github/
│   └── workflows/
│       ├── ci.yml          # Pipeline CI
│       └── cd.yml          # Pipeline CD (Vercel)
├── .vscode/                # Config VS Code (settings, extensions)
├── prisma/
│   ├── schema.prisma       # Data model (MySQL)
│   └── migrations/         # Histórico de migrações
├── public/                 # Assets estáticos (favicon, imagens)
├── src/
│   ├── app/                # App Router (Next.js 13+)
│   │   ├── (auth)/         # Route group: login, cadastro
│   │   │   ├── login/
│   │   │   │   ├── cliente/page.tsx
│   │   │   │   ├── motoboy/page.tsx
│   │   │   │   └── gerente/page.tsx
│   │   │   └── cadastro/
│   │   │       ├── cliente/page.tsx
│   │   │       └── motoboy/page.tsx
│   │   ├── api/            # API Routes (REST)
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── usuarios/
│   │   │   │   ├── cliente/route.ts
│   │   │   │   └── motoboy/route.ts
│   │   │   ├── entregas/route.ts
│   │   │   └── frete/
│   │   │       ├── calcular/route.ts
│   │   │       ├── distancia/route.ts
│   │   │       ├── peso/route.ts
│   │   │       └── tempo/route.ts
│   │   ├── cliente/        # Dashboard cliente (protected)
│   │   │   ├── page.tsx           # Lista entregas
│   │   │   └── nova-entrega/page.tsx
│   │   ├── motoboy/        # Dashboard motoboy (protected)
│   │   │   └── page.tsx
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Landing page
│   │   └── providers.tsx   # Context providers (Session, Theme)
│   ├── components/
│   │   ├── ui/             # Design system primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── masked-input.tsx    # CPF, CEP, Tel, CNH, Placa
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   └── card.tsx
│   │   └── layout/
│   │       ├── navbar.tsx
│   │       ├── sidebar.tsx
│   │       └── dashboard-layout.tsx
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── auth-config.ts      # NextAuth config
│   │   │   └── types.ts            # Type augmentation
│   │   ├── database/
│   │   │   └── prisma.ts           # Prisma singleton
│   │   ├── services/
│   │   │   ├── auth-service.ts     # Hash, tokens, validação senha
│   │   │   ├── usuario-service.ts  # CRUD usuários
│   │   │   ├── entrega-service.ts  # CRUD entregas + status
│   │   │   ├── frete-service.ts    # Cálculo frete + Google Maps
│   │   │   └── email-service.ts    # Nodemailer templates
│   │   ├── validations/
│   │   │   └── schemas.ts          # Zod schemas
│   │   └── utils/
│   │       └── helpers.ts          # Formatters, masks, etc.
│   ├── middleware.ts       # Auth guard (NextAuth)
│   ├── types/
│   │   └── index.ts        # Tipos globais
│   └── styles/
│       └── globals.css     # Tailwind + CSS variables
├── .env.example            # Template de variáveis
├── .env                    # Local (gitignored)
├── .gitignore
├── .eslintrc.mjs           # ESLint flat config
├── next.config.ts          # Next.js config
├── tsconfig.json           # TypeScript config
├── package.json
├── package-lock.json
├── postcss.config.mjs      # Tailwind PostCSS
├── README.md               # Este arquivo
├── CI-CD-ARCHITECTURE.md   # Docs CI/CD
└── instructions.md         # Workflow de dev (se existir)
```

---

## 🗄 Banco de Dados

### Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    USUARIO ||--o{ ENTREGA : "faz"
    MOTOBOY ||--o{ ENTREGA : "entrega"
    USUARIO {
        int idUsuario PK
        string nomeUsuario
        string loginUsuario UK
        string senhaUsuario
        string cpfUsuario UK
        string cepUsuario
        string emailUsuario UK
        string telefoneUsuario
        string fotoUsuario
        datetime criacaoUser
        string hashKey
        string hashExpiry
    }
    MOTOBOY {
        int idmotoboy PK
        string nomeMotoboy
        string emailMotoboy UK
        datetime criacaoFunc
        string fotoMotoboy
        string cpfMotoboy UK
        string telefoneMotoboy
        string placaMoto UK
        string loginMotoboy UK
        string senhaMotoboy
        string cnhMotoboy UK
        string cnhFotoMotoboy
        string contaCorrente
        string agencia
        string statusCnhMotoboy
    }
    ENTREGA {
        int idEntregas PK
        string descEntrega
        float pesoEntrega
        string complementoEntrega
        string cepOrigemEntrega
        int numeroOrigemEntrega
        string bairroOrigem
        string logradouroOrigem
        string cepDestinoEntrega
        int numeroDestinoEntrega
        string bairroDestino
        string logradouroDestino
        string distanciaKm
        string tempoTransporteKm
        int tempoMinutos
        float valorTotal
        float valor70p
        datetime dataPedido
        string statusEntrega
        string assinadoPor
        datetime horaInicioTransporte
        datetime horaPrevistoTranporte
        int motoboyIdmotoboy FK
        int usuarioIdUsuario FK
    }
    PRECO_PESO {
        int id PK
        decimal pesoMin
        decimal pesoMax
        decimal preco
    }
    PRECO_KM {
        int idKm PK
        int kmRodado
        float valorKm
    }
    PRECO_TEMPO {
        int idTempo PK
        int tempoRodado
        float valorTempo
    }
    ADMINISTRADOR {
        int idAdm PK
        string loginAdm UK
        string senhaAdm
        string nomeAdm
        string telefoneAdm
        string cepAdm
        string cpfAdm UK
        string emailAdm UK
    }
```

### Tabelas Principais

| Tabela | Descrição | Chaves |
|--------|-----------|--------|
| `usuario` | Clientes finais | `idUsuario` PK, `login_usuario` UK, `cpf_usuario` UK, `email_usuario` UK |
| `motoboy` | Entregadores | `idmotoboy` PK, `login_motoboy` UK, `cpf_motoboy` UK, `cnh_motoboy` UK, `placa_moto` UK |
| `administrador` | Gestores | `id_adm` PK, `login_adm` UK, `cpf_adm` UK, `email_adm` UK |
| `entregas` | Pedidos de entrega | `idEntregas` PK, FKs para `motoboy` e `usuario` |
| `preco_peso` | Tabela peso → valor | `id` PK, faixas `peso_min`/`peso_max` |
| `preco_km` | Tabela km → valor/km | `id_km` PK, `km_rodado` |
| `preco_tempo` | Tabela min → valor/min | `id_tempo` PK, `tempo_rodado` |

### Migrações

```bash
# Nova migração (desenvolvimento)
npx prisma migrate dev --name nome_descritivo

# Aplicar em produção/staging
npx prisma migrate deploy

# Status
npx prisma migrate status

# Reset completo (CUIDADO: apaga dados)
npx prisma migrate reset
```

---

## 🌐 API Routes

Base URL: `https://seu-dominio.com/api` (ou `http://localhost:3000/api`)

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth/[...nextauth]` | NextAuth handler (signin, signout, callback, session) |

### Usuários

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| `POST` | `/api/usuarios/cliente` | Público | Cadastrar cliente |
| `POST` | `/api/usuarios/motoboy` | Público | Cadastrar motoboy |
| `GET` | `/api/usuarios/cliente` | Cliente | Perfil logado |
| `GET` | `/api/usuarios/motoboy` | Motoboy | Perfil logado |

### Entregas

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| `POST` | `/api/entregas` | Cliente | Criar entrega |
| `GET` | `/api/entregas` | Cliente/Motoboy | Listar (filtros: status, data) |
| `GET` | `/api/entregas/:id` | Cliente/Motoboy | Detalhes entrega |
| `PATCH` | `/api/entregas/:id` | Motoboy/Admin | Atualizar status |
| `POST` | `/api/entregas/:id/assinatura` | Motoboy | Registrar assinatura |

### Frete (Cálculo)

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| `POST` | `/api/frete/calcular` | Cliente | Cálculo completo (peso+km+tempo) |
| `POST` | `/api/frete/peso` | Público | Valor por peso |
| `POST` | `/api/frete/distancia` | Público | Distância/tempo Google Maps |
| `POST` | `/api/frete/tempo` | Público | Valor por tempo |

### Exemplos de Request/Response

#### Criar Entrega
```bash
POST /api/entregas
Content-Type: application/json

{
  "descEntrega": "Documentos urgentes",
  "pesoEntrega": 0.5,
  "cepOrigemEntrega": "36010-000",
  "numeroOrigemEntrega": 100,
  "complementoEntrega": "Sala 201",
  "cepDestinoEntrega": "36035-000",
  "numeroDestinoEntrega": 500,
  "bairroDestino": "Centro",
  "logradouroDestino": "Rua Halfeld"
}
```

**Response 201:**
```json
{
  "idEntregas": 42,
  "statusEntrega": "Pendente",
  "valorTotal": 28.50,
  "valor70p": 19.95,
  "distanciaKm": "12.3",
  "tempoMinutos": 25,
  "dataPedido": "2025-01-15T14:30:00.000Z"
}
```

#### Calcular Frete
```bash
POST /api/frete/calcular
Content-Type: application/json

{
  "peso": 2.5,
  "cepOrigem": "36010-000",
  "cepDestino": "36035-000"
}
```

**Response 200:**
```json
{
  "peso": { "valor": 12.00, "faixa": "2.0 - 5.0 kg" },
  "distancia": { "km": 12.3, "duracaoMin": 25, "valor": 18.45 },
  "tempo": { "valor": 5.00 },
  "total": 35.45,
  "repasseMotoboy": 24.82
}
```

---

## 🔐 Autenticação e Autorização

### NextAuth.js v5 Configuration

```typescript
// src/lib/auth/auth-config.ts
providers: [
  CredentialsProvider({ name: 'credentials', ... }),
  EmailProvider({ server: {...}, from: process.env.EMAIL_FROM })
],
callbacks: {
  jwt: async ({ token, user }) => { /* role, id */ },
  session: async ({ session, token }) => { /* attach role/id */ },
  authorized: async ({ auth, request }) => { /* middleware guard */ }
},
pages: {
  signIn: '/login/cliente',
  error: '/login/cliente?error=CredentialsSignin'
}
```

### Roles e Permissões

| Role | Rotas Acessíveis | Ações |
|------|------------------|-------|
| `cliente` | `/cliente/*`, `/api/entregas` (own) | Criar entrega, ver próprio histórico |
| `motoboy` | `/motoboy/*`, `/api/entregas` (assigned) | Atualizar status, assinar entrega |
| `admin` | `/login/gerente`, `/api/*` | Gestão total, relatórios, precificação |

### Middleware (`src/middleware.ts`)

```typescript
export { auth as middleware } from '@/lib/auth/auth-config'

export const config = {
  matcher: [
    '/cliente/:path*',
    '/motoboy/:path*',
    '/login/gerente/:path*',
    '/api/entregas/:path*',
    '/api/usuarios/:path*'
  ]
}
```

### Fluxo de Login

```mermaid
sequenceDiagram
    participant U as Usuário
    participant C as Cliente (Browser)
    participant N as NextAuth
    participant DB as MySQL
    
    U->>C: Acessa /login/cliente
    C->>N: POST /api/auth/callback/credentials
    N->>DB: SELECT * FROM usuario WHERE login = ?
    DB-->>N: Usuario + hash senha
    N->>N: bcrypt.compare(senha, hash)
    alt Sucesso
        N->>C: Set-Cookie: next-auth.session-token
        C->>U: Redirect /cliente
    else Falha
        N->>C: 401 + error message
    end
```

---

## 🛠 Scripts Disponíveis

```json
{
  "scripts": {
    "dev": "next dev",                    // Turbopack dev server
    "build": "next build",                // Production build
    "start": "next start",                // Production server
    "lint": "eslint",                     // ESLint flat config
    "typecheck": "tsc --noEmit",          // TypeScript strict check
    "prisma:generate": "prisma generate", // Generate client
    "prisma:migrate": "prisma migrate dev", // Dev migration
    "prisma:deploy": "prisma migrate deploy", // Prod migration
    "prisma:studio": "prisma studio",     // Visual DB editor
    "prisma:seed": "prisma db seed",      // Seed data (when configured)
    "test": "vitest run",                 // Unit tests (future)
    "test:e2e": "playwright test"         // E2E tests (future)
  }
}
```

### Comandos Úteis de Desenvolvimento

```bash
# Limpar cache e reinstalar
rm -rf node_modules .next package-lock.json && npm ci

# Verificar tipos sem build
npx tsc --noEmit

# Lint com auto-fix
npm run lint -- --fix

# Prisma: ver SQL das migrações pendentes
npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma --script

# Prisma: seed manual
npx prisma db seed

# Analyze bundle
ANALYZE=true npm run build
```

---

## 💻 Desenvolvimento

### Padrões de Código

#### 1. Server Components por Default
```tsx
// src/app/cliente/page.tsx (RSC - sem 'use client')
import { getEntregas } from '@/lib/services/entrega-service'

export default async function ClienteDashboard() {
  const entregas = await getEntregas(userId) // Direto no server
  return <EntregasList entregas={entregas} />
}
```

#### 2. Client Components Só Quando Necessário
```tsx
// src/components/ui/masked-input.tsx
'use client' // Interatividade: useState, useEffect, onChange

export function MaskedInput({ mask, ...props }) {
  const [value, setValue] = useState('')
  // ...
}
```

#### 3. Validação Zod + React Hook Form
```tsx
// Schema
const schema = z.object({
  cpf: z.string().refine(validarCPF, 'CPF inválido'),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  telefone: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Telefone inválido')
})

// Component
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema)
})
```

#### 4. Services = Pure Business Logic
```tsx
// src/lib/services/entrega-service.ts
export async function criarEntrega(data: EntregaInput, usuarioId: number) {
  // 1. Validar CEPs (ViaCEP)
  // 2. Calcular frete (frete-service)
  // 3. Criar no banco (Prisma)
  // 4. Retornar Entrega com relations
}
```

#### 5. API Routes Finas
```tsx
// src/app/api/entregas/route.ts
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const result = await criarEntrega(body, session.user.id)
  return NextResponse.json(result, { status: 201 })
}
```

### Convenções de Naming

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Components | PascalCase | `MaskedInput.tsx`, `DashboardLayout.tsx` |
| Hooks | camelCase + `use` | `useMaskedInput.ts` |
| Utils/Helpers | camelCase | `formatCurrency.ts`, `applyMask.ts` |
| Services | kebab-case + `-service` | `entrega-service.ts` |
| Zod Schemas | camelCase + `Schema` | `cadastroClienteSchema` |
| Types/Interfaces | PascalCase | `Entrega`, `UsuarioCreateInput` |
| API Routes | kebab-case | `/api/entregas`, `/api/frete/calcular` |
| Database | snake_case (Prisma `@map`) | `nome_usuario`, `id_usuario` |

### Git Workflow

```bash
# 1. Nova feature
git checkout develop
git pull origin develop
git checkout -b feature/nova-funcionalidade

# 2. Desenvolver + commits convencionais
git add .
git commit -m "feat: adiciona cálculo de frete por tempo"

# 3. Push + PR para develop
git push origin feature/nova-funcionalidade
# Abrir PR: develop ← feature/nova-funcionalidade

# 4. Após CI passar + review approve → merge

# 5. Release para main
git checkout main
git pull origin main
git merge develop
git push origin main
# CD deploya automaticamente
```

### Commits Convencionais

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

| Type | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação (sem lógica) |
| `refactor` | Refatoração |
| `test` | Testes |
| `chore` | Manutenção (deps, configs) |

Exemplos:
```
feat(entregas): adiciona assinatura digital na entrega
fix(auth): corrige validação de token expirado
docs(readme): atualiza variáveis de ambiente
refactor(services): extrai cálculo de frete para frete-service
```

---

## 🔄 CI/CD

Documentação completa: **[CI-CD-ARCHITECTURE.md](CI-CD-ARCHITECTURE.md)**

### Resumo dos Pipelines

#### CI (`.github/workflows/ci.yml`)
| Job | Trigger | Descrição |
|-----|---------|-----------|
| `lint-and-typecheck` | Push/PR | ESLint + `tsc --noEmit` |
| `unit-tests` | Push/PR | Vitest (quando configurado) |
| `build` | Push/PR | `next build` + upload artifacts |
| `database-migration` | Push/PR | `prisma migrate deploy` em MySQL test |
| `security-audit` | Push/PR | `npm audit --audit-level=high` + Snyk |

#### CD (`.github/workflows/cd.yml`)
| Job | Trigger | Ambiente |
|-----|---------|----------|
| `deploy-preview` | PR aberto/atualizado | Preview (Vercel) |
| `deploy-production` | Push `main` / manual | Production (Vercel) |

### Branch Protection Rules (GitHub Settings → Branches)

```yaml
main:
  - Require PR review (1 approval)
  - Require CI checks: lint-and-typecheck, build, database-migration
  - Require linear history
  - No force push

develop:
  - Require PR review (1 approval)
  - Require CI checks: lint-and-typecheck, build
```

---

## 📦 Deploy

### Vercel (Recomendado)

1. **Conecte o repositório**: https://vercel.com/new
2. **Configure Environment Variables** (Project Settings → Environment Variables):
   - Todas do `.env` + `DATABASE_URL` de produção
   - `NEXTAUTH_URL` = URL produção (ex: `https://speedlog.vercel.app`)
3. **Deploy**: Automático a cada push em `main`

### Variáveis de Produção (Vercel Dashboard)

```env
DATABASE_URL="mysql://user:pass@host:3306/speedlog_prod?ssl_mode=REQUIRED"
NEXTAUTH_URL="https://speedlog.vercel.app"
NEXTAUTH_SECRET="producao-secret-32-chars-min"
# ... demais variáveis
```

### Docker (Alternativo)

```dockerfile
# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
COPY . .
RUN npm run build

FROM base AS runner
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t speedlog .
docker run -p 3000:3000 --env-file .env.production speedlog
```

---

## 🧪 Testes

### Estrutura Planejada

```
src/
├── __tests__/              # Unit tests (Vitest)
│   ├── lib/
│   │   ├── services/
│   │   │   ├── frete-service.test.ts
│   │   │   └── auth-service.test.ts
│   │   └── utils/
│   │       └── helpers.test.ts
│   └── components/
│       └── ui/
│           └── masked-input.test.tsx
├── __e2e__/                # E2E tests (Playwright)
│   ├── auth.spec.ts
│   ├── entrega-flow.spec.ts
│   └── dashboard.spec.ts
└── test/
    ├── setup.ts            # Vitest setup
    └── utils.tsx           # Test utilities (render, mockSession)
```

### Configuração (Quando Implementado)

```bash
# Unit: Vitest + React Testing Library + JSDOM
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/coverage-v8

# E2E: Playwright
npm i -D @playwright/test
npx playwright install
```

```json
// package.json
"scripts": {
  "test": "vitest run --coverage",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

### Cobertura Mínima Alvo

| Tipo | Meta |
|------|------|
| Unit (services, utils, validations) | ≥ 80% |
| Integration (API routes) | ≥ 60% |
| E2E (critical paths: login, criar entrega, fluxo motoboy) | 100% |

---

## 🔧 Troubleshooting

### Build Falha no Vercel

| Erro | Causa | Solução |
|------|-------|---------|
| `Module not found: @prisma/client` | `prisma generate` não rodou | Verificar `postinstall` no `package.json` |
| `DATABASE_URL not found` | Env var não configurada | Adicionar no Vercel Dashboard → Settings → Env Vars |
| `Edge Runtime: crypto not supported` | `import('crypto')` no middleware | Mover para Server Component ou usar Web Crypto API |
| `Prisma Client validation error` | Schema fora de sync | `npx prisma generate` local + commit `prisma/` |

### Migração Falha no CI

```bash
# 1. Validar schema local
npx prisma validate

# 2. Verificar migração problemática
cat prisma/migrations/20250115120000_problematica/migration.sql

# 3. Corrigir e regenerar
npx prisma migrate dev --name fix_migration
```

### ESLint Erros Comuns

| Erro | Fix |
|------|-----|
| `no-explicit-any` | Tipar corretamente (`unknown` → narrow) |
| `no-unused-vars` | Remover import ou usar `_` prefix |
| `react-hooks/rules-of-hooks` | Mover hooks para topo do componente |
| `no-empty-object-type` | Estender interface ou usar `type` |

### Prisma Client Não Atualiza

```bash
# Limpar cache e regenerar
rm -rf node_modules/.prisma
npx prisma generate
```

### Hydration Mismatch (Next.js)

```tsx
// Problema: Server render ≠ Client render
// Solução: useEffect para client-only ou suppressHydrationWarning
<div suppressHydrationWarning>{dynamicContent}</div>

// Ou: Client Component wrapper
'use client'
export function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted ? children : null
}
```

---

## 🗺 Roadmap

### v1.1 - Qualidade & Testes (Próximo)
- [ ] Testes unitários (Vitest) - services, utils, validations
- [ ] Testes E2E (Playwright) - fluxos críticos
- [ ] Cobertura ≥ 80% unit, 100% E2E critical paths
- [ ] Dependabot para updates automáticos

### v1.2 - Observabilidade
- [ ] Sentry (error tracking)
- [ ] Vercel Analytics / PostHog (product analytics)
- [ ] Logs estruturados (pino)
- [ ] Health check endpoint (`/api/health`)

### v1.3 - Features de Produto
- [ ] Notificações push (Web Push API)
- [ ] Chat cliente ↔ motoboy (WebSocket/Socket.io)
- [ ] Rastreamento tempo real (Mapbox/Leaflet)
- [ ] Relatórios PDF (entregas, ganhos, performance)
- [ ] PWA (offline, install prompt)

### v1.4 - Escala & Performance
- [ ] Cache Redis (sessões, fretes recentes)
- [ ] Queue BullMQ (emails, notificações async)
- [ ] Read replicas MySQL
- [ ] CDN para assets (Cloudflare R2 / S3)

### v1.5 - Multi-tenancy (Futuro)
- [ ] Organizações/Empresas
- [ ] White-label
- [ ] API pública para integrações

---

## 📚 Documentação Relacionada

| Arquivo | Descrição |
|---------|-----------|
| `CI-CD-ARCHITECTURE.md` | Pipeline CI/CD completo, secrets, troubleshooting |
| `instructions.md` | Workflow de desenvolvimento (se existir) |
| `prisma/schema.prisma` | Schema do banco (source of truth) |
| `.env.example` | Template de variáveis de ambiente |

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'feat: minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra Pull Request para `develop`

### Checklist do PR

- [ ] `npm run lint` passa
- [ ] `npx tsc --noEmit` passa
- [ ] `npm run build` passa
- [ ] Testes passam (quando existirem)
- [ ] Migração Prisma incluída (se alterou schema)
- [ ] Documentação atualizada (README, CI-CD-ARCHITECTURE.md)
- [ ] Commits convencionais

---

## 📄 Licença

**Projeto privado** — Todos os direitos reservados.

Desenvolvido por **Estúdio 332** — Juiz de Fora, MG, Brasil

---

## 📞 Contato & Suporte

- **Repositório**: https://github.com/patrick/speedlog-next
- **Issues**: https://github.com/patrick/speedlog-next/issues
- **Deploy Preview**: https://speedlog-git-develop-patrick.vercel.app (exemplo)
- **Produção**: https://speedlog.vercel.app (exemplo)

---

> **Nota**: Este README reflete o estado atual do projeto. Para decisões arquiteturais detalhadas, consulte `CI-CD-ARCHITECTURE.md` e o histórico de decisões no `instructions.md` (se aplicável).