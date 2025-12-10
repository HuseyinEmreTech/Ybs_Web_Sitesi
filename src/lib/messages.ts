import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'messages.json')

export interface ContactMessage {
    id: string
    name: string
    email: string
    subject: string
    message: string
    createdAt: string
    read: boolean
}

export async function getMessages(): Promise<ContactMessage[]> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

export async function saveMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) {
    const messages = await getMessages()
    const newMessage: ContactMessage = {
        ...message,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        read: false
    }

    // Add to beginning
    messages.unshift(newMessage)

    await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), 'utf-8')
    return newMessage
}

export async function markAsRead(id: string) {
    const messages = await getMessages()
    const index = messages.findIndex(m => m.id === id)
    if (index !== -1) {
        messages[index].read = true
        await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), 'utf-8')
    }
}

export async function deleteMessage(id: string) {
    let messages = await getMessages()
    messages = messages.filter(m => m.id !== id)
    await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), 'utf-8')
}
