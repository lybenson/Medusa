import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from '../db/schema'
import fs from 'fs'
import { app } from 'electron'
import path from 'path'
import { exit } from 'process'

const dbPath = import.meta.env.DEV
  ? 'local-data.db'
  : path.join(app.getPath('userData'), 'data.db')

fs.mkdirSync(path.dirname(dbPath), { recursive: true })

const sqlite = new Database(dbPath)

export const db = drizzle(sqlite, { schema })

function toDrizzleResult(
  rows: Record<string, any> | Array<Record<string, any>>
) {
  if (!rows) {
    return []
  }
  if (Array.isArray(rows)) {
    return rows.map((row) => {
      return Object.keys(row).map((key) => row[key])
    })
  } else {
    return Object.keys(rows).map((key) => rows[key])
  }
}

export const execute = async (_, sqlstr, params, method) => {
  const result = sqlite.prepare(sqlstr)
  const ret = result[method](...params)
  return toDrizzleResult(ret)
}

export const runMigrate = async () => {
  try {
    migrate(db, {
      migrationsFolder: path.join(__dirname, '../../drizzle')
    })
  } catch (error) {
    console.log(error)

    console.error(`Have you run the command "pnpm db:generate"? Try it!`)
    exit(0)
  }
}
