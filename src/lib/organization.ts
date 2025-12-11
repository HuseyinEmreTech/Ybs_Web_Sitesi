import fs from 'fs/promises'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'data', 'organization.json')

export type OrganizationNode = {
    id: string;
    title: string;
    roleKeywords: string[];
    department?: string;
    parentId?: string;
    memberCount?: number;
};

export async function getOrganizationChart(): Promise<OrganizationNode[]> {
    try {
        const data = await fs.readFile(CONFIG_FILE, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Failed to read organization chart:', error)
        // Fallback to default if file likely doesn't exist or is corrupt
        return []
    }
}

export async function saveOrganizationChart(chart: OrganizationNode[]): Promise<void> {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(chart, null, 2), 'utf-8')
}
