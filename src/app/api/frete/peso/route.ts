import { NextRequest, NextResponse } from 'next/server'
import { FreteService } from '@/lib/services/frete-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { peso } = body

    if (typeof peso !== 'number' || peso <= 0) {
      return NextResponse.json({ error: 'Peso inválido' }, { status: 400 })
    }

    const valor = await FreteService.calcularValorPeso(peso)

    return NextResponse.json({ valor })
  } catch (error) {
    console.error('Erro ao calcular valor por peso:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}