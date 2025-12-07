import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch, urlFor } from '@/sanity/lib/client'
import { latestPostsQuery, upcomingEventsQuery, type Post, type Event } from '@/sanity/lib/queries'
import Section from '@/components/Section'
import Card from '@/components/Card'
import Button from '@/components/Button'

export const revalidate = 60

export default async function HomePage() {
  const [posts, events] = await Promise.all([
    sanityFetch<Post[]>({ query: latestPostsQuery, tags: ['posts'] }),
    sanityFetch<Event[]>({ query: upcomingEventsQuery, tags: ['events'] }),
  ])

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
              YBS Kulübü
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Yönetim Bilişim Sistemleri öğrencilerini bir araya getiren, 
              teknoloji ve yönetim alanında etkinlikler düzenleyen öğrenci kulübü.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/hakkimizda" size="lg">
                Hakkımızda
              </Button>
              <Button href="/etkinlikler" variant="outline" size="lg">
                Etkinlikler
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <p className="text-3xl font-bold text-neutral-900">50+</p>
              <p className="mt-1 text-sm text-neutral-600">Aktif Üye</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-neutral-900">20+</p>
              <p className="mt-1 text-sm text-neutral-600">Etkinlik</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-neutral-900">10+</p>
              <p className="mt-1 text-sm text-neutral-600">Proje</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-neutral-900">5</p>
              <p className="mt-1 text-sm text-neutral-600">Yıllık Deneyim</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <Section
        title="Yaklaşan Etkinlikler"
        description="Kaçırılmayacak etkinliklerimize katılın"
        className="bg-neutral-50"
      >
        {events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
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
          <div className="text-center py-12 bg-white rounded-xl border border-neutral-100">
            <p className="text-neutral-500">
              Şu an planlanmış etkinlik bulunmuyor.
            </p>
            <p className="text-sm text-neutral-400 mt-2">
              Yeni etkinlikler için bizi takip edin!
            </p>
          </div>
        )}
        <div className="mt-8 text-center">
          <Button href="/etkinlikler" variant="secondary">
            Tüm Etkinlikler →
          </Button>
        </div>
      </Section>

      {/* Latest Posts */}
      <Section
        title="Son Yazılar"
        description="Blog ve haberlerimizi takip edin"
      >
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card
                key={post._id}
                title={post.title}
                description={post.excerpt}
                image={post.mainImage}
                href={`/blog/${post.slug.current}`}
                date={post.publishedAt}
                category={post.category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-50 rounded-xl border border-neutral-100">
            <p className="text-neutral-500">Henüz yazı yayınlanmadı.</p>
            <Link
              href="/studuio"
              className="text-sm text-neutral-900 underline underline-offset-2 mt-2 inline-block"
            >
              Admin panelinden içerik ekleyin →
            </Link>
          </div>
        )}
        <div className="mt-8 text-center">
          <Button href="/blog" variant="secondary">
            Tüm Yazılar →
          </Button>
        </div>
      </Section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Kulübümüze Katılın
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            YBS Kulübü olarak teknoloji, yönetim ve kariyer alanlarında 
            etkinlikler düzenliyoruz. Siz de aramıza katılın!
          </p>
          <div className="mt-8">
            <Button href="/iletisim" variant="primary" size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
              Bize Ulaşın
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
