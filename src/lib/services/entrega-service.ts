import { prisma } from '@/lib/database/prisma'
import type { Entrega } from '@/types'

export class EntregaService {
  static async criarEntrega(data: {
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
  }) {
    const valor70p = Number((data.valor_total * 0.7).toFixed(2))

    return prisma.entrega.create({
      data: {
        descEntrega: data.desc,
        pesoEntrega: data.peso,
        complementoEntrega: data.complemento,
        cepOrigemEntrega: data.origem,
        numeroOrigemEntrega: data.origem_n,
        bairroOrigem: data.bairro_origem,
        logradouroOrigem: data.log_origem,
        cepDestinoEntrega: data.destino,
        numeroDestinoEntrega: data.destino_n,
        bairroDestino: data.bairro_destino,
        logradouroDestino: data.log_destino,
        distanciaKm: data.distancia,
        tempoTransporteKm: data.tempo_estimado,
        tempoMinutos: data.tempo_mins,
        valorTotal: data.valor_total,
        valor70p,
        statusEntrega: 'Pendente',
        usuarioIdUsuario: data.cod,
      },
      include: {
        usuario: true,
      },
    })
  }

  static async getEntregasByCliente(clienteId: number) {
    return prisma.entrega.findMany({
      where: { usuarioIdUsuario: clienteId },
      include: {
        motoboy: true,
      },
      orderBy: { dataPedido: 'desc' },
    })
  }

  static async getTodasEntregas() {
    return prisma.entrega.findMany({
      include: {
        motoboy: true,
        usuario: true,
      },
      orderBy: { dataPedido: 'desc' },
    })
  }

  static async getEntregasPendentes() {
    return prisma.entrega.findMany({
      where: {
        motoboyIdmotoboy: null,
        statusEntrega: 'Pendente',
      },
      include: {
        usuario: true,
      },
      orderBy: { dataPedido: 'asc' },
    })
  }

  static async getEntregasByMotoboy(motoboyId: number, status?: string) {
    const where: any = { motoboyIdmotoboy: motoboyId }
    if (status) where.statusEntrega = status

    return prisma.entrega.findMany({
      where,
      include: {
        usuario: true,
      },
      orderBy: { dataPedido: 'desc' },
    })
  }

  static async getEntregasAceitasByMotoboy(motoboyId: number) {
    return prisma.entrega.findMany({
      where: {
        motoboyIdmotoboy: motoboyId,
        OR: [
          { statusEntrega: 'Motoboy Alocado' },
          { statusEntrega: 'Em Transporte' },
        ],
      },
      include: {
        usuario: true,
      },
      orderBy: { dataPedido: 'asc' },
    })
  }

  static async getEntregasFinalizadasByMotoboy(motoboyId: number) {
    return prisma.entrega.findMany({
      where: {
        motoboyIdmotoboy: motoboyId,
        statusEntrega: 'Entregue',
      },
      include: {
        usuario: true,
      },
      orderBy: { dataPedido: 'desc' },
    })
  }

  static async getEntregaById(id: number) {
    return prisma.entrega.findUnique({
      where: { idEntregas: id },
      include: {
        motoboy: true,
        usuario: true,
      },
    })
  }

  static async aceitarEntrega(entregaId: number, motoboyId: number) {
    return prisma.entrega.update({
      where: { idEntregas: entregaId },
      data: {
        motoboyIdmotoboy: motoboyId,
        statusEntrega: 'Motoboy Alocado',
      },
    })
  }

  static async recusarEntrega(entregaId: number) {
    return prisma.entrega.update({
      where: { idEntregas: entregaId },
      data: {
        motoboyIdmotoboy: null,
        statusEntrega: 'Pendente',
      },
    })
  }

  static async iniciarTransporte(entregaId: number, motoboyId: number) {
    const entrega = await prisma.entrega.findUnique({
      where: { idEntregas: entregaId },
    })

    if (!entrega) throw new Error('Entrega não encontrada')

    const horaInicio = new Date()
    const horaPrevisto = new Date(horaInicio.getTime() + entrega.tempoMinutos * 60000)

    return prisma.entrega.update({
      where: { idEntregas: entregaId },
      data: {
        statusEntrega: 'Em Transporte',
        horaInicioTransporte: horaInicio,
        horaPrevistoTranporte: horaPrevisto,
      },
    })
  }

  static async finalizarEntrega(entregaId: number, assinatura: string) {
    return prisma.entrega.update({
      where: { idEntregas: entregaId },
      data: {
        statusEntrega: 'Entregue',
        assinadoPor: assinatura,
      },
    })
  }

  static async realocarEntrega(entregaId: number) {
    return prisma.entrega.update({
      where: { idEntregas: entregaId },
      data: {
        motoboyIdmotoboy: null,
        statusEntrega: 'Pendente',
      },
    })
  }

  static async getEstatisticasGerente() {
    const anoAtual = new Date().getFullYear()

    const [totais, pedidosPorStatus, registrosMensais, pedidosMensais, receitaMensal] = await Promise.all([
      // Totais
      Promise.all([
        prisma.usuario.count(),
        prisma.motoboy.count(),
        prisma.entrega.count(),
        prisma.entrega.aggregate({
          where: { dataPedido: { gte: new Date(`${anoAtual}-01-01`) } },
          _sum: { valorTotal: true, valor70p: true },
        }),
      ]),

      // Pedidos por status
      Promise.all([
        prisma.entrega.count({ where: { statusEntrega: 'Motoboy Alocado' } }),
        prisma.entrega.count({ where: { statusEntrega: 'Em Transporte' } }),
        prisma.entrega.count({ where: { statusEntrega: 'Entregue' } }),
        prisma.entrega.count({ where: { statusEntrega: 'Pendente' } }),
      ]),

      // Registros mensais (clientes e motoboys)
      Promise.all(
        Array.from({ length: 12 }, (_, i) => i + 1).map(async (mes) => [
          prisma.usuario.count({
            where: {
              criacaoUser: {
                gte: new Date(`${anoAtual}-${mes.toString().padStart(2, '0')}-01`),
                lt: new Date(`${anoAtual}-${(mes + 1).toString().padStart(2, '0')}-01`),
              },
            },
          }),
          prisma.motoboy.count({
            where: {
              criacaoFunc: {
                gte: new Date(`${anoAtual}-${mes.toString().padStart(2, '0')}-01`),
                lt: new Date(`${anoAtual}-${(mes + 1).toString().padStart(2, '0')}-01`),
              },
            },
          }),
        ])
      ),

      // Pedidos mensais
      Promise.all(
        Array.from({ length: 12 }, (_, i) => i + 1).map(async (mes) =>
          prisma.entrega.count({
            where: {
              dataPedido: {
                gte: new Date(`${anoAtual}-${mes.toString().padStart(2, '0')}-01`),
                lt: new Date(`${anoAtual}-${(mes + 1).toString().padStart(2, '0')}-01`),
              },
            },
          })
        )
      ),

      // Receita mensal (30%)
      Promise.all(
        Array.from({ length: 12 }, (_, i) => i + 1).map(async (mes) => {
          const result = await prisma.entrega.aggregate({
            where: {
              dataPedido: {
                gte: new Date(`${anoAtual}-${mes.toString().padStart(2, '0')}-01`),
                lt: new Date(`${anoAtual}-${(mes + 1).toString().padStart(2, '0')}-01`),
              },
            },
            _sum: { valorTotal: true, valor70p: true },
          })
          return Number((result._sum.valorTotal || 0) - (result._sum.valor70p || 0))
        })
      ),
    ])

    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

    return {
      totais: {
        Clientes: totais[0],
        Motoboys: totais[1],
        Encomendas: totais[2],
        Receita: Number(((totais[3]._sum.valorTotal || 0) - (totais[3]._sum.valor70p || 0)).toFixed(2)),
      },
      pedidosPorStatus: {
        'Em Processo': pedidosPorStatus[0],
        'Em Transporte': pedidosPorStatus[1],
        Entregue: pedidosPorStatus[2],
        Pendente: pedidosPorStatus[3],
      },
      registrosMensais: {
        Cliente: Object.fromEntries(meses.map((m, i) => [m, registrosMensais[i][0]])),
        Motoboy: Object.fromEntries(meses.map((m, i) => [m, registrosMensais[i][1]])),
      },
      pedidosMensais: Object.fromEntries(meses.map((m, i) => [m, pedidosMensais[i]])),
      receitaMensal: Object.fromEntries(meses.map((m, i) => [m, Number(receitaMensal[i].toFixed(2))])),
    }
  }

  static async getTotalEntregasMotoboy(motoboyId: number) {
    const result = await prisma.entrega.aggregate({
      where: {
        motoboyIdmotoboy: motoboyId,
        statusEntrega: 'Entregue',
      },
      _sum: { valor70p: true },
      _count: true,
    })

    return {
      totalEntregas: result._count,
      valorTotal: Number((result._sum.valor70p || 0).toFixed(2)),
    }
  }

  static async getEntregasEmAndamentoMotoboy(motoboyId: number) {
    return prisma.entrega.findMany({
      where: {
        motoboyIdmotoboy: motoboyId,
        statusEntrega: 'Em Transporte',
      },
      include: { usuario: true },
      take: 4,
      orderBy: { horaInicioTransporte: 'asc' },
    })
  }

  static async getContagemPedidosAlocados(motoboyId: number) {
    const [count, sum] = await Promise.all([
      prisma.entrega.count({
        where: {
          motoboyIdmotoboy: motoboyId,
          statusEntrega: 'Motoboy Alocado',
        },
      }),
      prisma.entrega.aggregate({
        where: {
          motoboyIdmotoboy: motoboyId,
          statusEntrega: 'Motoboy Alocado',
        },
        _sum: { valorTotal: true },
      }),
    ])

    return {
      contagem: count,
      preco: Number(((sum._sum.valorTotal || 0) * 0.7).toFixed(2)),
    }
  }
}