import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // Redirigir desde s1mple.cloud a s1mple.dev
  if (hostname.includes('s1mple.cloud')) {
    const url = request.nextUrl.clone()
    url.hostname = 's1mple.dev'
    url.protocol = 'https'
    return NextResponse.redirect(url, 301) // Redirección permanente
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

