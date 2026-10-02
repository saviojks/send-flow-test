const PHONE_PATTERN = /^\+?\d{8,15}$/

export const normalizePhone = (raw: string): string => {
  const trimmed = raw
  const digits = trimmed.replace(/\D/g, '')
  return trimmed.startsWith('+') ? `+${digits}` : digits
}

export const isValidPhone = (raw: string): boolean => PHONE_PATTERN.test(normalizePhone(raw))

const formatBrazilianLocal = (digits: string): string =>
  digits.length === 11
    ? `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    : `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`

export const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '')
  if (phone.startsWith('+55') && (digits.length === 12 || digits.length === 13)) {
    return `+55 ${formatBrazilianLocal(digits.slice(2))}`
  }
  if (!phone.startsWith('+') && (digits.length === 10 || digits.length === 11)) {
    return formatBrazilianLocal(digits)
  }
  return phone
}
