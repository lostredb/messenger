import * as pg from 'drizzle-orm/pg-core'

export const commonFields = {
    id: pg
        .varchar('id', {length: 255})
        .notNull()
        .primaryKey()
        .$defaultFn(() => Bun.randomUUIDv7()),
    createdAt: pg
        .timestamp('created_at', {mode: 'date'})
        .notNull()
        .defaultNow()
}