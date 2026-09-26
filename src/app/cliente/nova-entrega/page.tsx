'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Truck, Package, MapPin, Clock, Calculator, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { encomendaSchema, type EncomendaInput } from '@/lib/validations/schemas'
import { cn } from '@/lib/utils/helpers'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function NovaEntregaPage() {
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
  const [valorTotal, setValorTotal] = useState(0)
  const [calculando, setCalculando] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EncomendaInput>({
    resolver: zodResolver(encomendaSchema),
    defaultValues: {
      cod: user?.id || 0,
    },
  })

  const peso = watch('peso')
  const distancia = watch('distancia')
  const tempo_estimado = watch('tempo_estimado')

  const calcularFrete = async () => {
    if (!peso || !distancia || !tempo_estimado) return

    setCalculando(true)
    try {
      // Extrair número da distância (ex: "190.1 km" -> 190.1)
      const distNum = parseFloat(distancia.replace(/[^\d.]/g, ''))
      // Extrair minutos do tempo (ex: "2 hour 56 mins" -> 176)
      const tempoMatch = tempo_estimado.match(/(\d+)\s*hour?/i)
      const minsMatch = tempo_estimado.match(/(\d+)\s*min/i)
      let tempoMins = 0
      if (tempoMatch) tempoMins += parseInt(tempoMatch[1]) * 60
      if (minsMatch) tempoMins += parseInt(minsMatch[1])
      if (!tempoMatch && !minsMatch) {
        // Tentar pegar apenas números
        const nums = tempo_estimado.match(/\d+/g)
        if (nums) tempoMins = parseInt(nums[0])
      }

      const response = await fetch('/api/frete/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          peso,
          distancia: distNum,
          tempo: tempoMins,
        }),
      })

      const data = await response.json()
      if (data.valorTotal) {
        setValorTotal(data.valorTotal)
        setValue('valor_total', data.valorTotal)
        setValue('tempo_mins', tempoMins)
      }
    } catch {
      // Silently fail
    } finally {
      setCalculando(false)
    }
  }

  const onSubmit = async (data: EncomendaInput) => {
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const response = await fetch('/api/entregas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setSubmitError(result.error || 'Erro ao criar entrega')
        return
      }

      setSubmitSuccess(true)
      setTimeout(() => router.push('/cliente/encomendas'), 1500)
    } catch {
      setSubmitError('Erro ao criar entrega. Tente novamente.')
    }
  }

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
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Nova Entrega</h1>
          <p className="text-muted-foreground">Preencha os dados para solicitar uma nova entrega</p>
        </div>

        {submitSuccess && (
          <div className={cn('flex items-center gap-2 p-4 rounded-md bg-green-50 text-green-600')}>
            <CheckCircle className="h-5 w-5 shrink-0" />
            Entrega criada com sucesso! Redirecionando...
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Dados da Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {submitError && (
                <div className={cn('flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-600 text-sm')}>
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {submitError}
                </div>
              )}

              {/* Origem */}
              <fieldset className="space-y-4">
                <legend className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Origem
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="origem">CEP de Origem</Label>
                    <Input
                      id="origem"
                      placeholder="XXXXX-XXX"
                      {...register('origem')}
                      aria-invalid={!!errors.origem}
                    />
                    {errors.origem && <p className="text-sm text-red-600" role="alert">{errors.origem.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origem_n">Número</Label>
                    <Input
                      id="origem_n"
                      type="number"
                      placeholder="123"
                      {...register('origem_n', { valueAsNumber: true })}
                      aria-invalid={!!errors.origem_n}
                    />
                    {errors.origem_n && <p className="text-sm text-red-600" role="alert">{errors.origem_n.message}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="bairro_origem">Bairro</Label>
                    <Input
                      id="bairro_origem"
                      placeholder="Bairro de origem"
                      {...register('bairro_origem')}
                      aria-invalid={!!errors.bairro_origem}
                    />
                    {errors.bairro_origem && <p className="text-sm text-red-600" role="alert">{errors.bairro_origem.message}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="log_origem">Logradouro</Label>
                    <Input
                      id="log_origem"
                      placeholder="Rua, Avenida, etc."
                      {...register('log_origem')}
                      aria-invalid={!!errors.log_origem}
                    />
                    {errors.log_origem && <p className="text-sm text-red-600" role="alert">{errors.log_origem.message}</p>}
                  </div>
                </div>
              </fieldset>

              {/* Destino */}
              <fieldset className="space-y-4 border-t pt-6">
                <legend className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Destino
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="destino">CEP de Destino</Label>
                    <Input
                      id="destino"
                      placeholder="XXXXX-XXX"
                      {...register('destino')}
                      aria-invalid={!!errors.destino}
                    />
                    {errors.destino && <p className="text-sm text-red-600" role="alert">{errors.destino.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destino_n">Número</Label>
                    <Input
                      id="destino_n"
                      type="number"
                      placeholder="123"
                      {...register('destino_n', { valueAsNumber: true })}
                      aria-invalid={!!errors.destino_n}
                    />
                    {errors.destino_n && <p className="text-sm text-red-600" role="alert">{errors.destino_n.message}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="bairro_destino">Bairro</Label>
                    <Input
                      id="bairro_destino"
                      placeholder="Bairro de destino"
                      {...register('bairro_destino')}
                      aria-invalid={!!errors.bairro_destino}
                    />
                    {errors.bairro_destino && <p className="text-sm text-red-600" role="alert">{errors.bairro_destino.message}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="log_destino">Logradouro</Label>
                    <Input
                      id="log_destino"
                      placeholder="Rua, Avenida, etc."
                      {...register('log_destino')}
                      aria-invalid={!!errors.log_destino}
                    />
                    {errors.log_destino && <p className="text-sm text-red-600" role="alert">{errors.log_destino.message}</p>}
                  </div>
                </div>
              </fieldset>

              {/* Detalhes da encomenda */}
              <fieldset className="space-y-4 border-t pt-6">
                <legend className="text-lg font-medium flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Detalhes da Encomenda
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="desc">Descrição *</Label>
                    <Input
                      id="desc"
                      placeholder="Descreva o conteúdo da encomenda"
                      {...register('desc')}
                      aria-invalid={!!errors.desc}
                    />
                    {errors.desc && <p className="text-sm text-red-600" role="alert">{errors.desc.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso (kg) *</Label>
                    <Input
                      id="peso"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="12"
                      placeholder="Ex: 1.5"
                      {...register('peso', { valueAsNumber: true })}
                      onBlur={calcularFrete}
                      aria-invalid={!!errors.peso}
                    />
                    {errors.peso && <p className="text-sm text-red-600" role="alert">{errors.peso.message}</p>}
                    <p className="text-xs text-muted-foreground">Máximo 12kg</p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      placeholder="Informações adicionais (opcional)"
                      {...register('complemento')}
                    />
                  </div>
                </div>
              </fieldset>

              {/* Cálculo de frete */}
              <fieldset className="space-y-4 border-t pt-6 bg-muted/30 rounded-lg p-4">
                <legend className="text-lg font-medium flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Cálculo de Frete
                </legend>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="distancia">Distância *</Label>
                    <Input
                      id="distancia"
                      placeholder="Ex: 190.1 km"
                      {...register('distancia')}
                      onBlur={calcularFrete}
                      aria-invalid={!!errors.distancia}
                    />
                    {errors.distancia && <p className="text-sm text-red-600" role="alert">{errors.distancia.message}</p>}
                    <p className="text-xs text-muted-foreground">Use o Google Maps para obter</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempo_estimado">Tempo Estimado *</Label>
                    <Input
                      id="tempo_estimado"
                      placeholder="Ex: 2 hour 56 mins"
                      {...register('tempo_estimado')}
                      onBlur={calcularFrete}
                      aria-invalid={!!errors.tempo_estimado}
                    />
                    {errors.tempo_estimado && <p className="text-sm text-red-600" role="alert">{errors.tempo_estimado.message}</p>}
                    <p className="text-xs text-muted-foreground">Use o Google Maps para obter</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor_total">Valor Total</Label>
                    <Input
                      id="valor_total"
                      type="number"
                      step="0.01"
                      readOnly
                      value={valorTotal.toFixed(2)}
                      className="bg-muted"
                    />
                    {calculando && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Calculando...
                      </div>
                    )}
                    {valorTotal > 0 && !calculando && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Calculado automaticamente
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>

              <Button type="submit" className="w-full" disabled={valorTotal === 0 || submitSuccess}>
                {submitSuccess ? 'Entrega Criada!' : 'Solicitar Entrega'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}