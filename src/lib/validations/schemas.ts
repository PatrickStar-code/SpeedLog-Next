import { z } from 'zod'

export const loginSchema = z.object({
  login: z.string().min(1, 'Login ou email é obrigatório'),
  senha: z.string().min(1, 'Senha é obrigatória'),
})

export const clienteCadastroSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  cep: z.string().min(8, 'CEP inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  login: z.string().min(3, 'Login deve ter pelo menos 3 caracteres'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const clienteEditarSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  cep: z.string().min(8, 'CEP inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
})

export const recuperacaoSenhaSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const novaSenhaSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  hash: z.string().min(1, 'Hash inválido'),
})

export const motoboyCadastroSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  placa: z.string().min(1, 'Placa da moto é obrigatória'),
  login: z.string().min(3, 'Login deve ter pelo menos 3 caracteres'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  cnh: z.string().min(11, 'CNH inválida'),
  conta: z.string().min(1, 'Conta corrente é obrigatória'),
  agencia: z.string().min(1, 'Agência é obrigatória'),
})

export const motoboyEditarSchema = z.object({
  id: z.number(),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().min(11, 'CPF inválido'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  placa: z.string().min(1, 'Placa da moto é obrigatória'),
  cnh: z.string().min(11, 'CNH inválida'),
  conta: z.string().min(1, 'Conta corrente é obrigatória'),
  agencia: z.string().min(1, 'Agência é obrigatória'),
})

export const encomendaSchema = z.object({
  desc: z.string().min(1, 'Descrição é obrigatória'),
  peso: z.number().positive('Peso deve ser maior que zero').max(12, 'Peso máximo é 12kg'),
  complemento: z.string().optional(),
  origem: z.string().min(8, 'CEP de origem inválido'),
  origem_n: z.number().positive('Número de origem inválido'),
  bairro_origem: z.string().min(1, 'Bairro de origem é obrigatório'),
  log_origem: z.string().min(1, 'Logradouro de origem é obrigatório'),
  destino: z.string().min(8, 'CEP de destino inválido'),
  destino_n: z.number().positive('Número de destino inválido'),
  bairro_destino: z.string().min(1, 'Bairro de destino é obrigatório'),
  log_destino: z.string().min(1, 'Logradouro de destino é obrigatório'),
  distancia: z.string().min(1, 'Distância é obrigatória'),
  tempo_estimado: z.string().min(1, 'Tempo estimado é obrigatório'),
  valor_total: z.number().positive('Valor total inválido'),
  cod: z.number().positive('Código do cliente inválido'),
  tempo_mins: z.number().positive('Tempo em minutos inválido'),
})

export const verificarDisponibilidadeSchema = z.object({
  item: z.enum(['cpf', 'tel', 'email', 'login', 'cnh', 'conta', 'placa']),
  verificar: z.string().min(1, 'Valor a verificar é obrigatório'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ClienteCadastroInput = z.infer<typeof clienteCadastroSchema>
export type ClienteEditarInput = z.infer<typeof clienteEditarSchema>
export type RecuperacaoSenhaInput = z.infer<typeof recuperacaoSenhaSchema>
export type NovaSenhaInput = z.infer<typeof novaSenhaSchema>
export type MotoboyCadastroInput = z.infer<typeof motoboyCadastroSchema>
export type MotoboyEditarInput = z.infer<typeof motoboyEditarSchema>
export type EncomendaInput = z.infer<typeof encomendaSchema>
export type VerificarDisponibilidadeInput = z.infer<typeof verificarDisponibilidadeSchema>