import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Types (Mirrors of Prisma Models but with String dates for frontend compatibility)
// We keep the interfaces close to what they were to minimize frontend breakage
export interface Post {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    imageUrl?: string | null
    publishedAt: string
    createdAt: string
    updatedAt: string
}

export interface Event {
    id: string
    title: string
    slug: string
    description: string
    content: string
    eventType: string
    date: string // ISO String
    time: string
    location: string
    imageUrl?: string | null
    createdAt: string
    updatedAt: string
}

export interface TeamMember {
    id: string
    name: string
    role: string
    department: string
    bio: string
    imageUrl?: string | null
    socialLinks: {
        linkedin?: string
        twitter?: string
        github?: string
        instagram?: string
    }
    order: number
    createdAt: string
    updatedAt: string
}

export interface User {
    id: string
    email: string
    password: string
    name: string
    imageUrl?: string | null
    role: string // 'admin' | 'editor'
}

export interface Settings {
    id: string
    stats: {
        activeMembers: string
        events: string
        projects: string
        yearsOfExperience: string
    }
    socialLinks: {
        instagram: string
        twitter: string
        linkedin: string
        github: string
    }
    contact: {
        email: string
        phone: string
        address: string
    }
    updatedAt: string
}

// Helpers
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Slug generator
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10)
}

// --- POSTS ---

export async function getPosts(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
        orderBy: { publishedAt: 'desc' }
    })
    return posts.map(p => ({
        ...p,
        publishedAt: p.publishedAt.toISOString(),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
    }))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({ where: { slug } })
    if (!post) return null
    return {
        ...post,
        publishedAt: post.publishedAt.toISOString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
    }
}

export async function createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const post = await prisma.post.create({
        data: {
            ...data,
            publishedAt: new Date(data.publishedAt),
        }
    })
    return {
        ...post,
        publishedAt: post.publishedAt.toISOString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
    }
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post> {
    const post = await prisma.post.update({
        where: { id },
        data: {
            ...data,
            publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
            updatedAt: new Date(), // Force update
        }
    })
    return {
        ...post,
        publishedAt: post.publishedAt.toISOString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
    }
}

export async function deletePost(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } })
}

// --- EVENTS ---

export async function getEvents(): Promise<Event[]> {
    const events = await prisma.event.findMany({
        orderBy: { date: 'asc' }
    })
    return events.map(e => ({
        ...e,
        date: e.date.toISOString(),
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
    }))
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
    const event = await prisma.event.findUnique({ where: { slug } })
    if (!event) return null
    return {
        ...event,
        date: event.date.toISOString(),
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
    }
}

export async function createEvent(data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const event = await prisma.event.create({
        data: {
            ...data,
            date: new Date(data.date),
        }
    })
    return {
        ...event,
        date: event.date.toISOString(),
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
    }
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    const event = await prisma.event.update({
        where: { id },
        data: {
            ...data,
            date: data.date ? new Date(data.date) : undefined,
        }
    })
    return {
        ...event,
        date: event.date.toISOString(),
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
    }
}

export async function deleteEvent(id: string): Promise<void> {
    await prisma.event.delete({ where: { id } })
}

// --- TEAM ---

export async function getTeamMembers(): Promise<TeamMember[]> {
    const members = await prisma.teamMember.findMany({
        orderBy: { order: 'asc' }
    })
    return members.map(m => ({
        ...m,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socialLinks: m.socialLinks as any,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
    }))
}

export async function createTeamMember(data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> {
    const member = await prisma.teamMember.create({
        data: {
            ...data,
            socialLinks: data.socialLinks, // JSON
        }
    })
    return {
        ...member,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socialLinks: member.socialLinks as any,
        createdAt: member.createdAt.toISOString(),
        updatedAt: member.updatedAt.toISOString(),
    }
}

export async function updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember> {
    const member = await prisma.teamMember.update({
        where: { id },
        data: {
            ...data,
            socialLinks: data.socialLinks,
        }
    })
    return {
        ...member,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socialLinks: member.socialLinks as any,
        createdAt: member.createdAt.toISOString(),
        updatedAt: member.updatedAt.toISOString(),
    }
}

export async function deleteTeamMember(id: string): Promise<void> {
    await prisma.teamMember.delete({ where: { id } })
}

// --- USERS ---

export async function getUsers(): Promise<User[]> {
    const users = await prisma.user.findMany()

    // Auto-seed admin if no users
    if (users.length === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        // Double check to prevent race conditions roughly
        const adminExists = await prisma.user.findUnique({ where: { email: process.env.ADMIN_EMAIL } })
        if (!adminExists) {
            const admin = await prisma.user.create({
                data: {
                    email: process.env.ADMIN_EMAIL,
                    password: hashPassword(process.env.ADMIN_PASSWORD),
                    name: 'Admin',
                    role: 'admin'
                }
            })
            // Return list with admin
            return [{ ...admin }]
        }
    }

    return users
}

export async function createUser(data: Omit<User, 'id'>): Promise<User> {
    // Password should already be hashed by caller ideally, or we ensure it here
    // Currently API route hashes it.
    return await prisma.user.create({ data })
}

export async function updateUser(currentEmail: string, data: Partial<User>): Promise<User> {
    const user = await prisma.user.findUnique({ where: { email: currentEmail } })
    if (!user) throw new Error('Kullanıcı bulunamadı')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
        name: data.name,
        role: data.role,
        email: data.email,
        imageUrl: data.imageUrl,
    }

    if (data.password) {
        updateData.password = hashPassword(data.password)
    }

    return await prisma.user.update({
        where: { id: user.id },
        data: updateData
    })
}

export async function deleteUser(email: string): Promise<void> {
    // We use email as ID in deletion logic of existing API
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
        await prisma.user.delete({ where: { id: user.id } })
    }
}

export async function validateUser(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null

    // Check if password is hashed (bcrypt hashes start with $2)
    if (user.password.startsWith('$2')) {
        const isValid = await bcrypt.compare(password, user.password)
        return isValid ? user : null
    } else {
        // Legacy plain text password
        return user.password === password ? user : null
    }
}

// --- SETTINGS ---

export async function getSettings(): Promise<Settings> {
    const settings = await prisma.settings.findFirst()

    if (!settings) {
        // Return default structure
        return {
            id: 'default',
            stats: {
                activeMembers: '0',
                events: '0',
                projects: '0',
                yearsOfExperience: '0'
            },
            socialLinks: { instagram: '', twitter: '', linkedin: '', github: '' },
            contact: { email: '', phone: '', address: '' },
            updatedAt: new Date().toISOString()
        }
    }

    return {
        ...settings,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stats: ((settings as any).stats || { activeMembers: '0', events: '0', projects: '0', yearsOfExperience: '0' }) as any,
        // Cast JSON fields
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socialLinks: ((settings as any).socialMedia || { instagram: '', twitter: '', linkedin: '', github: '' }) as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        contact: (settings.contact || { email: '', phone: '', address: '' }) as any,
        updatedAt: settings.updatedAt.toISOString(),
    }
}

export async function saveSettings(data: Settings): Promise<void> {
    // We only have one settings row. Upsert it.
    // We need a stable ID for upsert, or findFirst and update.
    const existing = await prisma.settings.findFirst()

    if (existing) {
        await prisma.settings.update({
            where: { id: existing.id },
            data: {
                stats: data.stats,
                socialMedia: data.socialLinks,
                contact: data.contact,
            }
        })
    } else {
        await prisma.settings.create({
            data: {
                stats: data.stats,
                socialMedia: data.socialLinks,
                contact: data.contact,
            }
        })
    }
}

// --- PROJECTS ---

export interface Project {
    id: string
    title: string
    slug: string
    description: string
    content: string
    imageUrl?: string | null
    technologies: string[]
    status: string
    year?: string | null
    githubUrl?: string | null
    liveUrl?: string | null
    teamMembers: TeamMember[]
    createdAt: string
    updatedAt: string
}

export async function getProjects(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        include: { teamMembers: true }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return projects.map((p: any) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        teamMembers: p.teamMembers.map((m: any) => ({
            ...m,
            socialLinks: m.socialLinks as any,
            createdAt: m.createdAt.toISOString(),
            updatedAt: m.updatedAt.toISOString(),
        }))
    }))
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const project = await (prisma as any).project.findUnique({
        where: { slug },
        include: { teamMembers: true }
    })
    if (!project) return null
    return {
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        teamMembers: project.teamMembers.map((m: any) => ({
            ...m,
            socialLinks: m.socialLinks as any,
            createdAt: m.createdAt.toISOString(),
            updatedAt: m.updatedAt.toISOString(),
        }))
    }
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'teamMembers'> & { teamMemberIds?: string[] }): Promise<Project> {
    const { teamMemberIds, ...rest } = data
    const project = await (prisma as any).project.create({
        data: {
            ...rest,
            teamMembers: {
                connect: teamMemberIds?.map(id => ({ id })) || []
            }
        },
        include: { teamMembers: true }
    })
    return {
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        teamMembers: project.teamMembers.map((m: any) => ({
            ...m,
            socialLinks: m.socialLinks as any,
            createdAt: m.createdAt.toISOString(),
            updatedAt: m.updatedAt.toISOString(),
        }))
    }
}

export async function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'teamMembers'> & { teamMemberIds?: string[] }>): Promise<Project> {
    const { teamMemberIds, ...rest } = data

    // Construct update data
    const updateData: any = { ...rest }

    if (teamMemberIds) {
        updateData.teamMembers = {
            set: teamMemberIds.map(id => ({ id }))
        }
    }

    const project = await (prisma as any).project.update({
        where: { id },
        data: updateData,
        include: { teamMembers: true }
    })
    return {
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        teamMembers: project.teamMembers.map((m: any) => ({
            ...m,
            socialLinks: m.socialLinks as any,
            createdAt: m.createdAt.toISOString(),
            updatedAt: m.updatedAt.toISOString(),
        }))
    }
}

export async function deleteProject(id: string): Promise<void> {
    await (prisma as any).project.delete({ where: { id } })
}
