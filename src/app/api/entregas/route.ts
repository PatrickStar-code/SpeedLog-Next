import { NextRequest, NextResponse } from 'next/server'
import { EntregaService } from '@/lib/services/entrega-service'
import { encomendaSchema } from '@/lib/validations/schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = encomendaSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data as {
      desc: string
      peso: number
      complemento: string | null
      origem: string
      origem_n: number
      bairro_origem: string
      log_origem: string
      destino: string
      destino_n: number
      bairro_destino: string
      log_destino: string
      distancia: string
      tempo_estimado: string
      valor_total: number
      cod: number
      tempo_mins: number
    }

    const entrega = await EntregaService.criarEntrega(data)

    return NextResponse.json({
      message: 'Entrega criada com sucesso',
      entrega: {
        id: entrega.idEntregas,
        desc: entrega.descEntrega,
        status: entrega.statusEntrega,
        valorTotal: entrega.valorTotal,
      },
    })
  } catch (error) {
    console.error('Erro ao criar entrega:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}