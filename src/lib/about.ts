import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'about.json')

export interface AboutData {
    hero: {
        title: string
        description: string
    }
    story: {
        title: string
        content: string
    }
    mission: {
        title: string
        description: string
    }
    vision: {
        title: string
        description: string
    }
    values: {
        title: string
        description: string
    }[]
}

export async function getAboutData(): Promise<AboutData> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        // Return default structure if file incomplete or missing (though we created it)
        return {
            hero: { title: 'Hakkımızda', description: '' },
            story: { title: 'Hikayemiz', content: '' },
            mission: { title: 'Misyonumuz', description: '' },
            vision: { title: 'Vizyonumuz', description: '' },
            values: []
        }
    }
}

export async function saveAboutData(data: AboutData) {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}
