'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import Calendar from '@/components/Calendar'
import ScrollReveal from '@/components/ScrollReveal'

interface Event {
    id: string
    title: string
    slug: string
    description: string
    date: string
    eventType: string
    imageUrl?: string | null
}

interface EventsClientProps {
    upcomingEvents: Event[]
    pastEvents: Event[]
    allEvents: Event[]
}

export default function EventsClient({ upcomingEvents, pastEvents, allEvents }: EventsClientProps) {
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

    return (
        <>
            {/* Header with View Toggle */}
            <section className="py-8 lg:py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Etkinlikler</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Kulübümüzün etkinliklerini keşfedin</p>
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'list'
                                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                    }`}
                            >
                                📋 Liste
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'calendar'
                                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                    }`}
                            >
                                📅 Takvim
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calendar View */}
            {viewMode === 'calendar' && (
                <section className="pb-12">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <ScrollReveal direction="up">
                            <Calendar events={allEvents} />
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <>
                    {/* Upcoming Events */}
                    <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <ScrollReveal direction="left">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Yaklaşan Etkinlikler</h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-8">Kaçırılmayacak etkinliklerimize katılın</p>
                            </ScrollReveal>

                            {upcomingEvents.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {upcomingEvents.map((event, index) => (
                                        <Card
                                            key={event.id}
                                            title={event.title}
                                            description={event.description}
                                            href={`/etkinlikler/${event.slug}`}
                                            date={event.date}
                                            category={event.eventType}
                                            imageUrl={event.imageUrl || undefined}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <p className="text-xl text-slate-500 dark:text-slate-400 mb-4">Yaklaşan etkinlik bulunmuyor</p>
                                    <p className="text-slate-400 dark:text-slate-500">Yeni etkinlikler için bizi takip edin!</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Past Events */}
                    {pastEvents.length > 0 && (
                        <section className="py-12 dark:bg-slate-950">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                <ScrollReveal direction="left">
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Geçmiş Etkinlikler</h2>
                                    <p className="text-slate-500 dark:text-slate-400 mb-8">Daha önce düzenlediğimiz etkinlikler</p>
                                </ScrollReveal>

                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {pastEvents.map((event, index) => (
                                        <Card
                                            key={event.id}
                                            title={event.title}
                                            description={event.description}
                                            href={`/etkinlikler/${event.slug}`}
                                            date={event.date}
                                            category={event.eventType}
                                            imageUrl={event.imageUrl || undefined}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}
        </>
    )
}
