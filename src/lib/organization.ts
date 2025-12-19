import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { logger } from '@/lib/logger'

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
        logger.error('Failed to read organization chart', { error })
        return []
    }
}

export async function saveOrganizationChart(chart: OrganizationNode[]): Promise<void> {
    try {
        await prisma.organizationChart.upsert({
            where: { id: 'default' },
            update: { nodes: chart as Prisma.InputJsonValue },
            create: {
                id: 'default',
                nodes: chart as Prisma.InputJsonValue
            }
        })
    } catch (error) {
        logger.error('Failed to save organization chart', { error })
        throw error
    }
}
