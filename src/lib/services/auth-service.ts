import { prisma } from '@/lib/database/prisma'
import bcrypt from 'bcryptjs'
import type { AuthUser, UserRole } from '@/types'

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  static async verifyMd5Password(password: string, md5Hash: string): Promise<boolean> {
    // Para migração: verifica senha MD5 antiga e retorna true se corresponder
    const crypto = await import('crypto')
    const hash = crypto.createHash('md5').update(password).digest('hex')
    return hash === md5Hash
  }

  static async authenticateUser(login: string, password: string, role: UserRole): Promise<AuthUser | null> {
    switch (role) {
      case 'cliente': {
        const usuario = await prisma.usuario.findFirst({
          where: {
            OR: [
              { loginUsuario: login },
              { emailUsuario: login },
            ],
          },
        })

        if (!usuario) return null

        // Tenta bcrypt primeiro, depois MD5 (migração)
        let valid = await this.verifyPassword(password, usuario.senhaUsuario)
        if (!valid) {
          valid = await this.verifyMd5Password(password, usuario.senhaUsuario)
          // Se MD5 funcionou, atualiza para bcrypt
          if (valid) {
            const newHash = await this.hashPassword(password)
            await prisma.usuario.update({
              where: { idUsuario: usuario.idUsuario },
              data: { senhaUsuario: newHash },
            })
          }
        }

        if (!valid) return null

        return {
          id: usuario.idUsuario,
          name: usuario.nomeUsuario,
          email: usuario.emailUsuario,
          role: 'cliente',
          image: usuario.fotoUsuario || undefined,
        }
      }

      case 'motoboy': {
        const motoboy = await prisma.motoboy.findFirst({
          where: {
            OR: [
              { loginMotoboy: login },
              { emailMotoboy: login },
            ],
          },
        })

        if (!motoboy) return null

        // Verifica se CNH foi aprovada
        if (motoboy.statusCnhMotoboy !== 'Aceito') {
          throw new Error('CNH não aprovada. Aguarde análise do gerente.')
        }

        let valid = await this.verifyPassword(password, motoboy.senhaMotoboy)
        if (!valid) {
          valid = await this.verifyMd5Password(password, motoboy.senhaMotoboy)
          if (valid) {
            const newHash = await this.hashPassword(password)
            await prisma.motoboy.update({
              where: { idmotoboy: motoboy.idmotoboy },
              data: { senhaMotoboy: newHash },
            })
          }
        }

        if (!valid) return null

        return {
          id: motoboy.idmotoboy,
          name: motoboy.nomeMotoboy,
          email: motoboy.emailMotoboy,
          role: 'motoboy',
          image: motoboy.fotoMotoboy || undefined,
        }
      }

      case 'gerente': {
        const admin = await prisma.administrador.findFirst({
          where: { loginAdm: login },
        })

        if (!admin) return null

        let valid = await this.verifyPassword(password, admin.senhaAdm)
        if (!valid) {
          valid = await this.verifyMd5Password(password, admin.senhaAdm)
          if (valid) {
            const newHash = await this.hashPassword(password)
            await prisma.administrador.update({
              where: { idAdm: admin.idAdm },
              data: { senhaAdm: newHash },
            })
          }
        }

        if (!valid) return null

        return {
          id: admin.idAdm,
          name: admin.nomeAdm,
          email: admin.emailAdm,
          role: 'gerente',
        }
      }

      default:
        return null
    }
  }

  static async getUserById(id: number, role: UserRole): Promise<AuthUser | null> {
    switch (role) {
      case 'cliente': {
        const usuario = await prisma.usuario.findUnique({ where: { idUsuario: id } })
        if (!usuario) return null
        return {
          id: usuario.idUsuario,
          name: usuario.nomeUsuario,
          email: usuario.emailUsuario,
          role: 'cliente',
          image: usuario.fotoUsuario || undefined,
        }
      }
      case 'motoboy': {
        const motoboy = await prisma.motoboy.findUnique({ where: { idmotoboy: id } })
        if (!motoboy) return null
        return {
          id: motoboy.idmotoboy,
          name: motoboy.nomeMotoboy,
          email: motoboy.emailMotoboy,
          role: 'motoboy',
          image: motoboy.fotoMotoboy || undefined,
        }
      }
      case 'gerente': {
        const admin = await prisma.administrador.findUnique({ where: { idAdm: id } })
        if (!admin) return null
        return {
          id: admin.idAdm,
          name: admin.nomeAdm,
          email: admin.emailAdm,
          role: 'gerente',
        }
      }
      default:
        return null
    }
  }

  static async createCliente(data: {
    nome: string
    telefone: string
    email: string
    cep: string
    cpf: string
    login: string
    senha: string
  }) {
    const hashedPassword = await this.hashPassword(data.senha)

    return prisma.usuario.create({
      data: {
        nomeUsuario: data.nome,
        telefoneUsuario: data.telefone,
        emailUsuario: data.email,
        cepUsuario: data.cep,
        cpfUsuario: data.cpf,
        loginUsuario: data.login,
        senhaUsuario: hashedPassword,
      },
    })
  }

  static async createMotoboy(data: {
    nome: string
    email: string
    fotoMotoboy: string
    cpf: string
    telefone: string
    placa: string
    login: string
    senha: string
    cnh: string
    fotoCnh: string
    conta: string
    agencia: string
  }) {
    const hashedPassword = await this.hashPassword(data.senha)

    return prisma.motoboy.create({
      data: {
        nomeMotoboy: data.nome,
        emailMotoboy: data.email,
        fotoMotoboy: data.fotoMotoboy,
        cpfMotoboy: data.cpf,
        telefoneMotoboy: data.telefone,
        placaMoto: data.placa,
        loginMotoboy: data.login,
        senhaMotoboy: hashedPassword,
        cnhMotoboy: data.cnh,
        cnhFotoMotoboy: data.fotoCnh,
        contaCorrente: data.conta,
        agencia: data.agencia,
        statusCnhMotoboy: 'Em Analise',
      },
    })
  }

  static async verificarDisponibilidade(
    campo: 'cpf' | 'tel' | 'email' | 'login' | 'cnh' | 'conta' | 'placa',
    valor: string,
    role: 'cliente' | 'motoboy'
  ): Promise<number> {
    if (role === 'cliente') {
      switch (campo) {
        case 'cpf':
          return prisma.usuario.count({ where: { cpfUsuario: valor } })
        case 'tel':
          return prisma.usuario.count({ where: { telefoneUsuario: valor } })
        case 'email':
          return prisma.usuario.count({ where: { emailUsuario: valor } })
        case 'login':
          return prisma.usuario.count({ where: { loginUsuario: valor } })
        default:
          return 0
      }
    } else {
      switch (campo) {
        case 'cpf':
          return prisma.motoboy.count({ where: { cpfMotoboy: valor } })
        case 'tel':
          return prisma.motoboy.count({ where: { telefoneMotoboy: valor } })
        case 'email':
          return prisma.motoboy.count({ where: { emailMotoboy: valor } })
        case 'login':
          return prisma.motoboy.count({ where: { loginMotoboy: valor } })
        case 'cnh':
          return prisma.motoboy.count({ where: { cnhMotoboy: valor } })
        case 'conta':
          return prisma.motoboy.count({ where: { contaCorrente: valor } })
        case 'placa':
          return prisma.motoboy.count({ where: { placaMoto: valor } })
        default:
          return 0
      }
    }
  }

  static async solicitarRecuperacaoSenha(email: string) {
    const usuario = await prisma.usuario.findUnique({ where: { emailUsuario: email } })
    if (!usuario) return null

    const crypto = await import('crypto')
    const hashKey = crypto.randomBytes(32).toString('hex')
    const hashExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    await prisma.usuario.update({
      where: { idUsuario: usuario.idUsuario },
      data: { hashKey, hashExpiry },
    })

    return { usuario, hashKey, hashExpiry }
  }

  static async validarHashRecuperacao(hash: string) {
    const usuario = await prisma.usuario.findFirst({ where: { hashKey: hash } })
    if (!usuario) return null

    if (usuario.hashExpiry && new Date(usuario.hashExpiry) < new Date()) {
      return { usuario, expired: true }
    }

    return { usuario, expired: false }
  }

  static async redefinirSenha(email: string, novaSenha: string) {
    const hashedPassword = await this.hashPassword(novaSenha)
    return prisma.usuario.update({
      where: { emailUsuario: email },
      data: {
        senhaUsuario: hashedPassword,
        hashKey: null,
        hashExpiry: null,
      },
    })
  }

  static async atualizarPerfilCliente(id: number, data: {
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
}