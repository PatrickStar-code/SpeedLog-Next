import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Pendente':
      return 'bg-yellow-100 text-yellow-800'
    case 'Motoboy Alocado':
      return 'bg-blue-100 text-blue-800'
    case 'Em Transporte':
      return 'bg-purple-100 text-purple-800'
    case 'Entregue':
      return 'bg-green-100 text-green-800'
    case 'Em Analise':
      return 'bg-orange-100 text-orange-800'
    case 'Aceito':
      return 'bg-green-100 text-green-800'
    case 'Negado':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getCnhStatusColor(status: string): string {
  switch (status) {
    case 'Em Analise':
      return 'bg-orange-100 text-orange-800'
    case 'Aceito':
      return 'bg-green-100 text-green-800'
    case 'Negado':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function parseCep(cep: string): string {
  return cep.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

export function parseCpf(cpf: string): string {
  return cpf.replace(/\D/g, '').replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

export function parseTelefone(tel: string): string {
  return tel.replace(/\D/g, '').replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3')
}

export function parsePlaca(placa: string): string {
  return placa.toUpperCase().replace(/[^A-Z0-9]/g, '')
}