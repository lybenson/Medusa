import { desc, SQL } from 'drizzle-orm'
import { db } from '.'
import { SentenceGroupsTable } from '@schema'
import {
  SQLiteInsertValue,
  SQLiteUpdateSetSource
} from 'drizzle-orm/sqlite-core'

export const fetchSentencesGroup = () => {
  return db.query.SentenceGroupsTable.findMany({
    orderBy: [desc(SentenceGroupsTable.updatedAt)]
  })
}

export const insertSentenceGroup = async (
  group: SQLiteInsertValue<typeof SentenceGroupsTable>
) => {
  return db.insert(SentenceGroupsTable).values(group).returning()
}

export const updateSentenceGroup = async (
  group: SQLiteUpdateSetSource<typeof SentenceGroupsTable>,
  condition: SQL | undefined
) => {
  return db.update(SentenceGroupsTable).set(group).where(condition).returning()
}

export const deleteSentenceGroup = async (condition: SQL | undefined) => {
  return db.delete(SentenceGroupsTable).where(condition).returning()
}
