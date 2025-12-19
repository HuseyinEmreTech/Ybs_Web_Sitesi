'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { logger } from '@/lib/logger'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import { TableSkeleton } from '@/components/admin/LoadingSkeleton'

interface Event {
    id: string
    title: string
    slug: string
    description: string
    content: string
    eventType: string
    date: string
    time: string
    location: string
    imageUrl?: string
    createdAt: string
    updatedAt: string
}

const eventTypes = ['Seminer', 'Workshop', 'Söyleşi', 'Eğitim', 'Sosyal', 'Kariyer', 'Diğer']

export default function EventsManagement() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<Event | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const searchParams = useSearchParams()

    const [form, setForm] = useState({
        title: '',
        description: '',
        content: '',
        eventType: 'Seminer',
        date: '',
        time: '',
        location: '',
        imageUrl: '',
    })

    useEffect(() => {
        fetchEvents()
        if (searchParams.get('new') === 'true') {
            setShowForm(true)
        }
    }, [searchParams])

    async function fetchEvents() {
        try {
            const res = await fetch('/api/events')
            const data = await res.json()
            setEvents(Array.isArray(data) ? data : [])
        } catch (error) {
            logger.error('Failed to fetch events', { error })
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        try {
            const method = editing ? 'PUT' : 'POST'
            const body = editing ? { ...form, id: editing.id } : form

            const res = await fetch('/api/events', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                fetchEvents()
                resetForm()
            }
        } catch (error) {
            logger.error('Failed to save event', { error, eventId: editing?.id })
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bu etkinliği silmek istediğinize emin misiniz?')) return

        try {
            const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                fetchEvents()
            }
        } catch (error) {
            logger.error('Failed to delete event', { error, eventId: id })
        }
    }

    function resetForm() {
        setForm({ title: '', description: '', content: '', eventType: 'Seminer', date: '', time: '', location: '', imageUrl: '' })
        setEditing(null)
        setShowForm(false)
    }

    function startEdit(event: Event) {
        setForm({
            title: event.title,
            description: event.description,
            content: event.content,
            eventType: event.eventType,
            date: event.date.split('T')[0],
            time: event.time,
            location: event.location,
            imageUrl: event.imageUrl || '',
        })
        setEditing(event)
        setShowForm(true)
    }

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Etkinlikler</h1>
                    <p className="text-slate-500 dark:text-slate-400">Etkinlikleri yönetin ve yeni etkinlik ekleyin</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                    + Yeni Etkinlik
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        {editing ? 'Etkinliği Düzenle' : 'Yeni Etkinlik'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Başlık</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Etkinlik Türü</label>
                                <select
                                    value={form.eventType}
                                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                >
                                    {eventTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tarih</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Saat</label>
                                <input
                                    type="time"
                                    value={form.time}
                                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Konum</label>
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Örn: Konferans Salonu"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kısa Açıklama</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Detaylı İçerik</label>
                            <textarea
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Görsel URL</label>
                            <input
                                type="url"
                                value={form.imageUrl}
                                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                                {editing ? 'Güncelle' : 'Kaydet'}
                            </button>
                            <button type="button" onClick={resetForm} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors">
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search */}
            {!showForm && (
                <div className="relative">
                    <input
                        type="text"
                        placeholder="🔍 Etkinlik ara (Başlık, tür veya konum)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            )}

            {/* Events List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="p-12">
                        <TableSkeleton rows={5} />
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        {searchTerm ? 'Aradığınız kriterlere uygun etkinlik bulunamadı.' : 'Henüz etkinlik yok.'}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredEvents.map((event) => (
                            <div key={event.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <div className="flex-1">
                                    <h3 className="font-medium text-slate-800 dark:text-white text-lg">{event.title}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold">
                                            {event.eventType}
                                        </span>
                                        <span>📅 {new Date(event.date).toLocaleDateString('tr-TR')}</span>
                                        {event.location && <span>📍 {event.location}</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => startEdit(event)} className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors">
                                        ✏️ Düzenle
                                    </button>
                                    <button onClick={() => handleDelete(event.id)} className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors">
                                        🗑️ Sil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
