import { NextResponse } from 'next/server'
import { getProjects, createProject, type Project } from '@/lib/data'
import { requireAuth } from '@/lib/auth'
import { sanitizeString, validateLength, validateUrl, validateSlug } from '@/lib/validation'
import { logger } from '@/lib/logger'

export async function GET() {
    try {
        const projects = await getProjects()
        return NextResponse.json(projects)
    } catch (error) {
        logger.error('Get projects error', { error })
        return NextResponse.json({ error: 'Projeler alınamadı' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth() // Require authentication
        
        const body = await request.json()

        // Validation
        if (!body.title || !validateLength(body.title, 1, 200)) {
            return NextResponse.json({ error: 'Başlık 1-200 karakter arasında olmalıdır' }, { status: 400 })
        }

        if (!body.slug || !validateSlug(body.slug)) {
            return NextResponse.json({ error: 'Geçersiz slug formatı' }, { status: 400 })
        }

        if (body.imageUrl && !validateUrl(body.imageUrl)) {
            return NextResponse.json({ error: 'Geçersiz resim URL\'si' }, { status: 400 })
        }

        if (body.githubUrl && !validateUrl(body.githubUrl)) {
            return NextResponse.json({ error: 'Geçersiz GitHub URL\'si' }, { status: 400 })
        }

        if (body.liveUrl && !validateUrl(body.liveUrl)) {
            return NextResponse.json({ error: 'Geçersiz canlı URL\'si' }, { status: 400 })
        }

        // Sanitize inputs
        const sanitizedData = {
            title: sanitizeString(body.title, 200),
            slug: body.slug,
            description: sanitizeString(body.description || '', 1000),
            content: sanitizeString(body.content || '', 50000),
            technologies: Array.isArray(body.technologies) 
                ? body.technologies.map((t: string) => sanitizeString(t, 50)).filter(Boolean)
                : [],
            status: ['devam', 'tamamlandi', 'planlaniyor'].includes(body.status) 
                ? body.status 
                : 'planlaniyor',
            imageUrl: body.imageUrl || body.image || null,
            year: body.year || new Date().getFullYear().toString(),
            githubUrl: body.githubUrl || null,
            liveUrl: body.liveUrl || null,
            teamMemberIds: Array.isArray(body.teamMemberIds) ? body.teamMemberIds : []
        }

        const newProject = await createProject(sanitizedData)

        return NextResponse.json(newProject, { status: 201 })
    } catch (error) {
        logger.error('Create project error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Proje oluşturulamadı' }, { status: 500 })
    }
}
