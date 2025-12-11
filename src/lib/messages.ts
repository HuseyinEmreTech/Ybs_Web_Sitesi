import { prisma } from '@/lib/prisma'

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
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return messages.map(msg => ({
            id: msg.id,
            name: msg.name,
            email: msg.email,
            subject: msg.subject,
            message: msg.message,
            createdAt: msg.createdAt.toISOString(),
            read: msg.read
        }))
    } catch (error) {
        console.error('Failed to fetch messages:', error)
        return []
    }
}

export async function saveMessage(data: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) {
    try {
        const newMessage = await prisma.message.create({
            data: {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                read: false
            }
        })

        return {
            ...newMessage,
            createdAt: newMessage.createdAt.toISOString()
        }
    } catch (error) {
        console.error('Failed to save message:', error)
        throw error
    }
}

export async function markAsRead(id: string) {
    try {
        await prisma.message.update({
            where: { id },
            data: { read: true }
        })
    } catch (error) {
        console.error('Failed to mark message as read:', error)
    }
}

export async function deleteMessage(id: string) {
    try {
        await prisma.message.delete({
            where: { id }
        })
    } catch (error) {
        console.error('Failed to delete message:', error)
    }
}
