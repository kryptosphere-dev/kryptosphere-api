import type { Context } from 'hono'
import { createMiddleware } from 'hono/factory'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { PostgresService } from '../services/postgres/postgres.service'
import { IUser, IUserRole } from '../models'

export type AuthEnv = {
  Variables: { user: IUser }
}

// jose v6 is ESM-only. Node 24 (Vercel runtime) supports require(esm) natively since Node 23+.
const JWKS = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!))

const isDev = process.env.NODE_ENV !== 'production'
const unauthorized = (c: Context<AuthEnv>, reason: string) => {
  if (isDev) console.warn('[auth] 401:', reason)
  return c.json({ error: 'Unauthorized', ...(isDev && { reason }) }, 401)
}

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const authorization = c.req.header('authorization')
  if (!authorization) return unauthorized(c, 'no_authorization_header')

  const parts = authorization.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return unauthorized(c, 'malformed_authorization_header')

  const token = parts[1]

  let sub: string
  try {
    const { payload } = await jwtVerify(token, JWKS)
    if (!payload.sub) return unauthorized(c, 'jwt_missing_sub')
    sub = payload.sub
  } catch (err) {
    const e = err as Error
    return unauthorized(c, `jwt_verify_failed: ${e.name}: ${e.message}`)
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
