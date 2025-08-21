import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthJWT } from './utils/auth'

const PUBLIC_PATHS = [
  '/login',
  '/api/login',
  '/_next',
  '/favicon.ico',
  '/public',
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = req.cookies.get('auth')?.value
  if (!token) {
    const url = new URL('/login', req.url)
    return NextResponse.redirect(url)
  }

  try {
    await verifyAuthJWT(token)
    return NextResponse.next()
  } catch {
    const url = new URL('/login', req.url)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|login|api/login).*)',
  ],
}
