import { NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/settings'
import { requireAuth } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function GET() {
    try {
        const data = await getSettings()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth()

        const data = await request.json()
        await saveSettings(data)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        logger.error('Save settings error', { error })
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }
}
