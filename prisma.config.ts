import { defineConfig } from 'prisma/config'
import { neon } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import 'dotenv/config'

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
    adapter: () => {
      const sql = neon(process.env.DATABASE_URL!)
      return new PrismaNeon(sql as any)
    },
  },
})
