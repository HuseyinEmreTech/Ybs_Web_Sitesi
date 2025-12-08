'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface TeamMember {
    id: string
    name: string
    role: string
    department: string
    bio: string
    imageUrl?: string
    socialLinks: {
        linkedin?: string
        twitter?: string
        github?: string
        instagram?: string
    }
    order: number
}

const departments = ['Yönetim', 'Teknik', 'Etkinlik', 'İletişim', 'Sponsor', 'Tasarım']

export default function TeamManagement() {
    const [members, setMembers] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<TeamMember | null>(null)
    const [showForm, setShowForm] = useState(false)
    const searchParams = useSearchParams()

    const [form, setForm] = useState({
        name: '',
        role: '',
        department: 'Yönetim',
        bio: '',
        imageUrl: '',
        linkedin: '',
        twitter: '',
        github: '',
        instagram: '',
        order: 0,
    })

    useEffect(() => {
        fetchMembers()
        if (searchParams.get('new') === 'true') {
            setShowForm(true)
        }
    }, [searchParams])

    async function fetchMembers() {
        try {
            const res = await fetch('/api/team')
            const data = await res.json()
            setMembers(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to fetch team:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        try {
            const method = editing ? 'PUT' : 'POST'
            const body = {
                ...(editing ? { id: editing.id } : {}),
                name: form.name,
                role: form.role,
                department: form.department,
                bio: form.bio,
                imageUrl: form.imageUrl,
                socialLinks: {
                    linkedin: form.linkedin || undefined,
                    twitter: form.twitter || undefined,
                    github: form.github || undefined,
                    instagram: form.instagram || undefined,
                },
                order: form.order,
            }

            const res = await fetch('/api/team', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                fetchMembers()
                resetForm()
            }
        } catch (error) {
            console.error('Failed to save member:', error)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bu üyeyi silmek istediğinize emin misiniz?')) return
        try {
            const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' })
            if (res.ok) fetchMembers()
        } catch (error) {
            console.error('Failed to delete member:', error)
        }
    }

    function resetForm() {
        setForm({ name: '', role: '', department: 'Yönetim', bio: '', imageUrl: '', linkedin: '', twitter: '', github: '', instagram: '', order: members.length })
        setEditing(null)
        setShowForm(false)
    }

    function startEdit(member: TeamMember) {
        setForm({
            name: member.name,
            role: member.role,
            department: member.department,
            bio: member.bio,
            imageUrl: member.imageUrl || '',
            linkedin: member.socialLinks?.linkedin || '',
            twitter: member.socialLinks?.twitter || '',
            github: member.socialLinks?.github || '',
            instagram: member.socialLinks?.instagram || '',
            order: member.order,
        })
        setEditing(member)
        setShowForm(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Ekip Üyeleri</h1>
                    <p className="text-slate-500 dark:text-slate-400">Kulüp ekibini yönetin</p>
                </div>
                <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">
                    + Yeni Üye
                </button>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        {editing ? 'Üyeyi Düzenle' : 'Yeni Üye'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ad Soyad</label>
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pozisyon</label>
                                <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Örn: Başkan" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Departman</label>
                                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                                    {departments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Biyografi</label>
                            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fotoğraf URL</label>
                                <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sıralama</label>
                                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn</label>
                                <input type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="URL" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Twitter</label>
                                <input type="url" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="URL" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub</label>
                                <input type="url" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="URL" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Instagram</label>
                                <input type="url" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="URL" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">{editing ? 'Güncelle' : 'Kaydet'}</button>
                            <button type="button" onClick={resetForm} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium">İptal</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Yükleniyor...</div>
                ) : members.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Henüz üye yok.</div>
                ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {members.map((member) => (
                            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-slate-800 dark:text-white">{member.name}</h3>
                                        <p className="text-sm text-slate-500">{member.role} • {member.department}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => startEdit(member)} className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg">Düzenle</button>
                                    <button onClick={() => handleDelete(member.id)} className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">Sil</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
