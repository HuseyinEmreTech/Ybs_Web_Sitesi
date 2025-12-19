import { NextResponse } from 'next/server'
import { getPosts, createPost, updatePost, deletePost, generateSlug, type Post } from '@/lib/data'
import { requireAuth } from '@/lib/auth'
import { sanitizeString, validateLength, validateUrl } from '@/lib/validation'
import { logger } from '@/lib/logger'

export async function GET() {
    try {
        const posts = await getPosts()
        const response = NextResponse.json(posts)
        response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=30')
        return response
    } catch (error) {
        logger.error('Get posts error', { error })
        return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth() // Require authentication for creating posts
        
        const body = await request.json()

        // Validation
        if (!body.title || !validateLength(body.title, 1, 200)) {
            return NextResponse.json({ error: 'Başlık 1-200 karakter arasında olmalıdır' }, { status: 400 })
        }

        if (body.imageUrl && !validateUrl(body.imageUrl)) {
            return NextResponse.json({ error: 'Geçersiz resim URL\'si' }, { status: 400 })
        }

        // Sanitize inputs
        const sanitizedData = {
            title: sanitizeString(body.title, 200),
            slug: generateSlug(body.title),
            excerpt: sanitizeString(body.excerpt || '', 500),
            content: sanitizeString(body.content || '', 50000),
            category: sanitizeString(body.category || 'Genel', 50),
            imageUrl: body.imageUrl ? sanitizeString(body.imageUrl, 500) : '',
            publishedAt: body.publishedAt || new Date().toISOString(),
        }

        const newPost = await createPost(sanitizedData)

        return NextResponse.json(newPost, { status: 201 })
    } catch (error) {
        logger.error('Create post error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Yazı oluşturulamadı' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        await requireAuth() // Require authentication
        
        const body = await request.json()

        if (!body.id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        // Validation and sanitization
        const updateData: Partial<Post> = {}
        
        if (body.title) {
            if (!validateLength(body.title, 1, 200)) {
                return NextResponse.json({ error: 'Başlık 1-200 karakter arasında olmalıdır' }, { status: 400 })
            }
            updateData.title = sanitizeString(body.title, 200)
            updateData.slug = generateSlug(body.title)
        }
        
        if (body.excerpt !== undefined) updateData.excerpt = sanitizeString(body.excerpt, 500)
        if (body.content !== undefined) updateData.content = sanitizeString(body.content, 50000)
        if (body.category !== undefined) updateData.category = sanitizeString(body.category, 50)
        if (body.imageUrl !== undefined) {
            if (body.imageUrl && !validateUrl(body.imageUrl)) {
                return NextResponse.json({ error: 'Geçersiz resim URL\'si' }, { status: 400 })
            }
            updateData.imageUrl = body.imageUrl ? sanitizeString(body.imageUrl, 500) : ''
        }
        if (body.publishedAt !== undefined) updateData.publishedAt = body.publishedAt

        const updatedPost = await updatePost(body.id, updateData)

        return NextResponse.json(updatedPost)
    } catch (error) {
        logger.error('Update post error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Yazı güncellenemedi' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        await requireAuth() // Require authentication
        
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await deletePost(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        logger.error('Delete post error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Yazı silinemedi' }, { status: 500 })
    }
}
