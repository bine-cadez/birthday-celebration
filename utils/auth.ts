import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function signAuthJWT(
  payload: Record<string, unknown>,
  expiresIn = process.env.JWT_EXPIRES_IN || '7d',
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
}

export async function verifyAuthJWT(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload
}
