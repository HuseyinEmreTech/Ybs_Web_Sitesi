import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch, urlFor } from '@/sanity/lib/client'
import { latestPostsQuery, upcomingEventsQuery, type Post, type Event } from '@/sanity/lib/queries'
import Section from '@/components/Section'
import Card from '@/components/Card'
import Button from '@/components/Button'


import AnimatedGradientText from '@/components/AnimatedGradientText'

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
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              <AnimatedGradientText>YBS Kulübü</AnimatedGradientText>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Yönetim Bilişim Sistemleri öğrencilerini bir araya getiren,
              teknoloji ve yönetim alanında etkinlikler düzenleyen öğrenci kulübü.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                href="/hakkimizda"
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300 border-none"
              >
                Hakkımızda
              </Button>
              <Button
                href="/etkinlikler"
                variant="outline"
                size="lg"
                className="border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-slate-700 dark:text-slate-200 backdrop-blur-sm transition-all duration-300"
              >
                Etkinlikler
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 p-8 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl dark:shadow-none ring-1 ring-black/5 dark:ring-white/10">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 divide-x divide-slate-200/50 dark:divide-slate-800/50">
              <div className="text-center px-4">
                <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">50+</p>
                <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Aktif Üye</p>
              </div>
              <div className="text-center px-4">
                <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">20+</p>
                <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Etkinlik</p>
              </div>
              <div className="text-center px-4">
                <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-pink-600 to-rose-600 bg-clip-text text-transparent">10+</p>
                <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Proje</p>
              </div>
              <div className="text-center px-4 border-r-0">
                <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-rose-600 to-orange-600 bg-clip-text text-transparent">5</p>
                <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Yıllık Deneyim</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <Section
        title="Yaklaşan Etkinlikler"
        description="Kaçırılmayacak etkinliklerimize katılın"
        className="bg-slate-50 dark:bg-slate-900/50"
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
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Şu an planlanmış etkinlik bulunmuyor.
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
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
        className="dark:bg-slate-950"
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
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">Henüz yazı yayınlanmadı.</p>
            <Link
              href="/studuio"
              className="text-sm text-foreground underline underline-offset-2 mt-2 inline-block"
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
      {/* CTA */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Dark Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 z-0" />

        {/* Animated Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 overflow-hidden opacity-40 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Kulübümüze Katılın
          </h2>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            YBS Kulübü olarak teknoloji, yönetim ve kariyer alanlarında
            etkinlikler düzenliyoruz. Siz de aramıza katılın!
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              href="/iletisim"
              size="lg"
              className="bg-white text-slate-900 hover:bg-indigo-50 border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-semibold"
            >
              Bize Ulaşın
            </Button>
            <Button
              href="/etkinlikler"
              variant="outline"
              size="lg"
              className="border-slate-500 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm"
            >
              Etkinlikleri İncele
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
