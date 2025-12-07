import { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { teamMembersQuery, type TeamMember } from '@/sanity/lib/queries'
import Section from '@/components/Section'
import TeamCard from '@/components/TeamCard'
import AnimatedGradientText from '@/components/AnimatedGradientText'
import Button from '@/components/Button'

export const metadata: Metadata = {
  title: 'Ekibimiz',
  description: 'YBS Kulübü yönetim kurulu ve ekip üyeleri',
}

export const revalidate = 60

export default async function EkipPage() {
  const members = await sanityFetch<TeamMember[]>({
    query: teamMembersQuery,
    tags: ['team'],
  })

  // Grup üyeleri: Yönetim vs Üyeler
  const yonetim = members.filter((m) => m.role && m.role !== 'uye')
  const uyeler = members.filter((m) => m.role === 'uye')

  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              <AnimatedGradientText>Ekibimiz</AnimatedGradientText>
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Kulübümüzü yöneten ve geliştiren değerli ekip üyelerimiz.
            </p>
          </div>
        </div>
      </section>

      {/* Management Team */}
      <Section
        title="Yönetim Kurulu"
        description="Kulübümüzün yönetim ekibi"
        className="bg-slate-50 dark:bg-slate-900/50"
      >
        {yonetim.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {yonetim.map((member) => (
              <TeamCard key={member._id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Yönetim kurulu bilgileri yakında eklenecek.
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
              Admin panelinden ekip üyelerini ekleyebilirsiniz.
            </p>
          </div>
        )}
      </Section>

      {/* Members */}
      {uyeler.length > 0 && (
        <Section
          title="Üyelerimiz"
          description="Aktif üyelerimiz"
          className="dark:bg-slate-950"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {uyeler.map((member) => (
              <TeamCard key={member._id} member={member} />
            ))}
          </div>
        </Section>
      )}

      {/* Join CTA */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Light Mode: White Background */}
        <div className="absolute inset-0 bg-white dark:hidden z-0" />

        {/* Dark Mode: Deep Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 hidden dark:block z-0" />

        {/* Animated Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 dark:bg-indigo-500/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/20 dark:bg-purple-500/40 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Ekibimize Katılın</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            YBS Kulübü'nde aktif rol almak ister misiniz?
            Yönetim kurulumuzda veya çeşitli komisyonlarımızda görev alabilirsiniz.
          </p>
          <div className="mt-8">
            <Button
              href="/iletisim"
              size="lg"
              className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-50 border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-semibold"
            >
              Başvuru Yap
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}



