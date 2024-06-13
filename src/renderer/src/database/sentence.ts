import {
  SQLiteInsertValue,
  SQLiteUpdateSetSource
} from 'drizzle-orm/sqlite-core'
import { SQL } from 'drizzle-orm'
import { sentences } from '@schema'
import { db } from '.'

export const fetchSentences = async () => {
  const sentenceList = await db.query.sentences.findMany({
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
    }
  })
  return sentenceList
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
