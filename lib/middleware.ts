import { createMiddleware } from 'hono/factory'
import { PostgresService } from '../services/postgres/postgres.service'
import { IUser, IUserRole } from '../models'

export type AuthEnv = {
  Variables: { user: IUser }
}

// jose v6 is pure ESM — lazy dynamic import to stay compatible with CJS build (tsc → Vercel)
type JoseModule = typeof import('jose')
type JWKSGetter = ReturnType<JoseModule['createRemoteJWKSet']>
let _jose: JoseModule | null = null
let _jwks: JWKSGetter | null = null
const getJose = async (): Promise<{ jose: JoseModule; jwks: JWKSGetter }> => {
  if (!_jose) _jose = await import('jose')
  if (!_jwks) _jwks = _jose.createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!))
  return { jose: _jose, jwks: _jwks }
}

const isDev = process.env.NODE_ENV !== 'production'
const unauthorized = (c: Parameters<Parameters<typeof createMiddleware>[0]>[0], reason: string) => {
  if (isDev) console.warn('[auth] 401:', reason)
  return c.json({ error: 'Unauthorized', ...(isDev && { reason }) }, 401)
}

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const authorization = c.req.header('authorization')
  if (!authorization) return unauthorized(c, 'no_authorization_header')

  const parts = authorization.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return unauthorized(c, 'malformed_authorization_header')

  const token = parts[1]

  if (isDev) {
    const dots = (token.match(/\./g) || []).length
  }

  let sub: string
  try {
    const { jose, jwks } = await getJose()
    const { payload } = await jose.jwtVerify(token, jwks)
    if (!payload.sub) return unauthorized(c, 'jwt_missing_sub')
    sub = payload.sub
  } catch (err) {
    return unauthorized(c, `jwt_verify_failed: ${(err as Error).name}`)
  }

  const user = await PostgresService.getInstance().userServices.syncUser(sub)

  c.set('user', user)
  await next()
})

export const requireRole = (role: IUserRole) =>
  createMiddleware<AuthEnv>(async (c, next) => {
    if (c.get('user').role !== role) return c.json({ error: 'Forbidden' }, 403)
    await next()
  })
