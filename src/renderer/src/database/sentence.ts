import {
  SQLiteInsertValue,
  SQLiteUpdateSetSource
} from 'drizzle-orm/sqlite-core'
import { desc, eq, ne, SQL } from 'drizzle-orm'
import { SentencesTable } from '@schema'
import { db } from '.'
import { PER_PAGE } from '@renderer/constants'
import { omit } from 'radash'

export const fetchSentences = (limit = PER_PAGE, offset = 0) => {
  return db.query.SentencesTable.findMany({
    limit,
    offset,
    with: {
      words: true
    },
    orderBy: [desc(SentencesTable.updatedAt)],
    where: ne(SentencesTable.deleted, true)
  })
}

export const fetchOneSentenceById = (id: number) => {
  return db.query.SentencesTable.findFirst({
    with: {
      words: true
    },
    where: eq(SentencesTable.id, id)
  })
}

export const fetchOneSentenceByOriginal = (original: string) => {
  return db.query.SentencesTable.findFirst({
    with: {
      words: true
    },
    where: eq(SentencesTable.original, original)
  })
}

export const insertSentence = async (
  sentence: SQLiteInsertValue<typeof SentencesTable>
) => {
  const existSentence = await db.query.SentencesTable.findFirst({
    where: eq(SentencesTable.original, sentence.original)
  })

  if (existSentence?.id) {
    const needUpdate = omit(sentence, [
      'id',
      'createdAt',
      'updatedAt'
    ]) as SQLiteUpdateSetSource<typeof SentencesTable>
    return updateSentence(needUpdate, eq(SentencesTable.id, existSentence.id))
  } else {
    return db.insert(SentencesTable).values(sentence).returning()
  }
}

export const updateSentence = async (
  sentence: SQLiteUpdateSetSource<typeof SentencesTable>,
  condition: SQL | undefined
) => {
  return db.update(SentencesTable).set(sentence).where(condition).returning()
}

export const deleteSentence = async (condition: SQL | undefined) => {
  return db.delete(SentencesTable).where(condition).returning()
}
