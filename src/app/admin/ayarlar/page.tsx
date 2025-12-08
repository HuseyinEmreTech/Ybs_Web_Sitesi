'use client'

import { useState, useEffect } from 'react'

interface Settings {
    stats: {
        activeMembers: string
        events: string
        projects: string
        yearsOfExperience: string
    }
    socialLinks: {
        instagram: string
        twitter: string
        linkedin: string
        github: string
    }
    contact: {
        email: string
        phone: string
        address: string
    }
}

export default function SettingsManagement() {
    const [settings, setSettings] = useState<Settings | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchSettings()
    }, [])

    async function fetchSettings() {
        try {
            const res = await fetch('/api/settings')
            const data = await res.json()
            setSettings(data)
        } catch (error) {
            console.error('Failed to fetch settings:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!settings) return

        setSaving(true)
        setMessage('')

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            })

            if (res.ok) {
                setMessage('✅ Ayarlar başarıyla kaydedildi!')
                setTimeout(() => setMessage(''), 3000)
            }
        } catch (error) {
            setMessage('❌ Kaydetme başarısız')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>
    }

    if (!settings) {
        return <div className="p-8 text-center text-red-500">Ayarlar yüklenemedi</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Site Ayarları</h1>
                <p className="text-slate-500 dark:text-slate-400">Ana sayfa istatistikleri ve iletişim bilgilerini güncelleyin</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Stats Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">📊 İstatistikler</h2>
                    <p className="text-sm text-slate-500 mb-4">Ana sayfada gösterilen istatistik değerleri</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Aktif Üye</label>
                            <input
                                type="text"
                                value={settings.stats.activeMembers}
                                onChange={(e) => setSettings({ ...settings, stats: { ...settings.stats, activeMembers: e.target.value } })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                placeholder="50+"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Etkinlik Sayısı</label>
                            <input
                                type="text"
                                value={settings.stats.events}
                                onChange={(e) => setSettings({ ...settings, stats: { ...settings.stats, events: e.target.value } })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                placeholder="20+"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Proje Sayısı</label>
                            <input
                                type="text"
                                value={settings.stats.projects}
                                onChange={(e) => setSettings({ ...settings, stats: { ...settings.stats, projects: e.target.value } })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                placeholder="10+"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Yıllık Deneyim</label>
                            <input
                                type="text"
                                value={settings.stats.yearsOfExperience}
                                onChange={(e) => setSettings({ ...settings, stats: { ...settings.stats, yearsOfExperience: e.target.value } })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                placeholder="5"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">🔗 Sosyal Medya</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Instagram</label>
                            <input
                                type="url"
                                value={settings.socialLinks.instagram}
                                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Twitter</label>
                            <input
                                type="url"
                                value={settings.socialLinks.twitter}
                                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn</label>
                            <input
                                type="url"
                                value={settings.socialLinks.linkedin}
                                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                placeholder="https://linkedin.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub</label>
                            <input
                                type="url"
                                value={settings.socialLinks.github}
                                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, github: e.target.value } })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">📧 İletişim Bilgileri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-posta</label>
                            <input
                                type="email"
                                value={settings.contact.email}
                                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefon</label>
                            <input
                                type="tel"
                                value={settings.contact.phone}
                                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adres</label>
                            <input
                                type="text"
                                value={settings.contact.address}
                                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, address: e.target.value } })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors"
                    >
                        {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                    {message && (
                        <span className={message.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                            {message}
                        </span>
                    )}
                </div>
            </form>
        </div>
    )
}
