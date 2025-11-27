import * as pg from 'drizzle-orm/pg-core'
import { commonFields } from './utils'
import { user } from './auth-schema'
import { relations } from 'drizzle-orm'
export * from './auth-schema'

export const messages = pg.pgTable('messages', {
    ...commonFields,
    message: pg
        .text('message')
        .notNull(),
    userId: pg
        .varchar('user_id', {length: 255})
        .notNull()
        .references(() => user.id),
    chatId: pg
        .varchar('chat_id', {length: 255})
        .notNull()
        .references(() => chats.id)
})

export const messageToUserAndChatRelation = relations(messages, ({one}) => ({
    user: one(user, {
        fields: [messages.userId],
        references: [user.id]
    }),
    chat: one(chats, {
        fields: [messages.chatId],
        references: [chats.id]
    })
}))

export const files = pg.pgTable('files', {
    ...commonFields,
    filename: pg
        .text('filename')
        .notNull(),
    fileSize: pg
        .integer('file_size')
        .notNull(),
    contentType: pg
        .text('content_type')
        .notNull(),
    userId: pg
        .varchar('id', {length: 255})
        .notNull()
        .references(() => user.id)
})

export const fileToUserRelation = relations(files, ({one}) => ({
    user: one(user, {
        fields: [files.userId],
        references: [user.id]
    })
}))

export const chats = pg.pgTable('chats', {
    ...commonFields,
    userId: pg
        .varchar('user_id', {length: 255})
        .notNull()
        .references(() => user.id),
    interlocutorId: pg
        .varchar('interlocuter_id', {length: 255})
        .notNull()
        .references(() => user.id)
})

export const chatToUsersAndMessagesRelations = relations(chats, ({one, many}) => ({
    user: one(user, {
        fields: [chats.userId],
        references: [user.id]
    }),
    interlocutor: one(user, {
        fields: [chats.interlocutorId],
        references: [user.id]
    }),
    messages: many(messages)
}))