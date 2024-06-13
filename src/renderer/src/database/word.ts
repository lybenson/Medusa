import {
  SQLiteInsertValue,
  SQLiteUpdateSetSource
} from 'drizzle-orm/sqlite-core'
import { SQL } from 'drizzle-orm'
import { words, wordSentence } from '@schema'
import { db } from '.'

export const fetchWords = () => {
  return db.query.words.findMany()
}

export const insertWord = (word: SQLiteInsertValue<typeof words>) => {
  return db.insert(words).values(word).returning()
}

export const insertWordWithRelation = async (
  word: SQLiteInsertValue<typeof words>,
  sentenceId: number
) => {
  const insertedWord = await insertWord(word)
  return db
    .insert(wordSentence)
    .values({ wordId: insertedWord[0].id, sentenceId })
    .returning()
}

export const updateWord = async (
  word: SQLiteUpdateSetSource<typeof words>,
  condition: SQL | undefined
) => {
  return db.update(words).set(word).where(condition).returning()
}

export const deleteWord = async (condition: SQL | undefined) => {
  return db.delete(words).where(condition).returning()
}
