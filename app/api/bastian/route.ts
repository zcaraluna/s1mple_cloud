import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import {
  verifyAuthToken,
  checkRateLimit,
  getClientIP,
  sanitizeString,
  validatePhone,
  validateName,
} from './auth'

const DATA_FILE = path.join(process.cwd(), 'data', 'bastian_bets.json')

// Límites de seguridad
const MAX_BETS = 10000 // Máximo número de apuestas permitidas
const MAX_NAME_LENGTH = 100
const MAX_PHONE_LENGTH = 20

interface Bet {
  id: string
  name: string
  phone: string
  date: string // Formato: YYYY-MM-DD
  timestamp: number
}

// Asegurar que el directorio existe
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Leer apuestas desde el archivo
async function readBets(): Promise<Bet[]> {
  try {
    await ensureDataDir()
    const fileContents = await fs.readFile(DATA_FILE, 'utf8')
    
    // Validar tamaño del archivo (máximo 10MB)
    if (fileContents.length > 10 * 1024 * 1024) {
      throw new Error('Archivo de datos demasiado grande')
    }
    
    const bets = JSON.parse(fileContents)
    
    // Validar que sea un array
    if (!Array.isArray(bets)) {
      console.error('Archivo de datos corrupto: no es un array')
      return []
    }
    
    // Validar estructura de cada apuesta
    return bets.filter((bet: any) => {
      return (
        bet &&
        typeof bet === 'object' &&
        typeof bet.id === 'string' &&
        typeof bet.name === 'string' &&
        typeof bet.phone === 'string' &&
        typeof bet.date === 'string' &&
        typeof bet.timestamp === 'number'
      )
    })
  } catch (error: any) {
    // Si el archivo no existe, retornar array vacío
    if (error.code === 'ENOENT') {
      return []
    }
    // Si hay error de parseo, loguear y retornar array vacío
    if (error instanceof SyntaxError) {
      console.error('Error parseando archivo JSON:', error)
      return []
    }
    throw error
  }
}

// Escribir apuestas al archivo
async function writeBets(bets: Bet[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(bets, null, 2), 'utf8')
}

// Obtener fecha actual en zona horaria de Paraguay (America/Asuncion, UTC-4)
function getTodayInParaguay(): Date {
  // Obtener fecha/hora actual en Paraguay
  const now = new Date()
  const paraguayOffset = -4 * 60 // UTC-4 en minutos
  const localOffset = now.getTimezoneOffset() // offset local en minutos
  const paraguayTime = new Date(now.getTime() + (localOffset - paraguayOffset) * 60 * 1000)
  return paraguayTime
}

// Crear fecha desde string YYYY-MM-DD en zona horaria de Paraguay
function createDateInParaguay(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  // Crear fecha en hora local (sin conversión UTC)
  // Usar mediodía (12:00) para evitar problemas con cambios de hora (DST)
  const date = new Date(year, month - 1, day, 12, 0, 0)
  return date
}

// Comparar solo la parte de fecha (sin hora) en zona horaria de Paraguay
function compareDatesOnly(date1: Date, date2: Date): number {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
  return d1.getTime() - d2.getTime()
}

// GET - Obtener todas las apuestas
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, 'GET')
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas peticiones. Intenta más tarde.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
            'Retry-After': '60',
          },
        }
      )
    }

    const bets = await readBets()
    // Ordenar por fecha (timestamp)
    bets.sort((a, b) => a.timestamp - b.timestamp)
    
    return NextResponse.json(bets, {
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      },
    })
  } catch (error) {
    console.error('Error leyendo apuestas:', error)
    return NextResponse.json(
      { error: 'Error al leer las apuestas' },
      { status: 500 }
    )
  }
}

// POST - Agregar una nueva apuesta
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, 'POST')
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas peticiones. Intenta más tarde.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
            'Retry-After': '60',
          },
        }
      )
    }

    // Validar Content-Type
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type debe ser application/json' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, phone, date } = body

    // Validaciones básicas
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json(
        { error: 'El número de teléfono es requerido' },
        { status: 400 }
      )
    }

    if (!date || typeof date !== 'string') {
      return NextResponse.json(
        { error: 'La fecha es requerida' },
        { status: 400 }
      )
    }

    // Sanitizar y validar nombre
    const sanitizedName = sanitizeString(name, MAX_NAME_LENGTH)
    if (!validateName(sanitizedName)) {
      return NextResponse.json(
        { error: 'Nombre inválido. Solo se permiten letras, espacios y caracteres comunes.' },
        { status: 400 }
      )
    }

    // Sanitizar y validar teléfono
    const sanitizedPhone = sanitizeString(phone, MAX_PHONE_LENGTH)
    if (!validatePhone(sanitizedPhone)) {
      return NextResponse.json(
        { error: 'Número de teléfono inválido' },
        { status: 400 }
      )
    }

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Validar que la fecha no sea en el pasado (en zona horaria de Paraguay)
    const selectedDate = createDateInParaguay(date)
    const today = getTodayInParaguay()
    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)

    if (compareDatesOnly(selectedDate, today) < 0) {
      return NextResponse.json(
        { error: 'La fecha debe ser hoy o en el futuro' },
        { status: 400 }
      )
    }

    const bets = await readBets()

    // Verificar límite de apuestas
    if (bets.length >= MAX_BETS) {
      return NextResponse.json(
        { error: 'Se ha alcanzado el límite máximo de apuestas' },
        { status: 503 }
      )
    }

    // Verificar si ya existe una apuesta con este nombre
    if (bets.some(bet => bet.name.toLowerCase().trim() === sanitizedName.toLowerCase().trim())) {
      return NextResponse.json(
        { error: 'Ya existe una apuesta con este nombre' },
        { status: 400 }
      )
    }

    // Verificar si ya existe una apuesta con este número de teléfono
    if (bets.some(bet => bet.phone.trim() === sanitizedPhone.trim())) {
      return NextResponse.json(
        { error: 'Ya existe una predicción con este número de teléfono' },
        { status: 400 }
      )
    }

    // Crear nueva apuesta
    selectedDate.setHours(0, 0, 0, 0)
    const newBet: Bet = {
      id: Date.now().toString(),
      name: sanitizedName,
      phone: sanitizedPhone,
      date: date, // Guardar como string YYYY-MM-DD (la fecha exacta que el usuario seleccionó)
      timestamp: selectedDate.getTime(),
    }

    // Agregar y ordenar
    bets.push(newBet)
    bets.sort((a, b) => a.timestamp - b.timestamp)

    // Guardar
    await writeBets(bets)

    return NextResponse.json(newBet, {
      status: 201,
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      },
    })
  } catch (error: any) {
    // Manejar errores de JSON malformado
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Formato de datos inválido' },
        { status: 400 }
      )
    }
    
    console.error('Error guardando apuesta:', error)
    return NextResponse.json(
      { error: 'Error al guardar la apuesta' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar una apuesta o todas las apuestas
export async function DELETE(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, 'DELETE')
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas peticiones. Intenta más tarde.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
            'Retry-After': '60',
          },
        }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const all = searchParams.get('all') === 'true'

    // Si se solicita eliminar todas las apuestas - REQUIERE AUTENTICACIÓN
    if (all) {
      // Verificar autenticación
      if (!verifyAuthToken(request)) {
        return NextResponse.json(
          { error: 'No autorizado. Se requiere token de autenticación.' },
          { status: 401 }
        )
      }

      await writeBets([])
      return NextResponse.json(
        { success: true, message: 'Todas las apuestas han sido eliminadas' },
        {
          headers: {
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          },
        }
      )
    }

    // Eliminar una apuesta específica - NO requiere autenticación (solo elimina una)
    if (!id) {
      return NextResponse.json(
        { error: 'ID de apuesta requerido o parámetro all=true' },
        { status: 400 }
      )
    }

    // Validar que el ID sea seguro (solo números)
    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: 'ID de apuesta inválido' },
        { status: 400 }
      )
    }

    const bets = await readBets()
    const filteredBets = bets.filter(bet => bet.id !== id)

    if (bets.length === filteredBets.length) {
      return NextResponse.json(
        { error: 'Apuesta no encontrada' },
        { status: 404 }
      )
    }

    await writeBets(filteredBets)

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        },
      }
    )
  } catch (error) {
    console.error('Error eliminando apuesta:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la apuesta' },
      { status: 500 }
    )
  }
}

