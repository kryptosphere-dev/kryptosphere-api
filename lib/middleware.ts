import type { Context } from 'hono'
import { createMiddleware } from 'hono/factory'
import { PostgresService } from '../services/postgres/postgres.service'
import { IUser, IUserRole } from '../models'

export type AuthEnv = {
  Variables: { user: IUser }
}

// jose v6 is ESM-only. Vercel runtime uses a custom Rust loader (/opt/rust/nodejs.js)
// that does NOT enable require(esm) even on Node 24, so static `import { jwtVerify } from 'jose'`
// crashes with ERR_REQUIRE_ESM at runtime.
//
// Workaround: dynamic import via `new Function(...)` to bypass tsc's transformation of
// `await import('jose')` into a synchronous require() (which would also crash).
//
// Vercel's static analyzer cannot see through `new Function`, so it won't auto-include
// the `jose` package in the function bundle. We force inclusion via `vercel.json`:
//   "functions": { "app.ts": { "includeFiles": "node_modules/jose/**/*" } }
type JoseModule = typeof import('jose')
type JWKSGetter = ReturnType<JoseModule['createRemoteJWKSet']>
const importJose: () => Promise<JoseModule> = new Function('return import("jose")') as () => Promise<JoseModule>
let _jose: JoseModule | null = null
let _jwks: JWKSGetter | null = null
const getJose = async (): Promise<{ jose: JoseModule; jwks: JWKSGetter }> => {
  if (!_jose) _jose = await importJose()
  if (!_jwks) _jwks = _jose.createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!))
  return { jose: _jose, jwks: _jwks }
}

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
    const { jose, jwks } = await getJose()
    const { payload } = await jose.jwtVerify(token, jwks)
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
