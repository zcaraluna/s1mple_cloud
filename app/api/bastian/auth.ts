/**
 * Utilidades de autenticación y seguridad para la API
 */

// Token de autenticación - DEBE ser cambiado en producción
// Genera un token seguro: openssl rand -hex 32
const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || 'CHANGE_THIS_TOKEN_IN_PRODUCTION'

// Rate limiting simple en memoria
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Configuración de rate limiting
const RATE_LIMIT = {
  // Límite de peticiones por ventana de tiempo
  POST: { max: 10, windowMs: 60 * 1000 }, // 10 peticiones por minuto
  DELETE: { max: 5, windowMs: 60 * 1000 }, // 5 peticiones por minuto
  GET: { max: 60, windowMs: 60 * 1000 }, // 60 peticiones por minuto
}

/**
 * Verifica el token de autenticación
 */
export function verifyAuthToken(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader) {
    return false
  }

  // Formato esperado: "Bearer <token>"
  const token = authHeader.replace('Bearer ', '')
  return token === ADMIN_TOKEN
}

/**
 * Verifica rate limiting por IP
 */
export function checkRateLimit(
  ip: string,
  method: 'GET' | 'POST' | 'DELETE'
): { allowed: boolean; remaining: number; resetTime: number } {
  const config = RATE_LIMIT[method]
  const now = Date.now()
  const key = `${ip}:${method}`

  let entry = rateLimitStore.get(key)

  // Si no existe entrada o la ventana expiró, crear nueva
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    }
    rateLimitStore.set(key, entry)
  }

  // Incrementar contador
  entry.count++

  // Limpiar entradas expiradas periódicamente (cada 100 peticiones)
  if (rateLimitStore.size > 100) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetTime) {
        rateLimitStore.delete(k)
      }
    }
  }

  const remaining = Math.max(0, config.max - entry.count)
  const allowed = entry.count <= config.max

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  }
}

/**
 * Obtiene la IP del cliente
 */
export function getClientIP(request: Request): string {
  // Intentar obtener IP de headers de proxy
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback (no debería llegar aquí en producción con proxy)
  return 'unknown'
}

/**
 * Sanitiza una cadena de texto
 */
export function sanitizeString(input: string, maxLength: number = 200): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Trim y limitar longitud
  let sanitized = input.trim().slice(0, maxLength)

  // Remover caracteres de control y potencialmente peligrosos
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '')
  
  // Remover caracteres que podrían usarse para inyección
  sanitized = sanitized.replace(/[<>\"'`]/g, '')

  return sanitized
}

/**
 * Valida formato de teléfono (básico)
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false
  }

  // Permitir números, espacios, guiones, paréntesis y +
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  const sanitized = phone.trim()
  
  // Longitud razonable (mínimo 5, máximo 20 caracteres)
  if (sanitized.length < 5 || sanitized.length > 20) {
    return false
  }

  return phoneRegex.test(sanitized)
}

/**
 * Valida formato de nombre
 */
export function validateName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false
  }

  const sanitized = name.trim()
  
  // Longitud razonable (mínimo 2, máximo 100 caracteres)
  if (sanitized.length < 2 || sanitized.length > 100) {
    return false
  }

  // Permitir letras, espacios, acentos y algunos caracteres especiales comunes
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\.\-']+$/
  return nameRegex.test(sanitized)
}

