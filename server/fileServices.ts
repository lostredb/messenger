import Elysia from "elysia";
import sharp from "sharp";
import z from "zod";
import { api } from "./lib/api";


export const fileServices = new Elysia({
    name: 'fileServices',
    prefix: '/files'
})
.post('/avatar', async ({body}) => {
    const {fileId, userImg} = body
    
    if (userImg && userImg.type.startsWith('image/')) {
        const s3 = new Bun.S3Client()

        const bytes = await userImg?.arrayBuffer()
        let buf: Buffer<ArrayBufferLike> = await sharp(Buffer.from(bytes)).webp().toBuffer()

        await s3.file(fileId).write(buf, {type: 'image/webp'})

        await api.users.put({image: fileId})
    }
}, {
    body: z.object({
        fileId: z.string(),
        userImg: z.file()
    })
})