import { Hono } from 'hono'
import { PostgresService } from '../services/postgres/postgres.service'
import { authMiddleware, requireRole } from '../lib/middleware'
import { IUserRole, BoardType } from '../models'

const router = new Hono()

router.post('/', authMiddleware, requireRole(IUserRole.SuperAdmin), async (c) => {
  const body = await c.req.json()

  if (
    !body ||
    (body.type !== BoardType.Main && body.type !== BoardType.Chapter) ||
    typeof body.year !== 'number'
  ) {
    return c.json(
      { error: 'Invalid request body: type (main|chapter) and year (number) are required' },
      400,
    )
  }

  const board = await PostgresService.getInstance().boardServices.createBoard({
    type: body.type,
    year: body.year,
    chapterId: body.chapterId,
  })

  return c.json(board, 201)
})

export default router
