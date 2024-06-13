import { relations, sql } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const sentences = sqliteTable('sentences', {
  id: integer('id', { mode: 'number' }).primaryKey({
    autoIncrement: true
  }),
  original: text('original').notNull().unique(),
  translation: text('translate').notNull(),
  grammar: text('grammar'),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`)
})

export const words = sqliteTable('words', {
  id: integer('id', { mode: 'number' }).primaryKey({
    autoIncrement: true
  }),
  original: text('original').notNull().unique(),
  translation: text('translate').notNull(),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`)
})

export const sentenceRelations = relations(sentences, ({ many }) => ({
  relationList: many(wordSentence)
}))

export const wordRelations = relations(words, ({ many }) => ({
  relationList: many(wordSentence)
}))

export const wordSentence = sqliteTable(
  'word_sentence',
  {
    wordId: integer('word_id')
      .notNull()
      .references(() => words.id),
    sentenceId: integer('sentence_id')
      .notNull()
      .references(() => sentences.id)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.wordId, t.sentenceId] })
  })
)

export const wordSentenceRelations = relations(wordSentence, ({ one }) => ({
  word: one(words, {
    fields: [wordSentence.wordId],
    references: [words.id]
  }),
  sentence: one(sentences, {
    fields: [wordSentence.sentenceId],
    references: [sentences.id]
  })
}))
