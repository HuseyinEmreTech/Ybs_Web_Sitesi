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
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return {
            siteName: 'YBS Kulübü',
            description: '',
            contact: { email: '', phone: '', address: '' },
            socialMedia: { instagram: '', twitter: '', linkedin: '', github: '' },
            maintenanceMode: false
        }
    }
}

export async function saveSettings(settings: SiteSettings) {
    await fs.writeFile(DATA_FILE, JSON.stringify(settings, null, 2), 'utf-8')
}
