import { prisma } from '@/lib/database/prisma'
import type { FreteCalculado } from '@/types'

export class FreteService {
  /**
   * Calcula o valor baseado no peso da encomenda
   * Replica a lógica exata do model_user->gerar_valor_peso
   * Consulta preco_peso onde peso_min <= peso <= peso_max
   */
  static async calcularValorPeso(peso: number): Promise<number> {
    if (peso > 12) return 0

    const preco = await prisma.precoPeso.findFirst({
      where: {
        pesoMin: { lte: peso },
        pesoMax: { gte: peso },
      },
    })

    return preco ? Number(preco.preco) : 0
  }

  /**
   * Calcula o valor baseado na distância
   * Replica a lógica exata do model_user->gerar_valor_distancia
   * Consulta preco_km onde km_rodado <= distancia ORDER BY km_rodado DESC LIMIT 1
   */
  static async calcularValorDistancia(distanciaKm: number): Promise<number> {
    const preco = await prisma.precoKm.findFirst({
      where: {
        kmRodado: { lte: distanciaKm },
      },
      orderBy: {
        kmRodado: 'desc',
      },
    })

    return preco ? Number(preco.valorKm) * distanciaKm : 0
  }

  /**
   * Calcula o valor baseado no tempo
   * Replica a lógica exata do model_user->gerar_valor_tempo
   * Consulta preco_tempo onde tempo_rodado <= tempo ORDER BY tempo_rodado DESC LIMIT 1
   */
  static async calcularValorTempo(tempoMinutos: number): Promise<number> {
    const preco = await prisma.precoTempo.findFirst({
      where: {
        tempoRodado: { lte: tempoMinutos },
      },
      orderBy: {
        tempoRodado: 'desc',
      },
    })

    return preco ? Number(preco.valorTempo) * tempoMinutos : 0
  }

  /**
   * Calcula o frete completo (peso + distância + tempo)
   * Retorna o valor total e o valor de 70% para o motoboy
   */
  static async calcularFreteCompleto(
    peso: number,
    distanciaKm: number,
    tempoMinutos: number
  ): Promise<FreteCalculado> {
    const [valorPeso, valorDistancia, valorTempo] = await Promise.all([
      this.calcularValorPeso(peso),
      this.calcularValorDistancia(distanciaKm),
      this.calcularValorTempo(tempoMinutos),
    ])

    const valorTotal = valorPeso + valorDistancia + valorTempo
    const valor70p = Number((valorTotal * 0.7).toFixed(2))

    return {
      valorPeso,
      valorDistancia,
      valorTempo,
      valorTotal: Number(valorTotal.toFixed(2)),
      valor70p,
    }
  }

  /**
   * Busca todas as tabelas de preço para exibição no admin
   */
  static async getTabelasPreco() {
    const [pesos, kms, tempos] = await Promise.all([
      prisma.precoPeso.findMany({ orderBy: { pesoMin: 'asc' } }),
      prisma.precoKm.findMany({ orderBy: { kmRodado: 'asc' } }),
      prisma.precoTempo.findMany({ orderBy: { tempoRodado: 'asc' } }),
    ])

    return {
      pesos: pesos.map((p: { id: number; pesoMin: any; pesoMax: any; preco: any }) => ({
        id: p.id,
        pesoMin: Number(p.pesoMin),
        pesoMax: Number(p.pesoMax),
        preco: Number(p.preco),
      })),
      kms: kms.map((k: { idKm: number; kmRodado: number; valorKm: any }) => ({
        idKm: k.idKm,
        kmRodado: k.kmRodado,
        valorKm: Number(k.valorKm),
      })),
      tempos: tempos.map((t: { idTempo: number; tempoRodado: number; valorTempo: any }) => ({
        idTempo: t.idTempo,
        tempoRodado: t.tempoRodado,
        valorTempo: Number(t.valorTempo),
      })),
    }
  }

  /**
   * Atualiza ou cria faixa de preço por peso
   */
  static async upsertPrecoPeso(id: number | null, pesoMin: number, pesoMax: number, preco: number) {
    if (id) {
      return prisma.precoPeso.update({
        where: { id },
        data: { pesoMin, pesoMax, preco },
      })
    }
    return prisma.precoPeso.create({ data: { pesoMin, pesoMax, preco } })
  }

  /**
   * Atualiza ou cria preço por km
   */
  static async upsertPrecoKm(idKm: number | null, kmRodado: number, valorKm: number) {
    if (idKm) {
      return prisma.precoKm.update({
        where: { idKm },
        data: { kmRodado, valorKm },
      })
    }
    return prisma.precoKm.create({ data: { kmRodado, valorKm } })
  }

  /**
   * Atualiza ou cria preço por tempo
   */
  static async upsertPrecoTempo(idTempo: number | null, tempoRodado: number, valorTempo: number) {
    if (idTempo) {
      return prisma.precoTempo.update({
        where: { idTempo },
        data: { tempoRodado, valorTempo },
      })
    }
    return prisma.precoTempo.create({ data: { tempoRodado, valorTempo } })
  }

  /**
   * Deleta faixa de preço por peso
   */
  static async deletePrecoPeso(id: number) {
    return prisma.precoPeso.delete({ where: { id } })
  }

  /**
   * Deleta preço por km
   */
  static async deletePrecoKm(idKm: number) {
    return prisma.precoKm.delete({ where: { idKm } })
  }

  /**
   * Deleta preço por tempo
   */
  static async deletePrecoTempo(idTempo: number) {
    return prisma.precoTempo.delete({ where: { idTempo } })
  }
}