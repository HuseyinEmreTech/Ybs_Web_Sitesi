'use client'

import { useState, useEffect } from 'react'
import type { SiteSettings } from '@/lib/settings'
import ImageInput from '@/components/admin/ImageInput'

export default function SettingsAdminPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [error, setError] = useState('')

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = () => {
        setLoading(true)
        setError('')
        fetch('/api/settings')
            .then(res => {
                if (!res.ok) throw new Error('API yanıt vermedi')
                return res.json()
            })
            .then(data => {
                setSettings(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setError('Ayarlar yüklenirken bir hata oluştu.')
                setLoading(false)
            })
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        if (!settings) return

        setSaving(true)
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            })
            if (res.ok) {
                alert('Ayarlar kaydedildi!')
            } else {
                alert('Hata oluştu')
            }
        } catch (error) {
            console.error(error)
            alert('Hata oluştu')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Ayarlar yükleniyor...</div>

    if (error) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={fetchSettings}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                    Tekrar Dene
                </button>
            </div>
        )
    }

    if (!settings) return <div className="p-8 text-center text-slate-500">Ayarlar bulunamadı.</div>

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Site Ayarları</h1>
                    <p className="text-slate-500 dark:text-slate-400">Genel site yapılandırması ve iletişim bilgileri.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold disabled:opacity-50 transition-colors"
                >
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
                {/* General Info */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">Genel Bilgiler</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Site Adı</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        {/* Logo Input */}
                        <ImageInput
                            label="Site Logosu (URL)"
                            value={settings.logoUrl || ''}
                            onChange={(val) => setSettings({ ...settings, logoUrl: val })}
                            placeholder="https://example.com/logo.png"
                            helpText="Logonun şeffaf arka planlı (PNG/WEBP) olması önerilir."
                        />

                        <div>
                            <label className="block text-sm font-medium mb-1">Site Açıklaması (Footer)</label>
                            <textarea
                                value={settings.description}
                                onChange={e => setSettings({ ...settings, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">İletişim Bilgileri</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">E-posta</label>
                            <input
                                type="email"
                                value={settings.contact?.email || ''}
                                onChange={e => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Telefon</label>
                            <input
                                type="text"
                                value={settings.contact?.phone || ''}
                                onChange={e => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Adres</label>
                            <input
                                type="text"
                                value={settings.contact?.address || ''}
                                onChange={e => setSettings({ ...settings, contact: { ...settings.contact, address: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">Sosyal Medya Linkleri</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-sm font-medium">Instagram</span>
                            <input
                                type="text"
                                value={settings.socialMedia?.instagram || ''}
                                onChange={e => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, instagram: e.target.value } })}
                                className="flex-1 px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-sm font-medium">Twitter (X)</span>
                            <input
                                type="text"
                                value={settings.socialMedia?.twitter || ''}
                                onChange={e => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, twitter: e.target.value } })}
                                className="flex-1 px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-sm font-medium">LinkedIn</span>
                            <input
                                type="text"
                                value={settings.socialMedia?.linkedin || ''}
                                onChange={e => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, linkedin: e.target.value } })}
                                className="flex-1 px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-sm font-medium">GitHub</span>
                            <input
                                type="text"
                                value={settings.socialMedia?.github || ''}
                                onChange={e => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, github: e.target.value } })}
                                className="flex-1 px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">İstatistikler (Sayaçlar)</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Aktif Üye Sayısı</label>
                            <input
                                type="text"
                                value={settings.stats?.activeMembers || ''}
                                onChange={e => setSettings({ ...settings, stats: { ...settings.stats, activeMembers: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Etkinlik Sayısı</label>
                            <input
                                type="text"
                                value={settings.stats?.events || ''}
                                onChange={e => setSettings({ ...settings, stats: { ...settings.stats, events: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Proje Sayısı</label>
                            <input
                                type="text"
                                value={settings.stats?.projects || ''}
                                onChange={e => setSettings({ ...settings, stats: { ...settings.stats, projects: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Yıllık Deneyim</label>
                            <input
                                type="text"
                                value={settings.stats?.yearsOfExperience || ''}
                                onChange={e => setSettings({ ...settings, stats: { ...settings.stats, yearsOfExperience: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Maintenance Mode */}
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-red-600 dark:text-red-400">Bakım Modu</h2>
                            <p className="text-sm text-red-700 dark:text-red-300">Bu özellik aktif edildiğinde site ziyaretçilere kapatılır.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.maintenanceMode}
                                onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>
                </div>
            </form>
        </div>
    )
}
