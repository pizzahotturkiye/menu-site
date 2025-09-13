import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware-auth'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'node:stream'
import { promisify } from 'node:util'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const POST = withAdminAuth(async (request: AuthenticatedRequest) => {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary using upload_stream
    const uploadStream = (): Promise<{ secure_url: string }> =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'menu-site',
            resource_type: 'image',
            overwrite: false,
            unique_filename: true
          },
          (error: any, result: any) => {
            if (error || !result) return reject(error)
            resolve({ secure_url: result.secure_url })
          }
        )

        Readable.from(buffer).pipe(stream)
      })

    const { secure_url } = await uploadStream()

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      filename: secure_url
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
})
