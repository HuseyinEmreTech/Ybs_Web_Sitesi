import { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { eventsQuery, type Event } from '@/sanity/lib/queries'
import Section from '@/components/Section'
import Card from '@/components/Card'

export const metadata: Metadata = {
  title: 'Etkinlikler',
  description: 'YBS Kulübü etkinlikleri - Seminerler, workshoplar ve sosyal etkinlikler',
}

export const revalidate = 60

export default async function EtkinliklerPage() {
  const events = await sanityFetch<Event[]>({
    query: eventsQuery,
    tags: ['events'],
  })

  const now = new Date()
  const upcoming = events.filter((e) => new Date(e.date) >= now)
  const past = events.filter((e) => new Date(e.date) < now)

  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Etkinlikler
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Seminerler, workshoplar, sosyal etkinlikler ve daha fazlası.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <Section
        title="Yaklaşan Etkinlikler"
        description="Kaçırılmayacak etkinliklerimiz"
        className="bg-slate-50 dark:bg-slate-900/50"
      >
        {upcoming.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <Card
                key={event._id}
                title={event.title}
                description={event.description}
                image={event.image}
                href={`/etkinlikler/${event.slug.current}`}
                date={event.date}
                category={event.eventType}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">Şu an planlanmış etkinlik bulunmuyor.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
              Yeni etkinlikler için bizi takip edin!
            </p>
          </div>
        )}
      </Section>

      {/* Past Events */}
      {past.length > 0 && (
        <Section
          title="Geçmiş Etkinlikler"
          description="Daha önce düzenlediğimiz etkinlikler"
          className="dark:bg-slate-950"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <Card
                key={event._id}
                title={event.title}
                description={event.description}
                image={event.image}
                href={`/etkinlikler/${event.slug.current}`}
                date={event.date}
                category={event.eventType}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Empty State */}
      {events.length === 0 && (
        <Section>
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground">Henüz etkinlik yok</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Etkinlikler admin panelinden eklenebilir.
            </p>
          </div>
        </Section>
      )}
    </>
  )
}



