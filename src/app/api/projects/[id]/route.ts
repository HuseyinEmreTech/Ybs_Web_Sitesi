import { NextResponse } from 'next/server'
import { getProjectBySlug, updateProject, deleteProject } from '@/lib/data'

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
        const params = await props.params;
        const body = await request.json()
        const updatedProject = await updateProject(params.id, {
            ...body,
            // Ensure compatibility with data layer expectations
        })
        return NextResponse.json(updatedProject)
    } catch (error) {
        console.error('Update project error:', error)
        return NextResponse.json({ error: 'Proje güncellenemedi' }, { status: 500 })
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        await deleteProject(params.id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete project error:', error)
        return NextResponse.json({ error: 'Proje silinemedi' }, { status: 500 })
    }
}
