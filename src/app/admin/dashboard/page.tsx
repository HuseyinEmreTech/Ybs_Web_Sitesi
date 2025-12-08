'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
    posts: number
    events: number
    team: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ posts: 0, events: 0, team: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    async function fetchStats() {
        try {
            const [postsRes, eventsRes, teamRes] = await Promise.all([
                fetch('/api/posts'),
                fetch('/api/events'),
                fetch('/api/team'),
            ])

            const [posts, events, team] = await Promise.all([
                postsRes.json(),
                eventsRes.json(),
                teamRes.json(),
            ])

            setStats({
                posts: Array.isArray(posts) ? posts.length : 0,
                events: Array.isArray(events) ? events.length : 0,
                team: Array.isArray(team) ? team.length : 0,
            })
        } catch (error) {
            console.error('Failed to fetch stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        { label: 'Blog Yazıları', value: stats.posts, icon: '📝', href: '/admin/blog', color: 'indigo' },
        { label: 'Etkinlikler', value: stats.events, icon: '🎉', href: '/admin/etkinlikler', color: 'purple' },
        { label: 'Ekip Üyeleri', value: stats.team, icon: '👥', href: '/admin/ekip', color: 'pink' },
    ]

    const quickActions = [
        { label: 'Yeni Yazı', href: '/admin/blog?new=true', icon: '✏️' },
        { label: 'Yeni Etkinlik', href: '/admin/etkinlikler?new=true', icon: '📅' },
        { label: 'Üye Ekle', href: '/admin/ekip?new=true', icon: '👤' },
        { label: 'Ayarlar', href: '/admin/ayarlar', icon: '⚙️' },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">YBS Kulübü yönetim paneline hoş geldiniz</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-slate-200 dark:border-slate-700"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                                    {loading ? '...' : card.value}
                                </p>
                            </div>
                            <div className="text-4xl">{card.icon}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Hızlı İşlemler</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                        >
                            <span className="text-2xl">{action.icon}</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <h2 className="text-xl font-bold mb-2">🚀 Başlamaya Hazır!</h2>
                <p className="text-indigo-100">
                    Sol menüden blog yazıları, etkinlikler ve ekip üyelerini yönetebilirsiniz.
                    Ayarlar bölümünden site istatistiklerini ve iletişim bilgilerini güncelleyebilirsiniz.
                </p>
            </div>
        </div>
    )
}
