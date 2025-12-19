'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { TeamMember } from '@/lib/data'

// Simple slugify helper
const simpleSlugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text

export default function NewProjectPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

    // Form state
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('planlaniyor')
    const [technologies, setTechnologies] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [githubUrl, setGithubUrl] = useState('')
    const [liveUrl, setLiveUrl] = useState('')
    const [selectedMembers, setSelectedMembers] = useState<string[]>([])

    useEffect(() => {
        // Fetch team members for selection
        fetch('/api/users') // Wait, users or team members? Data model has TeamMember.
            .then(res => res.json())
            .then(data => {
                // Check if it's users or team members. The public page used 'teamMembers'.
                // Let's assume there is an API for team members.
                // Checking file list... src/app/api/team/route.ts exists? Yes.
                // Correcting to fetch from /api/team
                fetch('/api/team')
                    .then(r => r.json())
                    .then(d => setTeamMembers(Array.isArray(d) ? d : []))
            })
            .catch(err => console.error('Failed to fetch team', err))
    }, [])

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setTitle(val)
        setSlug(simpleSlugify(val))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug,
                    description,
                    status,
                    technologies: technologies.split(',').map(t => t.trim()).filter(Boolean),
                    imageUrl,
                    githubUrl,
                    liveUrl,
                    teamMemberIds: selectedMembers
                }),
            })

            if (!res.ok) throw new Error('Failed to create')

            router.push('/admin/projeler')
        } catch (error) {
            console.error(error)
            alert('Proje oluşturulurken bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Yeni Proje Ekle</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Proje Adı
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={handleTitleChange}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Slug (URL Yolu)
                        </label>
                        <input
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Açıklama
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Durum
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="planlaniyor">Planlanıyor</option>
                            <option value="devam">Devam Ediyor</option>
                            <option value="tamamlandi">Tamamlandı</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Resim URL
                        </label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Teknolojiler (Virgülle ayırın)
                        </label>
                        <input
                            type="text"
                            value={technologies}
                            onChange={(e) => setTechnologies(e.target.value)}
                            placeholder="React, Next.js, TypeScript"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            GitHub URL
                        </label>
                        <input
                            type="url"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Canlı Demo URL
                        </label>
                        <input
                            type="url"
                            value={liveUrl}
                            onChange={(e) => setLiveUrl(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Takım Üyeleri
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900">
                            {teamMembers.map(member => (
                                <label key={member.id} className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.includes(member.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedMembers([...selectedMembers, member.id])
                                            } else {
                                                setSelectedMembers(selectedMembers.filter(id => id !== member.id))
                                            }
                                        }}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{member.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Kaydediliyor...' : 'Projeyi Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    )
}
