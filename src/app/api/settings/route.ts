import { NextResponse } from 'next/server'
import { getSettings, saveSettings, type Settings } from '@/lib/data'

export async function GET() {
    try {
        const settings = await getSettings()
        return NextResponse.json(settings)
    } catch (error) {
        console.error('Get settings error:', error)
        return NextResponse.json({ error: 'Ayarlar alınamadı' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body: Settings = await request.json()
        await saveSettings(body)
        return NextResponse.json(body)
    } catch (error) {
        console.error('Update settings error:', error)
        return NextResponse.json({ error: 'Ayarlar güncellenemedi' }, { status: 500 })
    }
}
