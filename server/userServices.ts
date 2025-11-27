import Elysia from "elysia";
import { auth } from "./auth/auth";
import { UserSchema } from "./lib/zod-schemas";
import { user } from "./db/schema";
import { db } from "./db";
import { and, eq, ilike, ne, or } from "drizzle-orm";
import z from "zod";
import { redis } from "bun";


export const userServices = new Elysia({
    name: "userServices",
    prefix: "/users",
})
.mount(auth.handler)
.derive(
    {as: 'global'}, 
    async ({request: { headers }}) => {
    const session = await auth.api.getSession({ headers })
    return { session }
})
.macro({auth: {
    async resolve({status, request: { headers }}) {
        const session = await auth.api.getSession({ headers })
        if (!session) return status(401)
        return { session }
    }
}})
.get('/me', async ({session}) => {
    return session
})
.put('/', async ({session, body}) => {
    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }
    await db.update(user).set(body).where(eq(user.id, session.user.id))
}, {
    body: UserSchema.partial()
})
.get('/:search', async ({ params, session }) => {
    const search = `%${params.search}%`

    return await db.query.user.findMany({
        where: and(
            or(
            ilike(user.name, search),
            ilike(user.email, search) 
            ),
            ne(user.id, session!.user.id)
        )
    })
})
