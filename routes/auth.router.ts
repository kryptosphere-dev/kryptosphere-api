import { Hono } from 'hono'
import { authMiddleware } from '../lib/middleware'

const router = new Hono()

router.get('/me', authMiddleware, (c) => {
  return c.json(c.get('user'))
})

export default router
