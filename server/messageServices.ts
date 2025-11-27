import Elysia from "elysia";
import { db } from "./db";
import { and, eq, or } from "drizzle-orm";
import { chats, messages } from "./db/schema";
import { userServices } from "./userServices";


export const messageServices = new Elysia({
    name: 'messageServices',
    prefix: '/messages'
})
.use(userServices)
.get('/chats', async ({session}) => {
    const id = session!.user.id
    
    const findChats = await db.query.chats.findMany({
        where: or(
            eq(chats.userId, id),
            eq(chats.interlocutorId, id)
        ),
        with: {
            user: true,
            interlocutor: true,
            messages: true
        }
    })

    const interlocutorUser = findChats.map((c) => {
        const inter = c.user.id === id
        ? c.interlocutor
        : c.user
        const lastMessageObj = c.messages[c.messages.length - 1]
        const lastMes = lastMessageObj ? lastMessageObj.message : null
        return {
            chatId: c.id,
            interlocutor: inter,
            lastMes
        }
    })

    return interlocutorUser
})
.post('/chats/:id', async ({params, session}) => {
    const chat = await db.query.chats.findFirst({
        where: or(
            and(eq(chats.userId, session!.user.id), eq(chats.interlocutorId, params.id)),
            and(eq(chats.userId, params.id), eq(chats.interlocutorId, session!.user.id))
        )
    })

    if (chat) {
        return {
            error: 'This chat already yet'
        }
    }
    await db.insert(chats).values({userId: session!.user.id, interlocutorId: params.id})
})
