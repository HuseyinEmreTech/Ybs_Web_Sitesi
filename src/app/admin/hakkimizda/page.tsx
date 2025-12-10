'use client'

import { useState, useEffect } from 'react'
import type { AboutData } from '@/lib/about'

export default function AboutAdminPage() {
    const [data, setData] = useState<AboutData | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetch('/api/about')
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        if (!data) return

        setSaving(true)
        try {
            const res = await fetch('/api/about', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                alert('Kaydedildi!')
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

    if (loading || !data) return <div className="p-8 text-center">Yükleniyor...</div>

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Hakkımızda Sayfası</h1>
                    <p className="text-slate-500 dark:text-slate-400">Kurumsal bilgileri düzenleyin</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold disabled:opacity-50"
                >
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
                {/* Hero Section */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">Üst Alan (Hero)</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Başlık</label>
                            <input
                                type="text"
                                value={data.hero.title}
                                onChange={e => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                                className="w-full px-4 py-2 border rounded bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Açıklama</label>
                            <textarea
                                value={data.hero.description}
                                onChange={e => setData({ ...data, hero: { ...data.hero, description: e.target.value } })}
                                rows={2}
                                className="w-full px-4 py-2 border rounded bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Story Section */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">Hikayemiz</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Başlık</label>
                            <input
                                type="text"
                                value={data.story.title}
                                onChange={e => setData({ ...data, story: { ...data.story, title: e.target.value } })}
                                className="w-full px-4 py-2 border rounded bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">İçerik (Paragraflar arası boşluk bırakın)</label>
                            <textarea
                                value={data.story.content}
                                onChange={e => setData({ ...data, story: { ...data.story, content: e.target.value } })}
                                rows={6}
                                className="w-full px-4 py-2 border rounded bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">Misyon</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Başlık</label>
                                <input
                                    type="text"
                                    value={data.mission.title}
                                    onChange={e => setData({ ...data, mission: { ...data.mission, title: e.target.value } })}
                                    className="w-full px-4 py-2 border rounded bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Açıklama</label>
                                <textarea
                                    value={data.mission.description}
                                    onChange={e => setData({ ...data, mission: { ...data.mission, description: e.target.value } })}
                                    rows={4}
                                    className="w-full px-4 py-2 border rounded bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">Vizyon</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Başlık</label>
                                <input
                                    type="text"
                                    value={data.vision.title}
                                    onChange={e => setData({ ...data, vision: { ...data.vision, title: e.target.value } })}
                                    className="w-full px-4 py-2 border rounded bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Açıklama</label>
                                <textarea
                                    value={data.vision.description}
                                    onChange={e => setData({ ...data, vision: { ...data.vision, description: e.target.value } })}
                                    rows={4}
                                    className="w-full px-4 py-2 border rounded bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Değerlerimiz</h2>
                        <button
                            type="button"
                            onClick={() => setData({ ...data, values: [...data.values, { title: 'Yeni Değer', description: '' }] })}
                            className="text-sm px-3 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                        >
                            + Ekle
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {data.values.map((value, index) => (
                            <div key={index} className="p-4 border border-slate-100 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50 relative group">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newValues = [...data.values]
                                        newValues.splice(index, 1)
                                        setData({ ...data, values: newValues })
                                    }}
                                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Sil
                                </button>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold uppercase text-slate-500">Başlık</label>
                                        <input
                                            type="text"
                                            value={value.title}
                                            onChange={e => {
                                                const newValues = [...data.values]
                                                newValues[index].title = e.target.value
                                                setData({ ...data, values: newValues })
                                            }}
                                            className="w-full px-3 py-1 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold uppercase text-slate-500">Açıklama</label>
                                        <textarea
                                            value={value.description}
                                            onChange={e => {
                                                const newValues = [...data.values]
                                                newValues[index].description = e.target.value
                                                setData({ ...data, values: newValues })
                                            }}
                                            rows={2}
                                            className="w-full px-3 py-1 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    )
}
