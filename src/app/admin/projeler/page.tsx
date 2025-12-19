'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import { TableSkeleton } from '@/components/admin/LoadingSkeleton'

interface Project {
    id: string
    title: string
    status: string
    technologies: string[]
    createdAt: string
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchProjects()
    }, [])

    async function fetchProjects() {
        try {
            const res = await fetch('/api/projects')
            const data = await res.json()
            if (Array.isArray(data)) {
                setProjects(data)
            }
        } catch (error) {
            logger.error('Failed to fetch projects', { error })
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return

        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setProjects(projects.filter(p => p.id !== id))
            } else {
                alert('Silme işlemi başarısız oldu')
            }
        } catch (error) {
            logger.error('Failed to delete project', { error, projectId: id })
            alert('Bir hata oluştu')
        }
    }

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Projeler</h1>
                        <p className="text-slate-500 dark:text-slate-400">Projeleri yönetin ve düzenleyin</p>
                    </div>
                </div>
                <TableSkeleton rows={5} />
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Projeler</h1>
                    <p className="text-slate-500 dark:text-slate-400">Projeleri yönetin ve düzenleyin</p>
                </div>
                <Link
                    href="/admin/projeler/yeni"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + Yeni Proje
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Proje Adı</th>
                            <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Durum</th>
                            <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Teknolojiler</th>
                            <th className="p-4 font-medium text-slate-500 dark:text-slate-400 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    Henüz proje eklenmemiş.
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="p-4">
                                        <span className="font-medium text-slate-900 dark:text-white">{project.title}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${project.status === 'devam' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                project.status === 'tamamlandi' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                            }`}>
                                            {project.status === 'devam' ? 'Devam Ediyor' :
                                                project.status === 'tamamlandi' ? 'Tamamlandı' : 'Planlanıyor'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {project.technologies.slice(0, 3).map(tech => (
                                                <span key={tech} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies.length > 3 && (
                                                <span className="text-xs text-slate-500">+{project.technologies.length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/projeler/${project.id}`}
                                                className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                                            >
                                                Düzenle
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
