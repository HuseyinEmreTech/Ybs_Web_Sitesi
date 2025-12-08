import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const dataDir = path.join(process.cwd(), 'data')

// Generic read function
export function readData<T>(filename: string): T {
    const filePath = path.join(dataDir, filename)
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
}

// Generic write function
export function writeData<T>(filename: string, data: T): void {
    const filePath = path.join(dataDir, filename)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// Generate unique ID
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Types
export interface Post {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    imageUrl?: string
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
    date: string
    time: string
    location: string
    imageUrl?: string
    createdAt: string
    updatedAt: string
}

export interface TeamMember {
    id: string
    name: string
    role: string
    department: string
    bio: string
    imageUrl?: string
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
    email: string
    password: string
    name: string
    role: 'admin' | 'editor'
}

export interface Settings {
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
}

// Data access functions
export function getPosts(): Post[] {
    const data = readData<{ posts: Post[] }>('posts.json')
    return data.posts
}

export function getPostBySlug(slug: string): Post | undefined {
    const posts = getPosts()
    return posts.find(p => p.slug === slug)
}

export function savePosts(posts: Post[]): void {
    writeData('posts.json', { posts })
}

export function getEvents(): Event[] {
    const data = readData<{ events: Event[] }>('events.json')
    return data.events
}

export function getEventBySlug(slug: string): Event | undefined {
    const events = getEvents()
    return events.find(e => e.slug === slug)
}

export function saveEvents(events: Event[]): void {
    writeData('events.json', { events })
}

export function getTeamMembers(): TeamMember[] {
    const data = readData<{ members: TeamMember[] }>('team.json')
    return data.members.sort((a, b) => a.order - b.order)
}

export function saveTeamMembers(members: TeamMember[]): void {
    writeData('team.json', { members })
}

export function getSettings(): Settings {
    return readData<Settings>('settings.json')
}

export function saveSettings(settings: Settings): void {
    writeData('settings.json', settings)
}

export function getUsers(): User[] {
    const data = readData<{ users: User[] }>('users.json')
    return data.users
}

export function saveUsers(users: User[]): void {
    writeData('users.json', { users })
}

export function validateUser(email: string, password: string): User | null {
    const users = getUsers()
    const user = users.find(u => u.email === email)
    if (!user) return null

    // Check if password is hashed (bcrypt hashes start with $2)
    if (user.password.startsWith('$2')) {
        const isValid = bcrypt.compareSync(password, user.password)
        return isValid ? user : null
    } else {
        // Legacy plain text password - compare directly
        return user.password === password ? user : null
    }
}

// Hash password for secure storage
export function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10)
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
