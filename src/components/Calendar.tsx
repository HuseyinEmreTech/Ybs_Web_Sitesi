'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'

interface Event {
    id: string
    title: string
    slug: string
    date: string
    eventType: string
}

interface CalendarProps {
    events: Event[]
}

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const MONTHS = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
]

export default function Calendar({ events }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get first day of month and total days
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()

    // Get the day of week for the first day (0 = Sunday, convert to Monday start)
    let startDay = firstDayOfMonth.getDay() - 1
    if (startDay < 0) startDay = 6

    // Get events for this month
    const monthEvents = events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate.getMonth() === month && eventDate.getFullYear() === year
    })

    // Create calendar grid
    const calendarDays: (number | null)[] = []
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day)
    }

    // Get events for a specific day
    const getEventsForDay = (day: number) => {
        return monthEvents.filter(event => {
            const eventDate = new Date(event.date)
            return eventDate.getDate() === day
        })
    }

    // Navigate months
    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
        setSelectedDate(null)
    }

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
        setSelectedDate(null)
    }

    const goToToday = () => {
        setCurrentDate(new Date())
        setSelectedDate(null)
    }

    // Get events for selected date
    const selectedDayEvents = selectedDate
        ? getEventsForDay(selectedDate.getDate())
        : []

    const isToday = (day: number) => {
        const today = new Date()
        return day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                        {MONTHS[month]} {year}
                    </h3>
                    <button
                        onClick={goToToday}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        Bugüne Git
                    </button>
                </div>

                <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
                {DAYS.map(day => (
                    <div key={day} className="py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                    const dayEvents = day ? getEventsForDay(day) : []
                    const hasEvents = dayEvents.length > 0
                    const isSelected = selectedDate && day === selectedDate.getDate()

                    return (
                        <div
                            key={index}
                            onClick={() => day && setSelectedDate(new Date(year, month, day))}
                            className={`
                min-h-[80px] p-2 border-b border-r border-slate-100 dark:border-slate-700 
                ${day ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : 'bg-slate-50 dark:bg-slate-800/50'}
                ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}
                transition-colors
              `}
                        >
                            {day && (
                                <>
                                    <span className={`
                    inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium
                    ${isToday(day) ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300'}
                  `}>
                                        {day}
                                    </span>
                                    {hasEvents && (
                                        <div className="mt-1 space-y-1">
                                            {dayEvents.slice(0, 2).map(event => (
                                                <div
                                                    key={event.id}
                                                    className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded truncate"
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                            {dayEvents.length > 2 && (
                                                <div className="text-xs text-slate-500">+{dayEvents.length - 2} daha</div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Selected Day Events */}
            <AnimatePresence>
                {selectedDate && selectedDayEvents.length > 0 && (
                    <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-200 dark:border-slate-700"
                    >
                        <div className="p-4">
                            <h4 className="text-sm font-medium text-slate-800 dark:text-white mb-3">
                                {selectedDate.getDate()} {MONTHS[month]} Etkinlikleri
                            </h4>
                            <div className="space-y-2">
                                {selectedDayEvents.map(event => (
                                    <a
                                        key={event.id}
                                        href={`/etkinlikler/${event.slug}`}
                                        className="block p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded">
                                                {event.eventType}
                                            </span>
                                            <span className="font-medium text-slate-800 dark:text-white">{event.title}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    )
}
