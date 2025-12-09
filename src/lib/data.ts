import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const dataDir = path.join(process.cwd(), 'data')

// Generic read function
export function readData<T>(filename: string, defaultValue: T): T {
    const filePath = path.join(dataDir, filename)

    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
    }

    // If file doesn't exist, return default value and optionally write it
    if (!fs.existsSync(filePath)) {
        // In development, we might want to create the file
        // In production (Vercel), we might not be able to write, but we can return the default
        try {
            if (process.env.NODE_ENV === 'development') {
                fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8')
            }
        } catch (error) {
            console.warn(`Could not create default file ${filename}:`, error)
        }
        return defaultValue
    }

    try {
        const data = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error(`Error reading ${filename}:`, error)
        return defaultValue
    }
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
    const data = readData<{ posts: Post[] }>('posts.json', { posts: [] })
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
    const data = readData<{ events: Event[] }>('events.json', { events: [] })
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
    const data = readData<{ members: TeamMember[] }>('team.json', { members: [] })
    return data.members.sort((a, b) => a.order - b.order)
}

export function saveTeamMembers(members: TeamMember[]): void {
    writeData('team.json', { members })
}

export function getSettings(): Settings {
    return readData<Settings>('settings.json', {
        stats: {
            activeMembers: '0',
            events: '0',
            projects: '0',
            yearsOfExperience: '0'
        },
        socialLinks: {
            instagram: '',
            twitter: '',
            linkedin: '',
            github: ''
        },
        contact: {
            email: '',
            phone: '',
            address: ''
        }
    })
}

export function saveSettings(settings: Settings): void {
    writeData('settings.json', settings)
}

export function getUsers(): User[] {
    const data = readData<{ users: User[] }>('users.json', { users: [] })
    const users = data.users

    // IF no users exist (or file was just created), AND we have ENV vars, seed the admin
    if (users.length === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        const adminUser: User = {
            email: process.env.ADMIN_EMAIL,
            password: hashPassword(process.env.ADMIN_PASSWORD),
            name: 'Admin',
            role: 'admin'
        }
        // Return a list including this temp admin
        // Note: We try to save it so it persists in local dev
        // In Vercel, this save might fail or be ephemeral, but at least the login will work for this request
        try {
            users.push(adminUser)
            // Attempt to write back to file
            const filePath = path.join(dataDir, 'users.json')
            if (process.env.NODE_ENV === 'development' || fs.existsSync(dataDir)) { // Try to write if dir exists
                // We can use saveUsers but that imports us... causing cycle? No, saveUsers is in this file.
                // safe to call saveUsers(users) ? saveUsers calls writeData.
                saveUsers(users)
            }
        } catch (e) {
            console.warn("Could not save seed admin to disk (expected on Vercel)", e)
        }
        return users
    }

    return users
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
