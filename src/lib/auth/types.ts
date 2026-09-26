import { DefaultSession } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

// Extend the DefaultSession user type to include id and role
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
  interface JWT extends DefaultJWT {
    id: number
    role: 'cliente' | 'motoboy' | 'gerente'
  }
}