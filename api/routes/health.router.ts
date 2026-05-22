import { Hono } from 'hono'
import { prisma } from '../../lib/db'

const router = new Hono()

router.get('/', async (c) => {
  const start = Date.now()

  try {
    await prisma.$queryRaw`SELECT 1`
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      db: 'up',
      responseTimeMs: Date.now() - start,
    })
  } catch {
    return c.json({ error: 'Database connection failed' }, 500)
  }
})

export default router
