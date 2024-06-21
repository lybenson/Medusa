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
  : path.join(app.getPath('userData'), 'database/data.db')

fs.mkdirSync(path.dirname(dbPath), { recursive: true })

const betterSqlite = new Database(dbPath)

export const db = drizzle(betterSqlite, { schema })

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
  const result = betterSqlite.prepare(sqlstr)
  const ret = result[method](...params)
  return toDrizzleResult(ret)
}

export const runMigrate = async () => {
  const drizzlePath = import.meta.env.DEV
    ? 'src/db/drizzle'
    : path.join(process.resourcesPath, 'db/drizzle')

  try {
    await migrate(db, {
      migrationsFolder: drizzlePath
    })
  } catch (error) {
    console.error(error)
    console.error(`Have you run the command "pnpm db:generate"?`)
    exit(0)
  }
}
