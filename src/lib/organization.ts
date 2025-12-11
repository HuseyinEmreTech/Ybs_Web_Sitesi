import { prisma } from '@/lib/prisma'
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
        // 1. Try to get from Database
        const chart = await prisma.organizationChart.findUnique({
            where: { id: 'default' }
        })

        if (chart && chart.nodes) {
            return chart.nodes as OrganizationNode[]
        }

        // 2. Fallback: Try to read from local JSON (Lazy Migration)
        try {
            const data = await fs.readFile(CONFIG_FILE, 'utf-8')
            const nodes = JSON.parse(data)

            // Save to DB for next time
            if (nodes && Array.isArray(nodes)) {
                await saveOrganizationChart(nodes)
                return nodes
            }
        } catch (ignored) {
            // JSON file missing or invalid
        }

        return []
    } catch (error) {
        console.error('Failed to read organization chart:', error)
        return []
    }
}

export async function saveOrganizationChart(chart: OrganizationNode[]): Promise<void> {
    try {
        await prisma.organizationChart.upsert({
            where: { id: 'default' },
            update: { nodes: chart as any }, // strict typing for Json might need 'as any' or proper InputJsonValue
            create: {
                id: 'default',
                nodes: chart as any
            }
        })
    } catch (error) {
        console.error('Failed to save organization chart:', error)
        throw error
    }
}
