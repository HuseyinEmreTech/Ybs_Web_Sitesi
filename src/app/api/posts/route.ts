import { NextResponse } from 'next/server'
import { getPosts, savePosts, generateId, generateSlug, type Post } from '@/lib/data'

export async function GET() {
    try {
        const posts = getPosts()
        return NextResponse.json(posts)
    } catch (error) {
        console.error('Get posts error:', error)
        return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const posts = getPosts()

        const newPost: Post = {
            id: generateId(),
            title: body.title,
            slug: generateSlug(body.title),
            excerpt: body.excerpt || '',
            content: body.content || '',
            category: body.category || 'Genel',
            imageUrl: body.imageUrl || '',
            publishedAt: body.publishedAt || new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        posts.push(newPost)
        savePosts(posts)

        return NextResponse.json(newPost, { status: 201 })
    } catch (error) {
        console.error('Create post error:', error)
        return NextResponse.json({ error: 'Yazı oluşturulamadı' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const posts = getPosts()
        const index = posts.findIndex(p => p.id === body.id)

        if (index === -1) {
            return NextResponse.json({ error: 'Yazı bulunamadı' }, { status: 404 })
        }

        posts[index] = {
            ...posts[index],
            title: body.title ?? posts[index].title,
            slug: body.title ? generateSlug(body.title) : posts[index].slug,
            excerpt: body.excerpt ?? posts[index].excerpt,
            content: body.content ?? posts[index].content,
            category: body.category ?? posts[index].category,
            imageUrl: body.imageUrl ?? posts[index].imageUrl,
            publishedAt: body.publishedAt ?? posts[index].publishedAt,
            updatedAt: new Date().toISOString(),
        }

        savePosts(posts)
        return NextResponse.json(posts[index])
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

        const posts = getPosts()
        const filtered = posts.filter(p => p.id !== id)

        if (filtered.length === posts.length) {
            return NextResponse.json({ error: 'Yazı bulunamadı' }, { status: 404 })
        }

        savePosts(filtered)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete post error:', error)
        return NextResponse.json({ error: 'Yazı silinemedi' }, { status: 500 })
    }
}
