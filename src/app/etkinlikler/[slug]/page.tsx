import { notFound } from 'next/navigation'
import { getEventBySlug } from '@/lib/data'

export const revalidate = 300 // ISR: Cache for 5 minutes

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) return { title: 'Etkinlik Bulunamadı' }

  return {
    title: event.title,
    description: event.description,
  }
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const eventDate = new Date(event.date)
  const isPast = eventDate < new Date()

  return (
    <article className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full">
              {event.eventType}
            </span>
            {isPast && (
              <span className="px-3 py-1 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
                Geçmiş Etkinlik
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {event.title}
          </h1>
          {event.description && (
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              {event.description}
            </p>
          )}
        </header>

        {/* Event Details */}
        <div className="mb-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">📅 Tarih</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                {eventDate.toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            {event.time && (
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">🕐 Saat</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-white">{event.time}</p>
              </div>
            )}
            {event.location && (
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">📍 Konum</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-white">{event.location}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {event.content && (
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            {event.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <a
            href="/etkinlikler"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Tüm Etkinliklere Dön
          </a>
        </div>
      </div>
    </article>
  )
}
