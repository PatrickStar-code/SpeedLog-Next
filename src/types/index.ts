export type UserRole = 'cliente' | 'motoboy' | 'gerente'

export interface Usuario {
  idUsuario: number
  nomeUsuario: string
  loginUsuario: string
  senhaUsuario: string
  cpfUsuario: string
  cepUsuario: string
  emailUsuario: string
  telefoneUsuario: string
  fotoUsuario: string | null
  criacaoUser: Date
  hashKey: string | null
  hashExpiry: string | null
}

export interface Motoboy {
  idmotoboy: number
  nomeMotoboy: string
  emailMotoboy: string
  criacaoFunc: Date
  fotoMotoboy: string
  cpfMotoboy: string
  telefoneMotoboy: string
  placaMoto: string
  loginMotoboy: string
  senhaMotoboy: string
  cnhMotoboy: string
  cnhFotoMotoboy: string
  contaCorrente: string
  agencia: string
  statusCnhMotoboy: 'Em Analise' | 'Aceito' | 'Negado'
}

export interface Administrador {
  idAdm: number
  loginAdm: string
  senhaAdm: string
  nomeAdm: string
  telefoneAdm: string
  cepAdm: string
  cpfAdm: string
  emailAdm: string
}

export interface Entrega {
  idEntregas: number
  descEntrega: string
  pesoEntrega: number
  complementoEntrega: string | null
  cepOrigemEntrega: string
  numeroOrigemEntrega: number
  bairroOrigem: string | null
  logradouroOrigem: string | null
  cepDestinoEntrega: string
  numeroDestinoEntrega: number
  bairroDestino: string
  logradouroDestino: string
  distanciaKm: string
  tempoTransporteKm: string
  tempoMinutos: number
  valorTotal: number
  valor70p: number
  dataPedido: Date
  statusEntrega: 'Pendente' | 'Motoboy Alocado' | 'Em Transporte' | 'Entregue'
  assinadoPor: string | null
  horaInicioTransporte: Date | null
  horaPrevistoTranporte: Date | null
  motoboyIdmotoboy: number | null
  usuarioIdUsuario: number | null
  motoboy?: Motoboy | null
  usuario?: Usuario | null
}

export interface PrecoPeso {
  id: number
  pesoMin: number
  pesoMax: number
  preco: number
}

export interface PrecoKm {
  idKm: number
  kmRodado: number
  valorKm: number
}

export interface PrecoTempo {
  idTempo: number
  tempoRodado: number
  valorTempo: number
}

export interface FreteCalculado {
  valorPeso: number
  valorDistancia: number
  valorTempo: number
  valorTotal: number
  valor70p: number
}

export interface DashboardStats {
  totais: {
    Clientes: number
    Motoboys: number
    Encomendas: number
    Receita: number
  }
  pedidosPorStatus: {
    'Em Processo': number
    'Em Transporte': number
    Entregue: number
    Pendente: number
  }
  registrosMensais: {
    Cliente: Record<string, number>
    Motoboy: Record<string, number>
  }
  pedidosMensais: Record<string, number>
  receitaMensal: Record<string, number>
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  image?: string
}