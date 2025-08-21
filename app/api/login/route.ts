import { NextResponse } from 'next/server'
import { signAuthJWT } from '@/utils/auth'

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}))

  if (!password) {
    return NextResponse.json({ error: 'Geslo Moraš Vpisati' }, { status: 400 })
  }
  if (password !== process.env.STATIC_PASSWORD) {
    return NextResponse.json({ error: 'Napačno Geslo' }, { status: 401 })
  }

  const token = await signAuthJWT({ role: 'admin' })

  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: 'auth',
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
