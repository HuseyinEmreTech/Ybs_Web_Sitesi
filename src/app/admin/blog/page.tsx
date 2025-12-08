'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface Post {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    imageUrl?: string
    publishedAt: string
    createdAt: string
    updatedAt: string
}

const categories = ['Genel', 'Teknoloji', 'Etkinlik', 'Duyuru', 'Eğitim', 'Kariyer']

export default function BlogManagement() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<Post | null>(null)
    const [showForm, setShowForm] = useState(false)
    const searchParams = useSearchParams()

    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Genel',
        imageUrl: '',
    })

    useEffect(() => {
        fetchPosts()
        if (searchParams.get('new') === 'true') {
            setShowForm(true)
        }
    }, [searchParams])

    async function fetchPosts() {
        try {
            const res = await fetch('/api/posts')
            const data = await res.json()
            setPosts(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to fetch posts:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        try {
            const method = editing ? 'PUT' : 'POST'
            const body = editing ? { ...form, id: editing.id } : form

            const res = await fetch('/api/posts', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                fetchPosts()
                resetForm()
            }
        } catch (error) {
            console.error('Failed to save post:', error)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return

        try {
            const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                fetchPosts()
            }
        } catch (error) {
            console.error('Failed to delete post:', error)
        }
    }

    function resetForm() {
        setForm({ title: '', excerpt: '', content: '', category: 'Genel', imageUrl: '' })
        setEditing(null)
        setShowForm(false)
    }

    function startEdit(post: Post) {
        setForm({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            imageUrl: post.imageUrl || '',
        })
        setEditing(post)
        setShowForm(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Blog Yazıları</h1>
                    <p className="text-slate-500 dark:text-slate-400">Yazıları yönetin ve yeni içerik ekleyin</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                    + Yeni Yazı
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        {editing ? 'Yazıyı Düzenle' : 'Yeni Yazı'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Başlık</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Özet</label>
                            <textarea
                                value={form.excerpt}
                                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">İçerik</label>
                            <textarea
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                rows={6}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Görsel URL (opsiyonel)</label>
                            <input
                                type="url"
                                value={form.imageUrl}
                                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                            >
                                {editing ? 'Güncelle' : 'Kaydet'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors"
                            >
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Posts List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Yükleniyor...</div>
                ) : posts.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        Henüz yazı yok. İlk yazınızı ekleyin!
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {posts.map((post) => (
                            <div key={post.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <div className="flex-1">
                                    <h3 className="font-medium text-slate-800 dark:text-white">{post.title}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded">
                                            {post.category}
                                        </span>
                                        <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(post)}
                                        className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                    >
                                        Sil
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
