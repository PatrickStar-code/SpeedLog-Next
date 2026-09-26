import { NextRequest, NextResponse } from 'next/server'
import { FreteService } from '@/lib/services/frete-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { peso, distancia, tempo } = body

    if (typeof peso !== 'number' || peso <= 0) {
      return NextResponse.json({ error: 'Peso inválido' }, { status: 400 })
    }
    if (typeof distancia !== 'number' || distancia <= 0) {
      return NextResponse.json({ error: 'Distância inválida' }, { status: 400 })
    }
    if (typeof tempo !== 'number' || tempo <= 0) {
      return NextResponse.json({ error: 'Tempo inválido' }, { status: 400 })
    }

    const resultado = await FreteService.calcularFreteCompleto(peso, distancia, tempo)

    return NextResponse.json(resultado)
  } catch (error) {
    console.error('Erro ao calcular frete:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}