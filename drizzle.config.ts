import type { Config } from 'drizzle-kit'

// drizzle-kit commandline config:
// 1. pnpx drizzle-kit generate
// 2. pnpxdrizzle-kit migrate
export default {
  schema: 'src/db/schema.ts',
  dialect: 'sqlite',
  out: 'src/db/drizzle'
} satisfies Config
