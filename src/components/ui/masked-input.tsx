'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/helpers'

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur'> {
  mask: string
  label: string
  error?: string
  id: string
  name: string
  onChange?: (value: string) => void
  onBlur?: (value: string) => void
}

export function MaskedInput({
  mask,
  label,
  error,
  id,
  name,
  className,
  disabled,
  required,
  placeholder,
  onChange,
  onBlur,
  value,
  ...props
}: MaskedInputProps) {
  const [inputValue, setInputValue] = React.useState(value || '')

  // Token definitions
  const TOKEN_PATTERNS: Record<string, RegExp> = {
    '9': /[0-9]/,
    'a': /[a-zA-Z]/,
    '*': /[a-zA-Z0-9]/,
  }

  // Check if a mask character is a token (placeholder)
  const isToken = (char: string): boolean => char in TOKEN_PATTERNS

  // Apply mask to raw value (user input without formatting)
  const applyMask = React.useCallback((rawValue: string): string => {
    if (!rawValue) return ''
    
    let result = ''
    let rawIndex = 0
    
    for (let i = 0; i < mask.length; i++) {
      const maskChar = mask[i]
      
      if (isToken(maskChar)) {
        // Find next valid character for this token
        const pattern = TOKEN_PATTERNS[maskChar]
        while (rawIndex < rawValue.length && !pattern.test(rawValue[rawIndex])) {
          rawIndex++
        }
        if (rawIndex < rawValue.length) {
          result += rawValue[rawIndex].toUpperCase()
          rawIndex++
        } else {
          // No more raw input - stop adding tokens, but continue for literals
          break
        }
      } else {
        // Literal character (like -, ., /, etc.)
        // Only add if we have already added some tokens before it
        // or if there are tokens after it that have been filled
        const hasPreviousTokens = result.length > 0
        const hasFutureTokens = Array.from(mask.slice(i + 1)).some(isToken)
        
        if (hasPreviousTokens || (hasFutureTokens && rawIndex > 0)) {
          result += maskChar
        }
      }
    }
    
    return result
  }, [mask])

  // Extract raw value from masked input (for form submission)
  const getRawValue = React.useCallback((maskedValue: string): string => {
    let result = ''
    for (let i = 0; i < maskedValue.length && i < mask.length; i++) {
      const maskChar = mask[i]
      if (isToken(maskChar)) {
        const pattern = TOKEN_PATTERNS[maskChar]
        if (pattern.test(maskedValue[i])) {
          result += maskedValue[i]
        }
      }
    }
    return result
  }, [mask])

  // Handle user input
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value.replace(/[^a-zA-Z0-9]/g, '') // Strip non-alphanumeric
    const masked = applyMask(rawInput)
    setInputValue(masked)
    onChange?.(getRawValue(masked))
  }, [applyMask, getRawValue, onChange])

  // Handle blur - send raw value
  const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(getRawValue(e.target.value))
  }, [getRawValue, onBlur])

  // Sync with external value changes
  React.useEffect(() => {
    if (value !== undefined && String(value) !== inputValue) {
      const cleanValue = String(value).replace(/[^a-zA-Z0-9]/g, '')
      setInputValue(applyMask(cleanValue))
    }
  }, [value, applyMask])

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={name}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        style={{ textTransform: 'uppercase' }}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * PlacaInput - Componente especializado para placas de veículos brasileiros
 * 
 * Suporta ambos os formatos válidos no Brasil (carros e motos - MESMO padrão):
 * 
 * 1. PLACA ANTIGA (até 2018, ainda válida se não transferida):
 *    - Formato: AAA-9999 (3 letras + 4 números)
 *    - Usada em carros e motos
 * 
 * 2. PLACA MERCOSUL (padrão desde 2018, obrigatório para novos registros):
 *    - Formato: AAA-9A99 (3 letras + 1 número + 1 letra + 2 números)
 *    - Padrão ÚNICO para TODOS os veículos: carros, motos, caminhões, ônibus
 *    - Cores: Preto (particular), Vermelho (comercial), Verde (oficial), Azul (diplomático)
 * 
 * Detecção automática:
 * - Se o 5º caractere (índice 4) for LETRA → Formato Mercosul
 * - Se o 5º caractere for NÚMERO → Formato Antigo
 */
export function PlacaInput(props: Omit<MaskedInputProps, 'mask'>) {
  const [rawValue, setRawValue] = React.useState('')

  // Sync external value prop to internal state
  React.useEffect(() => {
    if (props.value !== undefined) {
      const clean = String(props.value).replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
      if (clean !== rawValue) {
        setRawValue(clean)
      }
    }
  }, [props.value, rawValue])

  const handleChange = React.useCallback((value: string) => {
    // Aceita apenas alfanuméricos, converte para uppercase
    const clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    setRawValue(clean)
    props.onChange?.(clean)
  }, [props.onChange])

  const handleBlur = React.useCallback((value: string) => {
    props.onBlur?.(value)
  }, [props.onBlur])

  // Determina a máscara baseada no valor digitado
  // Lógica: verifica o 5º caractere (índice 4) para decidir o formato
  const getMask = (val: string): string => {
    if (val.length <= 3) return 'AAA'
    if (val.length === 4) return 'AAA-9'
    if (val.length === 5) {
      // 5º caractere define o formato
      return /[A-Z]/.test(val[4]) ? 'AAA-9A' : 'AAA-99'
    }
    if (val.length === 6) {
      const isMercosul = /[A-Z]/.test(val[4])
      return isMercosul ? 'AAA-9A9' : 'AAA-999'
    }
    // Comprimento total (7 caracteres alfanuméricos)
    const isMercosul = /[A-Z]/.test(val[4])
    return isMercosul ? 'AAA-9A99' : 'AAA-9999'
  }

  // Aplica a máscara para exibição - NÃO rejeita caracteres, só formata
  const applyMask = (val: string): string => {
    if (!val) return ''
    
    const mask = getMask(val)
    let result = ''
    let valIdx = 0
    
    for (let i = 0; i < mask.length && valIdx < val.length; i++) {
      const maskChar = mask[i]
      
      if (maskChar === '-' || maskChar === '.' || maskChar === '/' || maskChar === ' ' || maskChar === '(' || maskChar === ')') {
        // Literal characters - add them if we have content before
        if (result.length > 0) {
          result += maskChar
        }
      } else {
        // Token position - add next character from raw value (any alphanumeric)
        if (valIdx < val.length) {
          result += val[valIdx].toUpperCase()
          valIdx++
        }
      }
    }
    
    // If we have remaining characters but mask ended, append them (shouldn't happen with maxLength)
    if (valIdx < val.length) {
      result += val.slice(valIdx).toUpperCase()
    }
    
    return result
  }

  const displayValue = applyMask(rawValue)

  return (
    <div className="space-y-2">
      <label htmlFor={props.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {props.label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={props.id}
        name={props.name}
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={(e) => handleBlur(getRawValue(e.target.value))}
        disabled={props.disabled}
        required={props.required}
        placeholder={props.placeholder}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          props.error && 'border-red-500 focus-visible:ring-red-500',
          props.className
        )}
        aria-invalid={props.error ? 'true' : 'false'}
        aria-describedby={props.error ? `${props.id}-error` : undefined}
        style={{ textTransform: 'uppercase' }}
        maxLength={8} // AAA-9A99 = 8 chars com hífen
      />
      {props.error && (
        <p id={`${props.id}-error`} className="text-sm text-red-600" role="alert">
          {props.error}
        </p>
      )}
      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        Formatos aceitos: AAA-9999 (antiga) ou AAA-9A99 (Mercosul)
      </p>
    </div>
  )
}

function getRawValue(maskedValue: string): string {
  return maskedValue.replace(/[^a-zA-Z0-9]/g, '')
}

export const MASKS = {
  cpf: '999.999.999-99',
  cnpj: '99.999.999/9999-99',
  cep: '99999-999',
  telefone: '(99) 99999-9999',
  telefoneFixo: '(99) 9999-9999',
  celular: '(99) 99999-9999',
  // Placa: use PlacaInput component (detecção automática antigo/Mercosul)
  placa: 'AAA-9999',
  placaMercosul: 'AAA-9A99',
  cnh: '99999999999',
  cartao: '9999 9999 9999 9999',
  validadeCartao: '99/99',
  cvv: '999',
  data: '99/99/9999',
  hora: '99:99',
  numeros: '9',
  decimal: '9.99',
} as const