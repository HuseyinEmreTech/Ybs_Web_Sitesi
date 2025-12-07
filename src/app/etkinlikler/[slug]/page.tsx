import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sanityFetch, urlFor } from '@/sanity/lib/client'
import { eventBySlugQuery, eventsQuery, type Event } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import Button from '@/components/Button'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const events = await sanityFetch<Event[]>({ query: eventsQuery })
  return events.map((event) => ({ slug: event.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await sanityFetch<Event>({
    query: eventBySlugQuery,
    params: { slug },
  })

  if (!event) return { title: 'Etkinlik Bulunamadı' }

  return {
    title: event.title,
    description: event.description,
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await sanityFetch<Event>({
    query: eventBySlugQuery,
    params: { slug },
    tags: ['events'],
  })

  if (!event) notFound()

  const eventDate = new Date(event.date)
  const isPast = eventDate < new Date()

  return (
    <article className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/etkinlikler"
          className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 mb-8"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Etkinliklere Dön
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {event.eventType && (
              <span className="px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-full uppercase">
                {event.eventType}
              </span>
            )}
            {isPast && (
              <span className="px-3 py-1 text-xs font-medium bg-neutral-900 text-white rounded-full">
                Tamamlandı
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            {event.title}
          </h1>
        </header>

        {/* Meta */}
        <div className="flex flex-wrap gap-6 py-6 border-y border-neutral-100 mb-8">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Tarih</p>
            <p className="mt-1 font-medium text-neutral-900">
              {eventDate.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long',
              })}
            </p>
            <p className="text-sm text-neutral-600">
              {eventDate.toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          {event.location && (
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">Konum</p>
              <p className="mt-1 font-medium text-neutral-900">{event.location}</p>
            </div>
          )}
        </div>

        {/* Image */}
        {event.image && (
          <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100 mb-8">
            <Image
              src={urlFor(event.image).width(1200).height(675).url()}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-lg text-neutral-600 mb-8">{event.description}</p>
        )}

        {/* Content */}
        {event.content && (
          <div className="prose max-w-none">
            <PortableText value={event.content} />
          </div>
        )}

        {/* Registration */}
        {event.registrationLink && !isPast && (
          <div className="mt-12 p-8 bg-neutral-50 rounded-xl text-center">
            <h3 className="text-lg font-semibold text-neutral-900">
              Bu etkinliğe katılmak ister misiniz?
            </h3>
            <p className="mt-2 text-neutral-600">Hemen kayıt olun!</p>
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-4 px-6 py-3 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Kayıt Ol
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

