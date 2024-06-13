import type { Config } from 'drizzle-kit'
import path from 'path'

export default {
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  out: './drizzle',
  dbCredentials: {
    url: path.resolve(__dirname, './local-data.db')
  }
} satisfies Config
