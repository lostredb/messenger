import sharp from 'sharp'
import mime from 'mime-types'
import { db } from '../db'
import { files } from '../db/schema'
import { redis } from 'bun'
import { eq } from 'drizzle-orm'

const s3 = new Bun.S3Client()

export const maxFileSize = 1024 * 1024 * 5

export async function UploadFile({file, isImage, userId}: {file: File, isImage: boolean, userId: string}) {
    const byte = await file.arrayBuffer()
    let buf: Buffer<ArrayBufferLike> = Buffer.from(byte)

    if (isImage) {
        buf = await sharp(buf).webp().toBuffer()
    }

    const mimeType = mime.lookup(file.name)
    const resolvedMimeType = mimeType ? mimeType : 'application/octet-stream'

    let id: string | undefined
    await db.transaction(async (trx) => {
        const [f] = await trx.insert(files).values({
            filename: file.name,
            fileSize: file.size,
            contentType: resolvedMimeType,
            userId: userId
        }).returning()

        id = f.id

        const metadata = s3.file(id)

        console.log('Upload file with id: ', id)

        console.log({
            res: await metadata.write(buf, {
                type: resolvedMimeType
            })
        })
    })
}

export type FileMetadata = {
    id: string,
    filename: string,
    fileSize: number,
    contentType: string
}

export async function GetFileMetadata(id: string): Promise<FileMetadata> {
    const cachedMetadata = await redis.get(id)

    if (cachedMetadata) {
        return JSON.parse(cachedMetadata) as FileMetadata
    }

    const metadata = await db.query.files.findFirst({
        where: eq(files.id, id)
    })

    if (!metadata) {
        throw new Error('File not found')
    }

    await redis.set(id, JSON.stringify(metadata), 'EX', 24 * 60 * 60)

    return metadata as FileMetadata
}

export async function DeleteFile(id: string) {
    await db.transaction(async (trx) => {
        await trx.delete(files).where(eq(files.id, id))
        await s3.file(id).delete()
    })
}