'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ImageInput from '@/components/admin/ImageInput'
import { logger } from '@/lib/logger'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import { TableSkeleton } from '@/components/admin/LoadingSkeleton'


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

interface OrganizationNode {
    id: string
    title: string
    roleKeywords: string[]
    department?: string
}

const DEFAULT_DEPARTMENTS = ['Yönetim', 'Teknik', 'Etkinlik', 'İletişim', 'Sponsor', 'Tasarım', 'Sosyal Medya']

export default function TeamManagement() {
    const [members, setMembers] = useState<TeamMember[]>([])
    const [chart, setChart] = useState<OrganizationNode[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<TeamMember | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState('')
    const searchParams = useSearchParams()

    const [form, setForm] = useState({
        name: '',
        role: '',
        department: '',
        bio: '',
        imageUrl: '',
        linkedin: '',
        twitter: '',
        github: '',
        instagram: '',
        order: 0,
    })

    useEffect(() => {
        Promise.all([fetchMembers(), fetchChart()]).finally(() => setLoading(false))
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
            logger.error('Failed to fetch team members', { error })
        }
    }

    async function fetchChart() {
        try {
            const res = await fetch('/api/organization')
            const data = await res.json()
            setChart(Array.isArray(data) ? data : [])
        } catch (error) {
            logger.error('Failed to fetch organization chart', { error })
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
                department: form.department || 'Yönetim', // Fallback
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
            logger.error('Failed to save team member', { error, memberId: editing?.id })
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bu üyeyi silmek istediğinize emin misiniz?')) return
        try {
            const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' })
            if (res.ok) fetchMembers()
        } catch (error) {
            logger.error('Failed to delete team member', { error, memberId: id })
        }
    }

    function resetForm() {
        setForm({ name: '', role: '', department: '', bio: '', imageUrl: '', linkedin: '', twitter: '', github: '', instagram: '', order: members.length })
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

    // Get unique departments from both defaults and chart
    const availableDepartments = Array.from(new Set([
        ...DEFAULT_DEPARTMENTS,
        ...chart.map(n => n.department).filter(Boolean) as string[]
    ])).sort();

    // Handle Role Change to auto-fill Department
    const handleRoleChange = (newRole: string) => {
        const node = chart.find(n => n.title === newRole)
        let newDept = form.department;
        if (node?.department) {
            newDept = node.department
        }
        setForm({ ...form, role: newRole, department: newDept })
    }

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.department.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesDept = departmentFilter ? member.department === departmentFilter : true
        return matchesSearch && matchesDept
    })

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

                            {/* Role Select */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pozisyon (Rol)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        list="roles-list"
                                        value={form.role}
                                        onChange={(e) => handleRoleChange(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                        placeholder="Seçiniz veya yazınız"
                                    />
                                    <datalist id="roles-list">
                                        {chart.map(node => (
                                            <option key={node.id} value={node.title} />
                                        ))}
                                    </datalist>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">Şemadan otomatik öneriler sunulur. Birden fazla rol için virgül (,) kullanın.</p>
                            </div>

                            {/* Department Select */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Departman</label>
                                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                                    <option value="" disabled>Seçiniz</option>
                                    {availableDepartments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Biyografi</label>
                            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                        </div>

                        {/* Image & Order */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <ImageInput
                                    label="Fotoğraf URL"
                                    value={form.imageUrl}
                                    onChange={(val) => setForm({ ...form, imageUrl: val })}
                                    placeholder="/ekip/ad-soyad.jpg"
                                    helpText="Projenin public/ekip klasörüne attığınız resmin yolunu (/ekip/resim.jpg) veya dış bağlantı yazın."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sıralama</label>
                                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                            </div>
                        </div>

                        {/* Social Links */}
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

            {/* Search and Filters */}
            {!showForm && (
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="🔍 Üye ara (İsim, Rol veya Departman)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-10 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none min-w-[200px]"
                    >
                        <option value="">Tüm Departmanlar</option>
                        {availableDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="p-12">
                        <TableSkeleton rows={5} />
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        {searchTerm || departmentFilter ? 'Aradığınız kriterlere uygun üye bulunamadı.' : 'Henüz üye yok.'}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredMembers.map((member) => (
                            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    {member.imageUrl ? (
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-medium text-slate-800 dark:text-white">{member.name}</h3>
                                        <p className="text-sm text-slate-500">{member.role} • {member.department}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => startEdit(member)} className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors">Düzenle</button>
                                    <button onClick={() => handleDelete(member.id)} className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors">Sil</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* <OrganizationEditor /> Removed - moved to /admin/yapilandirma */}

        </div>
    )
}
