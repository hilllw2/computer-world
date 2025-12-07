import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

console.log('S3 Config Check:', {
    region: process.env.AWS_REGION,
    bucket: process.env.S3_BUCKET_NAME,
    accessKeyIdPrefix: process.env.AWS_ACCESS_KEY_ID?.substring(0, 4),
    hasSecret: !!process.env.AWS_SECRET_ACCESS_KEY
})

export async function uploadFileToS3(file: Buffer, fileName: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileName,
        Body: file,
        ContentType: contentType,
        // ACL is intentionally omitted because many buckets have "Bucket owner enforced" setting which forbids ACLs.
    })

    try {
        await s3Client.send(command)
        return fileName
    } catch (error) {
        console.error('S3 Upload Error:', error)
        throw error
    }
}

export async function deleteFileFromS3(fileName: string) {
    const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileName,
    })

    try {
        await s3Client.send(command)
    } catch (error) {
        console.error('S3 Delete Error:', error)
        throw error
    }
}
