import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'settings.json')

export interface SiteSettings {
    siteName: string
    description: string
    contact: {
        email: string
        phone: string
        address: string
    }
    socialMedia: {
        instagram: string
        twitter: string
        linkedin: string
        github: string
    }
    maintenanceMode: boolean
}

const defaultSettings: SiteSettings = {
    siteName: 'YBS Kulübü',
    description: '',
    contact: { email: '', phone: '', address: '' },
    socialMedia: { instagram: '', twitter: '', linkedin: '', github: '' },
    maintenanceMode: false
}

export async function getSettings(): Promise<SiteSettings> {
    try {
        // 1. Try to get from Database
        const settings = await prisma.settings.findUnique({
            where: { id: 'default' }
        })

        if (settings) {
            // Cast JSON fields to expected types
            const contact = settings.contact as SiteSettings['contact'] || defaultSettings.contact
            const socialMedia = settings.socialMedia as SiteSettings['socialMedia'] || defaultSettings.socialMedia

            return {
                siteName: settings.siteName,
                description: settings.description,
                contact: { ...defaultSettings.contact, ...contact },
                socialMedia: { ...defaultSettings.socialMedia, ...socialMedia },
                maintenanceMode: settings.maintenanceMode
            }
        }

        // 2. Fallback: Try to read from local JSON (Lazy Migration)
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8')
            const parsed = JSON.parse(data)

            const mergedSettings = {
                ...defaultSettings,
                ...parsed,
                contact: { ...defaultSettings.contact, ...(parsed.contact || {}) },
                socialMedia: { ...defaultSettings.socialMedia, ...(parsed.socialMedia || {}) }
            }

            // Save to DB for next time
            await saveSettings(mergedSettings)

            return mergedSettings
        } catch (ignored) {
            // JSON file missing or invalid, return defaults
            return defaultSettings
        }

    } catch (error) {
        console.error('Failed to fetch settings:', error)
        return defaultSettings
    }
}

export async function saveSettings(settings: SiteSettings) {
    try {
        await prisma.settings.upsert({
            where: { id: 'default' },
            update: {
                siteName: settings.siteName,
                description: settings.description,
                contact: settings.contact,
                socialMedia: settings.socialMedia,
                maintenanceMode: settings.maintenanceMode
            },
            create: {
                id: 'default',
                siteName: settings.siteName,
                description: settings.description,
                contact: settings.contact,
                socialMedia: settings.socialMedia,
                maintenanceMode: settings.maintenanceMode
            }
        })
    } catch (error) {
        console.error('Failed to save settings:', error)
        throw error
    }
}
