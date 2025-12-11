import { prisma } from '@/lib/prisma'

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
        const settings = await prisma.settings.findUnique({
            where: { id: 'default' }
        })

        if (!settings) return defaultSettings

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
