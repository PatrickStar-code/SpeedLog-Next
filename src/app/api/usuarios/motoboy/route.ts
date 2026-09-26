import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/auth-service'
import { motoboyCadastroSchema } from '@/lib/validations/schemas'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form data
    const data = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string,
      cpf: formData.get('cpf') as string,
      telefone: formData.get('telefone') as string,
      placa: formData.get('placa') as string,
      login: formData.get('login') as string,
      senha: formData.get('senha') as string,
      cnh: formData.get('cnh') as string,
      conta: formData.get('conta') as string,
      agencia: formData.get('agencia') as string,
      fotoMotoboy: formData.get('fotoMotoboy') as File | null,
      fotoCnh: formData.get('fotoCnh') as File | null,
    }

    const parsed = motoboyCadastroSchema.safeParse(data)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const validatedData = parsed.data

    // Verifica disponibilidade
    const [emailExists, cpfExists, loginExists, cnhExists, contaExists, placaExists] = await Promise.all([
      AuthService.verificarDisponibilidade('email', validatedData.email, 'motoboy'),
      AuthService.verificarDisponibilidade('cpf', validatedData.cpf, 'motoboy'),
      AuthService.verificarDisponibilidade('login', validatedData.login, 'motoboy'),
      AuthService.verificarDisponibilidade('cnh', validatedData.cnh, 'motoboy'),
      AuthService.verificarDisponibilidade('conta', validatedData.conta, 'motoboy'),
      AuthService.verificarDisponibilidade('placa', validatedData.placa, 'motoboy'),
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
    if (cnhExists > 0) {
      return NextResponse.json({ error: 'CNH já cadastrada' }, { status: 400 })
    }
    if (contaExists > 0) {
      return NextResponse.json({ error: 'Conta corrente já cadastrada' }, { status: 400 })
    }
    if (placaExists > 0) {
      return NextResponse.json({ error: 'Placa já cadastrada' }, { status: 400 })
    }

    // TODO: Handle file uploads - for now using placeholder names
    const fotoMotoboyName = 'foto_motoboy_placeholder.png'
    const fotoCnhName = 'cnh_placeholder.jpg'

    const motoboy = await AuthService.createMotoboy({
      ...validatedData,
      fotoMotoboy: fotoMotoboyName,
      fotoCnh: fotoCnhName,
    })

    return NextResponse.json({
      message: 'Cadastro realizado com sucesso. Aguarde aprovação da CNH.',
      motoboy: {
        id: motoboy.idmotoboy,
        nome: motoboy.nomeMotoboy,
        email: motoboy.emailMotoboy,
        statusCnh: motoboy.statusCnhMotoboy,
      },
    })
  } catch (error) {
    console.error('Erro ao cadastrar motoboy:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}