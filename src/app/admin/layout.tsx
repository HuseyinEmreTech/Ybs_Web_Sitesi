'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

interface User {
    email: string
    name: string
    imageUrl?: string | null
    role: string
}

const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/blog', label: 'Blog Yazıları', icon: '📝' },
    { href: '/admin/etkinlikler', label: 'Etkinlikler', icon: '🎉' },
    { href: '/admin/ekip', label: 'Ekip', icon: '👥' },
    { href: '/admin/yapilandirma', label: 'Yapılandırma', icon: '🏗️' },
    { href: '/admin/hakkimizda', label: 'Hakkımızda', icon: '🏢' },
    { href: '/admin/mesajlar', label: 'Gelen Kutusu', icon: '✉️' },
    { href: '/admin/ayarlar', label: 'Site Ayarları', icon: '⚙️' },
    { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: '🔐' },
    { href: '/admin/projeler', label: 'Projeler', icon: '🚀' },
    { href: '/admin/rehber', label: 'Rehber', icon: '📚' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        checkAuth()
    }, [])

    async function checkAuth() {
        try {
            const res = await fetch('/api/auth')
            const data = await res.json()

            if (data.authenticated) {
                setUser(data.user)
            } else if (pathname !== '/admin') {
                router.push('/admin')
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            router.push('/admin')
        } finally {
            setLoading(false)
        }
    }

    async function handleLogout() {
        await fetch('/api/auth', { method: 'DELETE' })
        router.push('/admin')
    }

    // Login page doesn't need the layout
    if (pathname === '/admin') {
        return <>{children}</>
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            🎓 YBS Admin
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-medium'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                            {user.imageUrl ? (
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            🚪 Çıkış Yap
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed bottom-4 right-4 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg"
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            {/* Main Content */}
            <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
