import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const sentense = sqliteTable('sentense', {
  id: int('id').primaryKey().default(0),
  title: text('title').notNull().default('')
})
