import { NextRequest, NextResponse } from 'next/server'
import { FreteService } from '@/lib/services/frete-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { distancia } = body

    if (typeof distancia !== 'number' || distancia <= 0) {
      return NextResponse.json({ error: 'Distância inválida' }, { status: 400 })
    }

    const valor = await FreteService.calcularValorDistancia(distancia)

    return NextResponse.json({ valor })
  } catch (error) {
    console.error('Erro ao calcular valor por distância:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}