# SpeedLog - Arquitetura CI/CD

## Visão Geral

Esta documentação descreve a arquitetura de Integração Contínua e Entrega Contínua (CI/CD) para o projeto **SpeedLog** — uma aplicação Next.js 14+ com TypeScript, Tailwind CSS, Prisma ORM (MySQL) e NextAuth.js.

---

## Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Framework | Next.js | 16.3.6 |
| Linguagem | TypeScript | 5.x |
| Banco de Dados | MySQL | 8.0 (via Prisma) |
| ORM | Prisma | 5.22.0 |
| Autenticação | NextAuth.js | 5.0.0-beta.32 |
| Estilização | Tailwind CSS | 4.x |
| Linting | ESLint | 9.x |
| CI/CD | GitHub Actions | Latest |
| Deploy | Vercel | Latest |

---

## Estrutura de Branches

```
main (produção)
  ↑
develop (staging/integração)
  ↑
feature/* (novas funcionalidades)
bugfix/* (correções)
hotfix/* (correções urgentes em produção)
release/* (preparação de releases)
```

### Regras de Branch

- **main**: Branch protegida, apenas merge via PR aprovado + CI passando
- **develop**: Branch de integração, deploy automático para preview
- **feature/***: Branches de curta duração, merge para `develop` via PR
- **hotfix/***: Merge direto para `main` e `develop` após aprovação

---

## Pipeline CI (`.github/workflows/ci.yml`)

### Jobs Executados

| Job | Descrição | Dependências |
|-----|-----------|--------------|
| `lint-and-typecheck` | ESLint + TypeScript strict mode | — |
| `unit-tests` | Testes unitários (Jest/Vitest) | — |
| `build` | Build de produção Next.js | lint-and-typecheck, unit-tests |
| `database-migration` | Valida migrações Prisma contra MySQL | — |
| `security-audit` | npm audit + Snyk scan | — |

### Fluxo do Pipeline CI

```mermaid
graph TD
    A[Push/PR] --> B[lint-and-typecheck]
    A --> C[unit-tests]
    A --> D[database-migration]
    A --> E[security-audit]
    B --> F[build]
    C --> F
    F --> G[Upload Artifacts]
```

### Detalhes dos Jobs

#### 1. Lint & TypeCheck
```yaml
- ESLint (eslint.config.mjs)
- TypeScript: tsc --noEmit (strict mode)
```
**Falha se**: Qualquer warning/error de lint ou erro de tipagem.

#### 2. Unit Tests
```yaml
- npm ci (instala dependências exatas)
- npx prisma generate
- npm run test (quando configurado)
```
**Nota**: Configure `test` script no `package.json` quando adicionar testes.

#### 3. Build
```yaml
- npm ci
- npx prisma generate
- npm run build (next build)
- Upload de artifacts (.next/, public/)
```
**Variáveis de build**:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`

#### 4. Database Migration Check
```yaml
- MySQL 8.0 service container
- npx prisma migrate deploy
- npx prisma migrate status
```
Valida que migrações aplicam sem erro em banco limpo.

#### 5. Security Audit
```yaml
- npm audit --audit-level=high
- Snyk scan (se SNYK_TOKEN configurado)
```
Bloqueia merge se vulnerabilidades `high` ou `critical` existirem.

---

## Pipeline CD (`.github/workflows/cd.yml`)

### Ambientes de Deploy

| Ambiente | Trigger | URL |
|----------|---------|-----|
| **Preview** | PR aberto/atualizado + `workflow_dispatch` (preview) | `https://speedlog-git-<branch>-<org>.vercel.app` |
| **Production** | Push para `main` + `workflow_dispatch` (production) | `https://speedlog.vercel.app` |

### Fluxo do Pipeline CD

```mermaid
graph TD
    A[Push main / PR / Manual] --> B{Ambiente?}
    B -->|Preview| C[Deploy Preview]
    B -->|Production| D[Deploy Production]
    C --> E[Comentar PR com URL]
    D --> F[Notificar Sucesso]
```

### Deploy Preview (PRs)
- Automático em todo PR para `main` ou `develop`
- Comentário automático no PR com URL do preview
- Útil para validação visual e testes de integração

### Deploy Production
- **Apenas** em push para `main` OU dispatch manual
- Requer aprovação (environment: production)
- Deploy com `--prod` flag do Vercel

---

## Secrets Necessários (GitHub Settings → Secrets → Actions)

### Obrigatórios

| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `DATABASE_URL` | Connection string MySQL produção | `mysql://user:pass@host:3306/speedlog` |
| `NEXTAUTH_SECRET` | Chave secreta NextAuth (min 32 chars) | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL canônica da aplicação | `https://speedlog.vercel.app` |
| `VERCEL_TOKEN` | Token de acesso Vercel | `vercel login && vercel tokens create` |
| `VERCEL_ORG_ID` | ID da organização Vercel | `vercel inspect <deploy> --token` |
| `VERCEL_PROJECT_ID` | ID do projeto Vercel | `vercel inspect <deploy> --token` |

### Email (Opcional - para funcionalidade de email)

| Secret | Descrição |
|--------|-----------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | Email remetente |
| `SMTP_PASSWORD` | App Password Gmail |
| `EMAIL_FROM` | `SpeedLog <noreply@speedlog.com>` |

### Extras

| Secret | Descrição |
|--------|-----------|
| `GOOGLE_MAPS_API_KEY` | Para cálculo de distância/tempo |
| `SNYK_TOKEN` | Token Snyk para security scan |
| `NEXT_PUBLIC_APP_URL` | URL pública da app |
| `NEXT_PUBLIC_APP_NAME` | Nome da aplicação |

---

## Configuração Local

### 1. Clonar e configurar

```bash
git clone <repo-url>
cd speedlog-next
cp .env.example .env
# Editar .env com valores locais
```

### 2. Instalar dependências

```bash
npm ci
```

### 3. Configurar banco de dados

```bash
# Opção A: Docker (recomendado)
docker run -d \
  --name speedlog-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=speedlog \
  -p 3306:3306 \
  mysql:8.0

# Opção B: MySQL local
# Configurar DATABASE_URL no .env
```

### 4. Gerar Prisma Client e aplicar migrações

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Rodar em desenvolvimento

```bash
npm run dev
# http://localhost:3000
```

---

## Comandos Úteis

### Desenvolvimento

```bash
npm run dev          # Servidor dev (Turbopack)
npm run build        # Build produção
npm run start        # Servidor produção local
npm run lint         # ESLint
npx tsc --noEmit     # Type check
```

### Prisma

```bash
npx prisma generate        # Gerar client
npx prisma migrate dev     # Nova migração (dev)
npx prisma migrate deploy  # Aplicar migrações (prod)
npx prisma studio          # UI visual do banco
npx prisma db seed         # Seed (se configurado)
```

### GitHub Actions Local (act)

```bash
# Instalar act
brew install act  # macOS
# ou
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Rodar CI local
act push -s GITHUB_TOKEN=<token> -s DATABASE_URL=<url> ...

# Rodar job específico
act -j build -s VERCEL_TOKEN=<token> ...
```

---

## Troubleshooting

### Build falha no Vercel

1. Verificar logs no dashboard Vercel
2. Checar se `prisma generate` roda no `postinstall` (já configurado no `package.json`)
3. Verificar `DATABASE_URL` nas Environment Variables do projeto Vercel

### Migração falha no CI

1. Verificar se schema Prisma compila: `npx prisma validate`
2. Checar se MySQL service subiu (healthcheck)
3. Verificar sintaxe da migração em `prisma/migrations/`

### Testes não rodam

```bash
# Adicionar ao package.json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

Instalar: `npm i -D vitest @testing-library/react jsdom`

### ESLint erro de config

```bash
# Verificar config
npx eslint --print-config .eslintrc.js

# Reset cache
npm run lint -- --cache=false
```

---

## Próximos Passos (Roadmap)

- [ ] Adicionar testes unitários (Vitest + React Testing Library)
- [ ] Adicionar testes E2E (Playwright/Cypress)
- [ ] Configurar dependabot para updates automáticos
- [ ] Adicionar badge de status no README
- [ ] Configurar notificações Slack/Discord para deploy
- [ ] Implementar feature flags para rollout gradual
- [ ] Adicionar monitoramento (Sentry, Vercel Analytics)

---

## Referências

- [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel GitHub Actions](https://github.com/vercel/vercel-action)
- [Prisma CI/CD Guide](https://www.prisma.io/docs/guides/continuous-integration)
- [GitHub Actions Docs](https://docs.github.com/en/actions)