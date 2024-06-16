import {
  SQLiteInsertValue,
  SQLiteUpdateSetSource
} from 'drizzle-orm/sqlite-core'
import { ne, SQL } from 'drizzle-orm'
import { sentences } from '@schema'
import { db } from '.'
import { PER_PAGE } from '@renderer/constants'

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

export const insertSentence = (
  sentence: SQLiteInsertValue<typeof sentences>
) => {
  return db.insert(sentences).values(sentence).returning()
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
