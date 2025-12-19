'use client'

import { useState, useEffect } from 'react'
import type { ContactMessage } from '@/lib/messages'
import { logger } from '@/lib/logger'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import { CardSkeleton } from '@/components/admin/LoadingSkeleton'

export default function MessagesAdminPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)

    const [error, setError] = useState('')

    const fetchMessages = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/messages')
            if (!res.ok) {
                if (res.status === 401) {
                    setError('Yetkiniz yok. Lütfen giriş yapın.')
                    return
                }
                throw new Error('API hatası')
            }
            const data = await res.json()
            setMessages(data)
        } catch (error) {
            logger.error('Failed to fetch messages', { error })
            setError('Mesajlar yüklenemedi.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleMarkAsRead = async (id: string) => {
        try {
            const res = await fetch('/api/messages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'read', id })
            })
            if (res.ok) {
                fetchMessages()
            } else if (res.status === 401) {
                setError('Yetkiniz yok. Lütfen giriş yapın.')
            }
        } catch (error) {
            logger.error('Failed to mark message as read', { error, messageId: id })
            setError('İşlem başarısız oldu.')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return

        try {
            const res = await fetch(`/api/messages?id=${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                fetchMessages()
            } else if (res.status === 401) {
                setError('Yetkiniz yok. Lütfen giriş yapın.')
            }
        } catch (error) {
            logger.error('Failed to delete message', { error, messageId: id })
            setError('İşlem başarısız oldu.')
        }
    }

    if (loading) {
        return (
            <div className="space-y-8 pb-12">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gelen Kutusu</h1>
                    <p className="text-slate-500 dark:text-slate-400">İletişim formundan gelen mesajları yönetin.</p>
                </div>
                <div className="grid gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={fetchMessages}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                    Tekrar Dene
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gelen Kutusu</h1>
                <p className="text-slate-500 dark:text-slate-400">İletişim formundan gelen mesajları yönetin.</p>
            </div>

            {messages.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 p-12 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Henüz mesaj yok</h3>
                    <p className="text-slate-500 dark:text-slate-400">Gelen mesajlar burada listelenecek.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`bg-white dark:bg-slate-800 p-6 rounded-xl border transition-all ${message.read
                                ? 'border-slate-200 dark:border-slate-700 opacity-75'
                                : 'border-indigo-200 dark:border-indigo-900 shadow-md ring-1 ring-indigo-50 dark:ring-indigo-900/20'
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{message.subject}</h3>
                                        {!message.read && (
                                            <span className="px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded-full">
                                                YENİ
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                        {message.name} &lt;{message.email}&gt;
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        {new Date(message.createdAt).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {!message.read && (
                                        <button
                                            onClick={() => handleMarkAsRead(message.id)}
                                            className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                        >
                                            Okundu İşaretle
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(message.id)}
                                        className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                                <p className="whitespace-pre-wrap break-words">{message.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
