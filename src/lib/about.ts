import { prisma } from '@/lib/prisma'
import { AboutData } from '@/lib/types'
import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'about.json')

export async function getAboutData(): Promise<AboutData> {
    try {
        console.log('getAboutData: Fetching from DB...')
        const record = await prisma.about.findUnique({
            where: { id: 'default' }
        })

        if (record) {
            console.log('getAboutData: Found in DB')
            return {
                hero: record.hero as AboutData['hero'],
                story: record.story as AboutData['story'],
                mission: record.mission as AboutData['mission'],
                vision: record.vision as AboutData['vision'],
                values: record.values as AboutData['values']
            }
        }

        console.log('getAboutData: Not found in DB, trying file...')
        // Fallback: Try JSON file
        try {
            const fileData = await fs.readFile(DATA_FILE, 'utf-8')
            const parsed = JSON.parse(fileData)

            // Migrate to DB
            console.log('getAboutData: Migrating from file to DB...')
            await saveAboutData(parsed)

            return parsed
        } catch (fileError) {
            console.log('getAboutData: File not found or invalid, using defaults')
        }

        return {
            hero: { title: 'Hakkımızda', description: '' },
            story: { title: 'Hikayemiz', content: '' },
            mission: { title: 'Misyonumuz', description: '' },
            vision: { title: 'Vizyonumuz', description: '' },
            values: []
        }
    } catch (error) {
        console.error('getAboutData Error:', error)
        throw error
    }
}

export async function saveAboutData(data: AboutData) {
    try {
        console.log('saveAboutData: Saving to DB...')
        await prisma.about.upsert({
            where: { id: 'default' },
            create: {
                id: 'default',
                hero: data.hero,
                story: data.story,
                mission: data.mission,
                vision: data.vision,
                values: data.values
            },
            update: {
                hero: data.hero,
                story: data.story,
                mission: data.mission,
                vision: data.vision,
                values: data.values
            }
        })
        console.log('saveAboutData: Saved successfully')
    } catch (error) {
        console.error('saveAboutData Error:', error)
        throw error
    }
}
