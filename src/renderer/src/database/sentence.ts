import {
  SQLiteInsertValue,
  SQLiteUpdateSetSource
} from 'drizzle-orm/sqlite-core'
import { eq, ne, SQL } from 'drizzle-orm'
import { sentences } from '@schema'
import { db } from '.'
import { PER_PAGE } from '@renderer/constants'
import { omit } from 'radash'

export const fetchSentences = (limit = PER_PAGE, offset = 0) => {
  return db.query.sentences.findMany({
    limit,
    offset,
    with: {
      relationList: {
        columns: {
          sentenceId: false,
          wordId: false
        },
        with: {
          word: true
        }
      }
    },
    where: ne(sentences.deleted, true)
  })
}

export const fetchOneSentence = (id: number) => {
  return db.query.sentences.findFirst({
    with: {
      relationList: {
        columns: {
          sentenceId: false,
          wordId: false
        },
        with: {
          word: true
        }
      }
    },
    where: eq(sentences.id, id)
  })
}

export const insertSentence = async (
  sentence: SQLiteInsertValue<typeof sentences>
) => {
  const existSentence = await db.query.sentences.findFirst({
    where: eq(sentences.original, sentence.original)
  })

  if (existSentence?.id) {
    const needUpdate = omit(sentence, [
      'id',
      'created_at',
      'updated_at'
    ]) as SQLiteUpdateSetSource<typeof sentences>
    return updateSentence(needUpdate, eq(sentences.id, existSentence.id))
  } else {
    return db.insert(sentences).values(sentence).returning()
  }
}

export const updateSentence = async (
  sentence: SQLiteUpdateSetSource<typeof sentences>,
  condition: SQL | undefined
) => {
  return db.update(sentences).set(sentence).where(condition).returning()
}

export const deleteSentence = async (condition: SQL | undefined) => {
  return db.delete(sentences).where(condition).returning()
}
