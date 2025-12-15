import Link from 'next/link'
import Section from '@/components/Section'
import Card from '@/components/Card'
import Button from '@/components/Button'
import ScrollReveal from '@/components/ScrollReveal'
import AnimatedGradientText from '@/components/AnimatedGradientText'
import MatrixRain from '@/components/MatrixRain'
import CountUp from '@/components/CountUp'
import HeroLogo from '@/components/HeroLogo'
import { getPosts, getEvents, getSettings, type Post, type Event } from '@/lib/data'

export const revalidate = 60

export default async function HomePage() {
  const posts = (await getPosts()).slice(0, 3)
  const events = (await getEvents())
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
  const settings = await getSettings()

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-32 overflow-hidden bg-grid-pattern">
        {/* Matrix Rain Effect */}
        <MatrixRain />

        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-500/30 rounded-full blur-[80px] sm:blur-[100px] animate-float pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-indigo-500/30 rounded-full blur-[80px] sm:blur-[100px] animate-float-delayed pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="max-w-3xl lg:max-w-none text-center lg:text-left order-2 lg:order-1">
              <ScrollReveal direction="left">
                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                  <AnimatedGradientText>İste YBS Topluluğu</AnimatedGradientText>
                </h1>
              </ScrollReveal>
              <ScrollReveal direction="left" delay={0.1}>
                <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Yönetim Bilişim Sistemleri öğrencilerini bir araya getiren,
                  teknoloji ve yönetim alanında etkinlikler düzenleyen öğrenci kulübü.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
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
              </ScrollReveal>
            </div>

            {/* Logo Content */}
            <div className="order-1 lg:order-2 flex justify-center">
              <ScrollReveal direction="right" delay={0.2}>
                {/* @ts-ignore - Settings type needs update but data likely exists */}
                <HeroLogo logoUrl={settings.logoUrl || '/ekip/logo.jpeg'} siteName={settings.siteName || 'YBS Kulübü'} />
              </ScrollReveal>
            </div>
          </div>

          {/* Stats */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-16 p-8 rounded-3xl glass-card">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/50 dark:divide-slate-800/50">
                <div className="text-center px-4">
                  <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    <CountUp value={Number(settings.stats.activeMembers)} />
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Aktif Üye</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    <CountUp value={Number(settings.stats.events)} />
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Etkinlik</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    <CountUp value={Number(settings.stats.projects)} />
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Proje</p>
                </div>
                <div className="text-center px-4 border-r-0">
                  <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    <CountUp value={Number(settings.stats.yearsOfExperience)} />
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Yıllık Deneyim</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
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
            {events.map((event, index) => (
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
            {posts.map((post, index) => (
              <Card
                key={post.id}
                title={post.title}
                description={post.excerpt}
                href={`/blog/${post.slug}`}
                date={post.publishedAt}
                category={post.category}
                imageUrl={post.imageUrl || undefined}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">Henüz yazı yayınlanmadı.</p>
            <Link
              href="/admin"
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
      <section className="relative py-16 lg:py-24 overflow-hidden border-t border-slate-200 dark:border-slate-800">
        {/* Backgrounds */}
        <div className="absolute inset-0 bg-white dark:hidden z-0" />
        <div className="absolute inset-0 bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 hidden dark:block z-0" />

        {/* Animated Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-300 dark:bg-indigo-500 rounded-full blur-[120px] opacity-30 dark:opacity-40 dark:mix-blend-screen animate-pulse" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-300 dark:bg-purple-500 rounded-full blur-[100px] opacity-30 dark:opacity-40 dark:mix-blend-screen" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Kulübümüze Katılın
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            YBS Kulübü olarak teknoloji, yönetim ve kariyer alanlarında
            etkinlikler düzenliyoruz. Siz de aramıza katılın!
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              href="/iletisim"
              size="lg"
              className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-50 border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-semibold"
            >
              Bize Ulaşın
            </Button>
            <Button
              href="/etkinlikler"
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-indigo-600 dark:border-slate-500 dark:text-white dark:hover:bg-white/10 dark:hover:border-white backdrop-blur-sm"
            >
              Etkinlikleri İncele
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
