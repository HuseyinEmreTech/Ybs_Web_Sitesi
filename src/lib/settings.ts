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

export async function getSettings(): Promise<SiteSettings> {
    const defaultSettings: SiteSettings = {
        siteName: 'YBS Kulübü',
        description: '',
        contact: { email: '', phone: '', address: '' },
        socialMedia: { instagram: '', twitter: '', linkedin: '', github: '' },
        maintenanceMode: false
    }

    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8')
        const parsed = JSON.parse(data)

        // Deep merge with defaults to ensure all fields exist
        return {
            ...defaultSettings,
            ...parsed,
            contact: { ...defaultSettings.contact, ...(parsed.contact || {}) },
            socialMedia: { ...defaultSettings.socialMedia, ...(parsed.socialMedia || {}) }
        }
    } catch (error) {
        return defaultSettings
    }
}

export async function saveSettings(settings: SiteSettings) {
    await fs.writeFile(DATA_FILE, JSON.stringify(settings, null, 2), 'utf-8')
}
