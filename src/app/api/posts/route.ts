import { NextResponse } from 'next/server'
import { getPosts, createPost, updatePost, deletePost, generateSlug, type Post } from '@/lib/data'

export async function GET() {
    try {
        const posts = await getPosts()
        const response = NextResponse.json(posts)
        response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=30')
        return response
    } catch (error) {
        console.error('Get posts error:', error)
        return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Note: ID generation is handled by Prisma (CUID) or we could pass one if needed.
        // But our createPost wrapper expects data without ID.

        const newPost = await createPost({
            title: body.title,
            slug: generateSlug(body.title),
            excerpt: body.excerpt || '',
            content: body.content || '',
            category: body.category || 'Genel',
            imageUrl: body.imageUrl || '',
            publishedAt: body.publishedAt || new Date().toISOString(),
        })

        return NextResponse.json(newPost, { status: 201 })
    } catch (error) {
        console.error('Create post error:', error)
        return NextResponse.json({ error: 'Yazı oluşturulamadı' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()

        if (!body.id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const updatedPost = await updatePost(body.id, {
            title: body.title,
            slug: body.title ? generateSlug(body.title) : undefined,
            excerpt: body.excerpt,
            content: body.content,
            category: body.category,
            imageUrl: body.imageUrl,
            publishedAt: body.publishedAt,
        })

        return NextResponse.json(updatedPost)
    } catch (error) {
        console.error('Update post error:', error)
        return NextResponse.json({ error: 'Yazı güncellenemedi' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await deletePost(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete post error:', error)
        return NextResponse.json({ error: 'Yazı silinemedi' }, { status: 500 })
    }
}
