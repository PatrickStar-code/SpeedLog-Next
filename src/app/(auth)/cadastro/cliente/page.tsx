'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clienteCadastroSchema, type ClienteCadastroInput } from '@/lib/validations/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { cn } from '@/lib/utils/helpers'
import { Suspense } from 'react'
import { MaskedInput, MASKS } from '@/components/ui/masked-input'

function CadastroForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ClienteCadastroInput>({
    resolver: zodResolver(clienteCadastroSchema),
  })

  const telefoneValue = watch('telefone')
  const cepValue = watch('cep')
  const cpfValue = watch('cpf')

  const onSubmit = async (data: ClienteCadastroInput) => {
    setError(null)
    setIsLoading(true)

    try {
      // Remove máscaras antes de enviar
      const cleanData = {
        ...data,
        telefone: telefoneValue.replace(/\D/g, ''),
        cep: cepValue.replace(/\D/g, ''),
        cpf: cpfValue.replace(/\D/g, ''),
      }

      const response = await fetch('/api/usuarios/cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Erro ao cadastrar. Tente novamente.')
        return
      }

      router.push('/login/cliente?registered=true')
    } catch {
      setError('Erro ao cadastrar. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar role="public" />

      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-primary">SpeedLog</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold">Cadastro de Cliente</h1>
            <p className="mt-2 text-muted-foreground">
              Crie sua conta para começar a usar o SpeedLog
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Criar Conta</CardTitle>
              <CardDescription>Preencha seus dados para se cadastrar</CardDescription>
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
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    {...register('nome')}
                    disabled={isLoading}
                    aria-invalid={!!errors.nome}
                    aria-describedby={errors.nome ? 'nome-error' : undefined}
                  />
                  {errors.nome && (
                    <p id="nome-error" className="text-sm text-red-600" role="alert">
                      {errors.nome.message}
                    </p>
                  )}
                </div>

                <MaskedInput
                  id="telefone"
                  name="telefone"
                  label="Telefone"
                  mask={MASKS.telefone}
                  placeholder="(XX) XXXXX-XXXX"
                  value={telefoneValue}
                  onChange={(value) => register('telefone').onChange({ target: { value } })}
                  onBlur={(value) => register('telefone').onBlur({ target: { value } })}
                  error={errors.telefone?.message}
                  required
                  disabled={isLoading}
                />

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register('email')}
                    disabled={isLoading}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-600" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <MaskedInput
                  id="cep"
                  name="cep"
                  label="CEP"
                  mask={MASKS.cep}
                  placeholder="XXXXX-XXX"
                  value={cepValue}
                  onChange={(value) => register('cep').onChange({ target: { value } })}
                  onBlur={(value) => register('cep').onBlur({ target: { value } })}
                  error={errors.cep?.message}
                  required
                  disabled={isLoading}
                />

                <MaskedInput
                  id="cpf"
                  name="cpf"
                  label="CPF"
                  mask={MASKS.cpf}
                  placeholder="XXX.XXX.XXX-XX"
                  value={cpfValue}
                  onChange={(value) => register('cpf').onChange({ target: { value } })}
                  onBlur={(value) => register('cpf').onBlur({ target: { value } })}
                  error={errors.cpf?.message}
                  required
                  disabled={isLoading}
                />

                <div className="space-y-2">
                  <Label htmlFor="login">Login</Label>
                  <Input
                    id="login"
                    type="text"
                    placeholder="Crie um login"
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
                    placeholder="Crie uma senha (mín. 6 caracteres)"
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    'Cadastrar'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <p className="text-center text-sm text-muted-foreground">
                Já tem conta?{' '}
                <Link href="/login/cliente" className="text-primary hover:underline font-medium">
                  Faça login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function CadastroClientePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
      <CadastroForm />
    </Suspense>
  )
}