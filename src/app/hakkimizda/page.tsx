import { Metadata } from 'next'
import Section from '@/components/Section'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'YBS Kulübü hakkında bilgi edinin - Misyonumuz, vizyonumuz ve tarihçemiz',
}

export default function HakkimizdaPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Hakkımızda
            </h1>
            <p className="mt-4 text-lg text-neutral-600">
              Yönetim Bilişim Sistemleri öğrencilerini bir araya getiren, 
              teknoloji ve yönetim alanında etkinlikler düzenleyen öğrenci kulübüyüz.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <Section className="bg-neutral-50">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Hikayemiz</h2>
            <div className="mt-4 space-y-4 text-neutral-600">
              <p>
                YBS Kulübü, Yönetim Bilişim Sistemleri bölümü öğrencilerinin 
                akademik ve sosyal gelişimlerine katkıda bulunmak amacıyla kurulmuştur.
              </p>
              <p>
                Kurulduğumuz günden bu yana, öğrencilerimize teknoloji, yönetim 
                ve kariyer alanlarında değerli deneyimler sunmayı hedefliyoruz.
              </p>
              <p>
                Seminerler, workshoplar, sosyal etkinlikler ve projelerle 
                üyelerimizin hem kişisel hem de profesyonel gelişimlerine 
                katkıda bulunuyoruz.
              </p>
            </div>
          </div>
          <div className="bg-neutral-200 rounded-xl aspect-video flex items-center justify-center">
            <span className="text-neutral-400">Kulüp Fotoğrafı</span>
          </div>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-neutral-50 rounded-xl">
            <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900">Misyonumuz</h3>
            <p className="mt-3 text-neutral-600">
              YBS öğrencilerini teknoloji ve yönetim alanlarında donatarak, 
              onları iş dünyasına hazırlamak ve akademik başarılarını desteklemek.
            </p>
          </div>

          <div className="p-8 bg-neutral-50 rounded-xl">
            <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900">Vizyonumuz</h3>
            <p className="mt-3 text-neutral-600">
              Türkiye'nin en aktif ve etkili YBS öğrenci kulübü olmak; 
              mezunlarımızın sektörde öncü konumlarda yer almasını sağlamak.
            </p>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section
        title="Değerlerimiz"
        description="Bizi biz yapan temel değerler"
        className="bg-neutral-50"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Yenilikçilik', desc: 'Teknolojideki gelişmeleri yakından takip ediyoruz' },
            { title: 'İşbirliği', desc: 'Birlikte çalışmanın gücüne inanıyoruz' },
            { title: 'Öğrenme', desc: 'Sürekli gelişim ve öğrenmeyi teşvik ediyoruz' },
            { title: 'Topluluk', desc: 'Güçlü bir topluluk oluşturmayı hedefliyoruz' },
          ].map((value) => (
            <div key={value.title} className="p-6 bg-white rounded-xl border border-neutral-100">
              <h3 className="font-semibold text-neutral-900">{value.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

