import { Hono } from 'hono'
import healthRouter from './routes/health.router'
import authRouter from './routes/auth.router'
import boardRouter from './routes/board.router'
import imagesRouter from './routes/images.router'
import setupRouter from './routes/setup.router'

const app = new Hono().basePath('/api')

app.route('/health', healthRouter)
app.route('/auth', authRouter)
app.route('/board', boardRouter)
app.route('/images', imagesRouter)
app.route('/setup', setupRouter)

export default app
