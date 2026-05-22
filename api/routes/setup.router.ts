import { Hono } from 'hono'
import { authMiddleware } from '../../lib/middleware'
import { PostgresService } from '../../services/postgres/postgres.service'
import { IUserRole } from '../../models'

const router = new Hono()

router.post('/', authMiddleware, async (c) => {
  const setupSecret = process.env.SETUP_SECRET
  if (!setupSecret) return c.json({ error: 'Setup is not configured' }, 500)

  const providedSecret =
    c.req.header('x-setup-secret') ?? (await c.req.json().catch(() => ({}))).setupSecret

  if (!providedSecret || providedSecret !== setupSecret) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const userServices = PostgresService.getInstance().userServices
  const existingSuperAdmin = await userServices.findSuperAdmin()

  if (existingSuperAdmin) {
    return c.json({ error: 'Setup already completed' }, 403)
  }

  const user = await userServices.updateRole(c.get('user').authUserId, IUserRole.SuperAdmin)

  return c.json({ message: 'Super admin created successfully', user }, 201)
})

export default router
