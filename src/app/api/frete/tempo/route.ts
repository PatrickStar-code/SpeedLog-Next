import { NextRequest, NextResponse } from 'next/server'
import { FreteService } from '@/lib/services/frete-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tempo } = body

    if (typeof tempo !== 'number' || tempo <= 0) {
      return NextResponse.json({ error: 'Tempo inválido' }, { status: 400 })
    }

    const valor = await FreteService.calcularValorTempo(tempo)

    return NextResponse.json({ valor })
  } catch (error) {
    console.error('Erro ao calcular valor por tempo:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}