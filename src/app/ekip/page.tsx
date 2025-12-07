import { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { teamMembersQuery, type TeamMember } from '@/sanity/lib/queries'
import Section from '@/components/Section'
import TeamCard from '@/components/TeamCard'

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
            <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Ekibimiz
            </h1>
            <p className="mt-4 text-lg text-neutral-600">
              Kulübümüzü yöneten ve geliştiren değerli ekip üyelerimiz.
            </p>
          </div>
        </div>
      </section>

      {/* Management Team */}
      <Section
        title="Yönetim Kurulu"
        description="Kulübümüzün yönetim ekibi"
        className="bg-neutral-50"
      >
        {yonetim.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {yonetim.map((member) => (
              <TeamCard key={member._id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-neutral-100">
            <p className="text-neutral-500">
              Yönetim kurulu bilgileri yakında eklenecek.
            </p>
            <p className="text-sm text-neutral-400 mt-2">
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
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {uyeler.map((member) => (
              <TeamCard key={member._id} member={member} />
            ))}
          </div>
        </Section>
      )}

      {/* Join CTA */}
      <section className="py-16 lg:py-24 bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white">Ekibimize Katılın</h2>
          <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
            YBS Kulübü'nde aktif rol almak ister misiniz? 
            Yönetim kurulumuzda veya çeşitli komisyonlarımızda görev alabilirsiniz.
          </p>
          <a
            href="/iletisim"
            className="inline-flex mt-8 px-6 py-3 bg-white text-neutral-900 font-medium rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Başvuru Yap
          </a>
        </div>
      </section>
    </>
  )
}

