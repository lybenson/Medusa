import {
  SQLiteInsertValue,
  SQLiteUpdateSetSource
} from 'drizzle-orm/sqlite-core'
import { desc, eq, ne, SQL } from 'drizzle-orm'
import { WordsTable } from '@schema'
import { db } from '.'
import { PER_PAGE } from '@renderer/constants'

export const fetchWords = (limit = PER_PAGE, offset = 0) => {
  return db.query.WordsTable.findMany({
    limit,
    offset,
    with: {
      sentence: true
    },
    orderBy: [desc(WordsTable.updatedAt)],
    where: ne(WordsTable.deleted, true)
  })
}

export const fetchOneWordById = (id: number) => {
  return db.query.WordsTable.findFirst({
    with: {
      sentence: true
    },
    where: eq(WordsTable.id, id)
  })
}

export const insertWord = (word: SQLiteInsertValue<typeof WordsTable>) => {
  return db.insert(WordsTable).values(word).returning()
}

export const updateWord = async (
  word: SQLiteUpdateSetSource<typeof WordsTable>,
  condition: SQL | undefined
) => {
  return db.update(WordsTable).set(word).where(condition).returning()
}

export const deleteWord = async (condition: SQL | undefined) => {
  return db.delete(WordsTable).where(condition).returning()
}
