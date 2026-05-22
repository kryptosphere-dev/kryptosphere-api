import { Hono } from 'hono'
import healthRouter from './api/routes/health.router'
import authRouter from './api/routes/auth.router'
import boardRouter from './api/routes/board.router'
import imagesRouter from './api/routes/images.router'
import setupRouter from './api/routes/setup.router'

const app = new Hono().basePath('/api')

app.route('/health', healthRouter)
app.route('/auth', authRouter)
app.route('/board', boardRouter)
app.route('/images', imagesRouter)
app.route('/setup', setupRouter)

export default app
