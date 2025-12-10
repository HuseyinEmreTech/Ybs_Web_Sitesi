import { NextResponse } from 'next/server'
import { getOrganizationChart, saveOrganizationChart } from '@/lib/organization'

export async function GET() {
    const chart = await getOrganizationChart()
    return NextResponse.json(chart)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        await saveOrganizationChart(body)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to save organization chart:', error)
        return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 })
    }
}
