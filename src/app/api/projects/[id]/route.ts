import { NextResponse } from 'next/server'
import { getProjectBySlug, updateProject, deleteProject } from '@/lib/data'
import { requireAuth } from '@/lib/auth'
import { sanitizeString, validateLength, validateUrl, validateSlug } from '@/lib/validation'
import { logger } from '@/lib/logger'

// Note: We are using ID for update/delete but Slug for fetching usually in public views.
// Admin panel will likely use IDs. Let's support ID lookup if possible, but our data.ts helper uses slug.
// Wait, data.ts `getProjectBySlug` uses slug. `updateProject` and `deleteProject` use ID.
// For this route `[id]`, we should process it as ID if it looks like one, or slug?
// Usually `[id]` in API routes implies the primary key.
// But `getProject`... I only added `getProjectBySlug`. I should have added `getProjectById` or general `getProject`.
// Let's rely on the fact that for admin operations we have the object so we have the ID.
// For public view, we use slug.
// So this API route `[id]` will be for admin operations essentially.

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await requireAuth() // Require authentication
        
        const params = await props.params;
        const body = await request.json()
        
        // Validation and sanitization
        const updateData: Record<string, unknown> = {}
        
        if (body.title !== undefined) {
            if (!validateLength(body.title, 1, 200)) {
                return NextResponse.json({ error: 'Başlık 1-200 karakter arasında olmalıdır' }, { status: 400 })
            }
            updateData.title = sanitizeString(body.title, 200)
        }
        
        if (body.slug !== undefined) {
            if (!validateSlug(body.slug)) {
                return NextResponse.json({ error: 'Geçersiz slug formatı' }, { status: 400 })
            }
            updateData.slug = body.slug
        }
        
        if (body.description !== undefined) updateData.description = sanitizeString(body.description, 1000)
        if (body.content !== undefined) updateData.content = sanitizeString(body.content, 50000)
        if (body.technologies !== undefined) {
            updateData.technologies = Array.isArray(body.technologies)
                ? body.technologies.map((t: string) => sanitizeString(t, 50)).filter(Boolean)
                : []
        }
        if (body.status !== undefined) {
            updateData.status = ['devam', 'tamamlandi', 'planlaniyor'].includes(body.status)
                ? body.status
                : 'planlaniyor'
        }
        if (body.imageUrl !== undefined) {
            if (body.imageUrl && !validateUrl(body.imageUrl)) {
                return NextResponse.json({ error: 'Geçersiz resim URL\'si' }, { status: 400 })
            }
            updateData.imageUrl = body.imageUrl || null
        }
        if (body.githubUrl !== undefined) {
            if (body.githubUrl && !validateUrl(body.githubUrl)) {
                return NextResponse.json({ error: 'Geçersiz GitHub URL\'si' }, { status: 400 })
            }
            updateData.githubUrl = body.githubUrl || null
        }
        if (body.liveUrl !== undefined) {
            if (body.liveUrl && !validateUrl(body.liveUrl)) {
                return NextResponse.json({ error: 'Geçersiz canlı URL\'si' }, { status: 400 })
            }
            updateData.liveUrl = body.liveUrl || null
        }
        if (body.year !== undefined) updateData.year = body.year
        if (body.teamMemberIds !== undefined) {
            updateData.teamMemberIds = Array.isArray(body.teamMemberIds) ? body.teamMemberIds : []
        }
        
        const updatedProject = await updateProject(params.id, updateData)
        return NextResponse.json(updatedProject)
    } catch (error) {
        logger.error('Update project error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Proje güncellenemedi' }, { status: 500 })
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await requireAuth() // Require authentication
        
        const params = await props.params;
        await deleteProject(params.id)
        return NextResponse.json({ success: true })
    } catch (error) {
        logger.error('Delete project error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Proje silinemedi' }, { status: 500 })
    }
}
