import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { AuthService } from '@/lib/services/auth-service'
import { loginSchema } from '@/lib/validations/schemas'

// Type augmentation must be declared before NextAuth is used
declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      role: 'cliente' | 'motoboy' | 'gerente'
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    role: 'cliente' | 'motoboy' | 'gerente'
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user && user.id) {
        token.id = parseInt(user.id, 10)
        token.role = (user as any).role
      }
      if (trigger === 'update' && session) {
        token.name = session.user.name
        token.email = session.user.email
        token.image = session.user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        const user = session.user as { id: number; role: 'cliente' | 'motoboy' | 'gerente'; name?: string | null; email?: string | null; image?: string | null }
        user.id = token.id
        user.role = token.role
      }
      return session
    },
  },
  providers: [
    Credentials({
      name: 'Cliente',
      id: 'cliente',
      credentials: {
        login: { label: 'Login ou Email', type: 'text' },
        senha: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { login, senha } = parsed.data
        try {
          const user = await AuthService.authenticateUser(login, senha, 'cliente')
          if (!user) return null
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          }
        } catch {
          return null
        }
      },
    }),
    Credentials({
      name: 'Motoboy',
      id: 'motoboy',
      credentials: {
        login: { label: 'Login ou Email', type: 'text' },
        senha: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { login, senha } = parsed.data
        try {
          const user = await AuthService.authenticateUser(login, senha, 'motoboy')
          if (!user) return null
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Erro na autenticação')
        }
      },
    }),
    Credentials({
      name: 'Gerente',
      id: 'gerente',
      credentials: {
        login: { label: 'Login', type: 'text' },
        senha: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { login, senha } = parsed.data
        try {
          const user = await AuthService.authenticateUser(login, senha, 'gerente')
          if (!user) return null
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          }
        } catch {
          return null
        }
      },
    }),
  ],
})