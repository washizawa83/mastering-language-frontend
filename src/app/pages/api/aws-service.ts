'use server'

import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Credentials } from 'aws-sdk'
import { Dispatch, SetStateAction } from 'react'

export const s3UploadService = async (
    deckId: string,
    fileName: string,
    file: File,
    callBack: Dispatch<SetStateAction<string | null>>,
) => {
    const accessKey = process.env.S3_ACCESS_KEY
    const secretKey = process.env.S3_SECRET_KEY
    console.log(accessKey, secretKey)
    if (!accessKey || !secretKey) return null

    const credentials = new Credentials(accessKey, secretKey)

    try {
        const parallelUploads3 = new Upload({
            client: new S3Client({
                region: 'ap-northeast-1',
                credentials: credentials,
            }),
            params: {
                Bucket: 'mastering-language-s3-bucket',
                Key: `cards/images/${deckId}/${fileName}`,
                Body: file,
            },
            leavePartsOnError: false,
        })
        parallelUploads3.on('httpUploadProgress', (progress) => {
            callBack(progress?.Key ? progress.Key : null)
        })
        await parallelUploads3.done()
    } catch (e) {
        throw e
    }
}

export const getServerSideProps = async () => {
    const accessKey = process.env.S3_ACCESS_KEY
    const secretKey = process.env.S3_SECRET_KEY
    console.log(accessKey, secretKey)
    if (!accessKey || !secretKey)
        return {
            props: {
                data: {
                    accessKey,
                    secretKey,
                },
            },
        }

    return {
        props: {
            data: {
                accessKey,
                secretKey,
            },
        },
    }
}
