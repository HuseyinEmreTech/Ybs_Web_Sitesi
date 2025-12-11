import { prisma } from '@/lib/prisma'
// fs and path imports removed


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
        const chart = await prisma.organizationChart.findUnique({
            where: { id: 'default' }
        })

        if (chart && chart.nodes) {
            return chart.nodes as OrganizationNode[]
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
