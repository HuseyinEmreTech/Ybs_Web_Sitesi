import { NextResponse } from 'next/server'
import { getAboutData, saveAboutData } from '@/lib/about'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const data = await getAboutData()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        await saveAboutData(data)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
    }
}
