import { prisma } from '@/lib/database/prisma'
import { AuthService } from './auth-service'
import type { Usuario, Motoboy } from '@/types'

export class UsuarioService {
  static async getById(id: number) {
    return prisma.usuario.findUnique({
      where: { idUsuario: id },
    })
  }

  static async getAll() {
    return prisma.usuario.findMany({
      orderBy: { criacaoUser: 'desc' },
    })
  }

  static async updatePerfil(id: number, data: {
    nome?: string
    email?: string
    cep?: string
    telefone?: string
    foto?: string
  }) {
    return prisma.usuario.update({
      where: { idUsuario: id },
      data: {
        nomeUsuario: data.nome,
        emailUsuario: data.email,
        cepUsuario: data.cep,
        telefoneUsuario: data.telefone,
        fotoUsuario: data.foto,
      },
    })
  }

  static async updateByAdmin(id: number, data: Partial<Usuario>) {
    return prisma.usuario.update({
      where: { idUsuario: id },
      data,
    })
  }

  static async delete(id: number) {
    return prisma.usuario.delete({ where: { idUsuario: id } })
  }

  static async getTotalEntregas(id: number) {
    const result = await prisma.entrega.count({
      where: { usuarioIdUsuario: id },
    })
    return { Pedidos: result }
  }
}

export class MotoboyService {
  static async getById(id: number) {
    return prisma.motoboy.findUnique({
      where: { idmotoboy: id },
    })
  }

  static async getAll(includeNegados = false) {
    return prisma.motoboy.findMany({
      where: includeNegados ? {} : { statusCnhMotoboy: { not: 'Negado' } },
      orderBy: { criacaoFunc: 'desc' },
    })
  }

  static async getByCnhStatus(status: 'Em Analise' | 'Aceito' | 'Negado') {
    return prisma.motoboy.findMany({
      where: { statusCnhMotoboy: status },
      orderBy: { criacaoFunc: 'desc' },
    })
  }

  static async updateByAdmin(id: number, data: {
    nome?: string
    cpf?: string
    email?: string
    telefone?: string
    placa?: string
    cnh?: string
    conta?: string
    agencia?: string
    fotoMotoboy?: string
    fotoCnh?: string
  }) {
    return prisma.motoboy.update({
      where: { idmotoboy: id },
      data: {
        nomeMotoboy: data.nome,
        cpfMotoboy: data.cpf,
        emailMotoboy: data.email,
        telefoneMotoboy: data.telefone,
        placaMoto: data.placa,
        cnhMotoboy: data.cnh,
        contaCorrente: data.conta,
        agencia: data.agencia,
        fotoMotoboy: data.fotoMotoboy,
        cnhFotoMotoboy: data.fotoCnh,
      },
    })
  }

  static async aprovarCnh(id: number) {
    const motoboy = await prisma.motoboy.update({
      where: { idmotoboy: id },
      data: { statusCnhMotoboy: 'Aceito' },
    })
    return motoboy
  }

  static async negarCnh(id: number) {
    const motoboy = await prisma.motoboy.update({
      where: { idmotoboy: id },
      data: { statusCnhMotoboy: 'Negado' },
    })
    return motoboy
  }

  static async getPedidosRealizados(id: number) {
    const result = await prisma.entrega.count({
      where: {
        motoboyIdmotoboy: id,
        statusEntrega: 'Entregue',
      },
    })
    return { FEITOS: result }
  }
}