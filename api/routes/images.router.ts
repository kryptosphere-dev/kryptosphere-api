import { Hono } from 'hono'
import { put } from '@vercel/blob'
import { PostgresService } from '../../services/postgres/postgres.service'
import { authMiddleware } from '../../lib/middleware'

const router = new Hono()

router.get('/', async (c) => {
  const id = c.req.query('id')
  const limitParam = c.req.query('limit')
  const imageServices = PostgresService.getInstance().imageServices

  if (id) {
    const image = await imageServices.findImageById(id)
    if (!image) return c.json({ error: 'Image not found' }, 404)
    return c.json({ image })
  }

  const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 50, 200) : 50
  const images = await imageServices.listImages(limit)
  return c.json({ images })
})

router.post('/', authMiddleware, async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return c.json({ error: "Missing or invalid 'file' field (multipart/form-data expected)" }, 400)
  }

  const key = formData.get('key')
  if (!key || typeof key !== 'string') {
    return c.json({ error: "Missing or invalid 'key' field (string expected)" }, 400)
  }

  const altText = (formData.get('altText') as string) || undefined
  const description = (formData.get('description') as string) || undefined

  const blob = await put(`images/${Date.now()}-${file.name}`, file, { access: 'public' })

  const image = await PostgresService.getInstance().imageServices.createImage({
    key,
    url: blob.url,
    altText,
    description,
  })

  return c.json({ image, blob: { url: blob.url } }, 201)
})

export default router
