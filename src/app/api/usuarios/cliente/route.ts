import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/auth-service'
import { clienteCadastroSchema } from '@/lib/validations/schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = clienteCadastroSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Verifica se email, CPF ou login já existem
    const [emailExists, cpfExists, loginExists] = await Promise.all([
      AuthService.verificarDisponibilidade('email', data.email, 'cliente'),
      AuthService.verificarDisponibilidade('cpf', data.cpf, 'cliente'),
      AuthService.verificarDisponibilidade('login', data.login, 'cliente'),
    ])

    if (emailExists > 0) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
    }
    if (cpfExists > 0) {
      return NextResponse.json({ error: 'CPF já cadastrado' }, { status: 400 })
    }
    if (loginExists > 0) {
      return NextResponse.json({ error: 'Login já em uso' }, { status: 400 })
    }

    const usuario = await AuthService.createCliente(data)

    return NextResponse.json({
      message: 'Cadastro realizado com sucesso',
      usuario: {
        id: usuario.idUsuario,
        nome: usuario.nomeUsuario,
        email: usuario.emailUsuario,
      },
    })
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}