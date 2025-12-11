import { NextResponse } from 'next/server'
import { getProjects, createProject, type Project } from '@/lib/data'

export async function GET() {
    try {
        const projects = await getProjects()
        return NextResponse.json(projects)
    } catch (error) {
        console.error('Get projects error:', error)
        return NextResponse.json({ error: 'Projeler alınamadı' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Basic validation
        if (!body.title || !body.slug) {
            return NextResponse.json({ error: 'Başlık ve slug zorunludur' }, { status: 400 })
        }

        const newProject = await createProject({
            title: body.title,
            slug: body.slug,
            description: body.description || '',
            content: body.content || '',
            technologies: body.technologies || [],
            status: body.status || 'planlaniyor',
            imageUrl: body.imageUrl || body.image || null,
            year: body.year || new Date().getFullYear().toString(),
            githubUrl: body.githubUrl || null,
            liveUrl: body.liveUrl || null,
            teamMemberIds: body.teamMemberIds || []
        })

        return NextResponse.json(newProject, { status: 201 })
    } catch (error) {
        console.error('Create project error:', error)
        return NextResponse.json({ error: 'Proje oluşturulamadı' }, { status: 500 })
    }
}
