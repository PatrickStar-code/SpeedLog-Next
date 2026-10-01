'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { cn } from '@/lib/utils/helpers'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/motoboy'
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await signIn('motoboy', {
        login: data.login,
        senha: data.senha,
        redirect: false,
      })

      if (result?.error) {
        setError('Login ou senha inválidos, ou CNH não aprovada')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar role="public" />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <img src="/imgs/Logo.PNG" alt="SpeedLog" className="mx-auto h-12 w-auto" />
            </Link>
            <h1 className="mt-6 text-2xl font-bold">Entrar como Motoboy</h1>
            <p className="mt-2 text-muted-foreground">
              Acesse sua conta para gerenciar suas entregas
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Digite suas credenciais para acessar sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className={cn('flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-600 text-sm')}>
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="login">Login ou Email</Label>
                  <Input
                    id="login"
                    type="text"
                    placeholder="Digite seu login ou email"
                    {...register('login')}
                    disabled={isLoading}
                    aria-invalid={!!errors.login}
                    aria-describedby={errors.login ? 'login-error' : undefined}
                  />
                  {errors.login && (
                    <p id="login-error" className="text-sm text-red-600" role="alert">
                      {errors.login.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    {...register('senha')}
                    disabled={isLoading}
                    aria-invalid={!!errors.senha}
                    aria-describedby={errors.senha ? 'senha-error' : undefined}
                  />
                  {errors.senha && (
                    <p id="senha-error" className="text-sm text-red-600" role="alert">
                      {errors.senha.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-input" />
                    <span className="text-sm text-muted-foreground">Lembrar-me</span>
                  </label>
                  <Link
                    href="/recuperar-senha"
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueci a senha
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <p className="text-center text-sm text-muted-foreground">
                Não tem conta?{' '}
                <Link href="/cadastro/motoboy" className="text-primary hover:underline font-medium">
                  Cadastre-se
                </Link>
              </p>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Ou</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/login/cliente">
                  <Button variant="outline" className="w-full">
                    Sou Cliente
                  </Button>
                </Link>
                <Link href="/login/gerente">
                  <Button variant="outline" className="w-full">
                    Sou Gerente
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function LoginMotoboyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
      <LoginForm />
    </Suspense>
  )
}