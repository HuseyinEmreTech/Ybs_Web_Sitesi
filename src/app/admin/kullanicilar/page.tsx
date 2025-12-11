'use client'

import { useState, useEffect } from 'react'

interface User {
    email: string
    name: string
    role: 'admin' | 'editor'
    imageUrl?: string | null
}

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ email: '', password: '', name: '', role: 'editor' as 'admin' | 'editor', imageUrl: '' })
    const [editEmail, setEditEmail] = useState<string | null>(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        try {
            const res = await fetch('/api/users')
            const data = await res.json()
            setUsers(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to fetch users:', error)
        } finally {
            setLoading(false)
        }
    }

    function startEdit(user: User) {
        setEditEmail(user.email)
        setForm({
            email: user.email,
            password: '', // Don't fill password
            name: user.name,
            role: user.role,
            imageUrl: user.imageUrl || ''
        })
        setShowForm(true)
    }

    function cancelEdit() {
        setEditEmail(null)
        setForm({ email: '', password: '', name: '', role: 'editor', imageUrl: '' })
        setShowForm(false)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setMessage('')

        try {
            const method = editEmail ? 'PUT' : 'POST'
            const body = editEmail
                ? { ...form, currentEmail: editEmail }
                : form

            const res = await fetch('/api/users', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const data = await res.json()

            if (!res.ok) {
                setMessage(`❌ ${data.error}`)
                return
            }

            setMessage(editEmail ? '✅ Kullanıcı güncellendi' : '✅ Kullanıcı eklendi')
            fetchUsers()
            cancelEdit()
            setTimeout(() => setMessage(''), 3000)
        } catch (error) {
            setMessage('❌ Bir hata oluştu')
        }
    }

    async function handleDelete(email: string) {
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return

        try {
            const res = await fetch(`/api/users?email=${encodeURIComponent(email)}`, { method: 'DELETE' })
            const data = await res.json()

            if (!res.ok) {
                setMessage(`❌ ${data.error}`)
                setTimeout(() => setMessage(''), 3000)
                return
            }

            fetchUsers()
        } catch (error) {
            console.error('Failed to delete user:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kullanıcılar</h1>
                    <p className="text-slate-500 dark:text-slate-400">Admin paneline giriş yapabilecek kullanıcıları yönetin</p>
                </div>
                <button onClick={() => { cancelEdit(); setShowForm(true); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">
                    + Kullanıcı Ekle
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                    {message}
                </div>
            )}

            {showForm && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">{editEmail ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ad Soyad</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-posta</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Şifre {editEmail && '(Boş bırakılırsa değişmez)'}</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                    required={!editEmail}
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rol</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value as 'admin' | 'editor' })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    <option value="editor">Editör</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Profil Fotoğrafı URL</label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={form.imageUrl}
                                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                        placeholder="/ekip/ad-soyad.jpg"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Projenin <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">public</code> klasöründeki veya harici bir resim URL'si.
                                    </p>
                                </div>
                                {form.imageUrl && (
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={form.imageUrl}
                                            alt="Önizleme"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=X' }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">{editEmail ? 'Güncelle' : 'Ekle'}</button>
                            <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium">İptal</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Yükleniyor...</div>
                ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {users.map((user) => (
                            <div key={user.email} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <div className="flex items-center gap-4">
                                    {user.imageUrl ? (
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                                            {user.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-medium text-slate-800 dark:text-white">{user.name}</h3>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 text-xs rounded font-medium ${user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                        {user.role === 'admin' ? 'Admin' : 'Editör'}
                                    </span>
                                    <button
                                        onClick={() => startEdit(user)}
                                        className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.email)}
                                        className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
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
