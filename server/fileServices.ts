import Elysia from "elysia";
import sharp from "sharp";
import z from "zod";
import { api } from "./lib/api";
import { db } from "./db";
import { user } from "./db/schema";
import { eq } from "drizzle-orm";
import { GetFileMetadata, s3 } from "./files";


export const fileServices = new Elysia({
    name: 'fileServices',
    prefix: '/files'
})
.put('/avatar', async ({body}) => {
    const {fileId, userImg, userId: id} = body
    console.log(body)

    if (!(userImg instanceof File)) {
        throw new Error('Invalid file')
    }

    const bytes = await userImg.arrayBuffer()
    const input = Buffer.from(bytes)
    const webp = await sharp(input).webp().toBuffer()

    console.log(webp)

    const s3 = new Bun.S3Client({
        endpoint: process.env.S3_ENDPOINT!,
        bucket: process.env.S3_BUCKET!,
        region: process.env.S3_REGION!,
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
    })

    await s3.file(fileId).write(webp, {type: 'image/webp'})

    await db.update(user).set({image: fileId}).where(eq(user.id, id))
}, {
    body: z.object({
        fileId: z.string(),
        userImg: z.file(),
        userId: z.string()
    })
})
.get('/:id', async ({params, set}) => {
    set.headers['content-type'] = 'image/webp'
    set.headers['content-disposition'] = `attachment; filename='${encodeURIComponent(params.id)}'`

    const s3File = s3.file(params.id)

    return new Response(s3File.stream(), {
        headers: {
            'content-type': 'image/webp',
            'content-disposition': `attachment; filename='${encodeURIComponent(params.id)}'`
        }
    })
})