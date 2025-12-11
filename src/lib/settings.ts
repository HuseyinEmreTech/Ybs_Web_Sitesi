import { prisma } from '@/lib/prisma'
// fs/promises and path imports removed as they are no longer needed


export interface SiteSettings {
    siteName: string
    description: string
    logoUrl: string
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
    stats: {
        activeMembers: string
        events: string
        projects: string
        yearsOfExperience: string
    }
    maintenanceMode: boolean
}

const defaultSettings: SiteSettings = {
    siteName: 'YBS Kulübü',
    description: '',
    logoUrl: '/ekip/logo.jpeg',
    contact: { email: '', phone: '', address: '' },
    socialMedia: { instagram: '', twitter: '', linkedin: '', github: '' },
    stats: { activeMembers: '0', events: '0', projects: '0', yearsOfExperience: '0' },
    maintenanceMode: false
}

export async function getSettings(): Promise<SiteSettings> {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: 'default' }
        })

        if (settings) {
            // Cast JSON fields to expected types
            const contact = settings.contact as SiteSettings['contact'] || defaultSettings.contact
            const socialMedia = settings.socialMedia as SiteSettings['socialMedia'] || defaultSettings.socialMedia
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const stats = settings.stats as any || defaultSettings.stats

            return {
                siteName: settings.siteName,
                description: settings.description,
                logoUrl: (settings as any).logoUrl || defaultSettings.logoUrl,
                contact: { ...defaultSettings.contact, ...contact },
                socialMedia: { ...defaultSettings.socialMedia, ...socialMedia },
                stats: { ...defaultSettings.stats, ...stats },
                maintenanceMode: settings.maintenanceMode
            }
        }

        return defaultSettings
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
                stats: settings.stats,
                maintenanceMode: settings.maintenanceMode
            },
            create: {
                id: 'default',
                siteName: settings.siteName,
                description: settings.description,
                contact: settings.contact,
                socialMedia: settings.socialMedia,
                stats: settings.stats,
                maintenanceMode: settings.maintenanceMode
            }
        })
    } catch (error) {
        console.error('Failed to save settings:', error)
        throw error
    }
}
