'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Project } from '@/lib/data'
import Section from '@/components/Section'

interface ProjectsViewProps {
    initialProjects: Project[]
}

const statusLabels: Record<string, { label: string; color: string }> = {
    devam: { label: 'Devam Ediyor', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    tamamlandi: { label: 'Tamamlandı', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    planlaniyor: { label: 'Planlanıyor', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
}

export default function ProjectsView({ initialProjects }: ProjectsViewProps) {
    const [filter, setFilter] = useState<'all' | 'devam' | 'tamamlandi' | 'planlaniyor'>('all')
    const [selectedTech, setSelectedTech] = useState<string | null>(null)

    // Extract all unique technologies
    const allTechnologies = useMemo(() => {
        const techs = new Set<string>()
        initialProjects.forEach(p => p.technologies?.forEach(t => techs.add(t)))
        return Array.from(techs).sort()
    }, [initialProjects])

    // Filter projects
    const filteredProjects = useMemo(() => {
        return initialProjects.filter(project => {
            const matchesStatus = filter === 'all' || project.status === filter
            const matchesTech = selectedTech === null || project.technologies?.includes(selectedTech)
            return matchesStatus && matchesTech
        })
    }, [initialProjects, filter, selectedTech])

    return (
        <Section className="bg-slate-50 dark:bg-slate-900/50">
            {/* Filters */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                {/* Status Filter */}
                <div className="flex w-full sm:w-auto p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-2 sm:flex sm:flex-row w-full gap-1">
                        {(['all', 'devam', 'tamamlandi', 'planlaniyor'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all w-full sm:w-auto ${filter === status
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                                    }`}
                            >
                                {status === 'all' ? 'Tümü' : statusLabels[status]?.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tech Filter (Dropdown or Scrollable List) - Simplified as badges here */}
                {allTechnologies.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 max-w-full no-scrollbar">
                        <button
                            onClick={() => setSelectedTech(null)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${selectedTech === null
                                ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900'
                                : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                }`}
                        >
                            Tüm Teknolojiler
                        </button>
                        {allTechnologies.map(tech => (
                            <button
                                key={tech}
                                onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${selectedTech === tech
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:border-indigo-300'
                                    }`}
                            >
                                {tech}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Grid */}
            <AnimatePresence mode='popLayout'>
                {filteredProjects.length > 0 ? (
                    <motion.div
                        layout
                        className="grid gap-8 md:grid-cols-2"
                    >
                        {filteredProjects.map((project) => (
                            <motion.article
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                key={project.id}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group flex flex-col h-full"
                            >
                                {/* Image */}
                                <div className="aspect-video relative bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                                    {project.imageUrl ? (
                                        <Image
                                            src={project.imageUrl}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 flex items-center justify-center">
                                            <span className="text-4xl filter grayscale opacity-50">🚀</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    {/* Status & Year */}
                                    <div className="flex items-center gap-3 mb-3">
                                        {project.status && (
                                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusLabels[project.status]?.color || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                                                {statusLabels[project.status]?.label || project.status}
                                            </span>
                                        )}
                                        {project.year && (
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{project.year}</span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {project.title}
                                    </h2>

                                    {/* Description */}
                                    {project.description && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                                            {project.description}
                                        </p>
                                    )}

                                    {/* Technologies */}
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="mt-auto flex flex-wrap gap-1.5 mb-4">
                                            {project.technologies.slice(0, 5).map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-md"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies.length > 5 && (
                                                <span className="px-2 py-1 text-[10px] font-semibold text-slate-400">+ {project.technologies.length - 5}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Links */}
                                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                                </svg>
                                                GitHub
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Proje Bulunamadı</h3>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Seçilen filtrelere uygun proje yok.
                        </p>
                    </div>
                )}
            </AnimatePresence>
        </Section>
    )
}
