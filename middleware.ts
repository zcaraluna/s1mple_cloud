import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // Si la solicitud viene de s1mple.cloud, redirigir a s1mple.dev
  if (hostname === 's1mple.cloud' || hostname.startsWith('s1mple.cloud:')) {
    const url = request.nextUrl.clone()
    // Construir la nueva URL con el nuevo dominio manteniendo la ruta y query params
    const newUrl = new URL(url.pathname + url.search, 'https://s1mple.dev')
    // Redirección permanente (301) para SEO
    return NextResponse.redirect(newUrl, 301)
  }
  
  return NextResponse.next()
}

// Ejecutar middleware en todas las rutas excepto archivos estáticos y assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files con extensiones (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}

