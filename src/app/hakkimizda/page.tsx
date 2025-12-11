import { Metadata } from 'next'
import Section from '@/components/Section'
import { getAboutData } from '@/lib/about'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'YBS Kulübü hakkında bilgi edinin - Misyonumuz, vizyonumuz ve tarihçemiz',
}

export default async function HakkimizdaPage() {
  const data = await getAboutData()

  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-grid-pattern overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px] animate-float pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-[100px] animate-float-delayed pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              {data.hero.title}
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
              {data.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <Section className="relative">
        <div className="glass-card p-8 lg:p-12 rounded-3xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{data.story.title}</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300 whitespace-pre-line">
                {data.story.content}
              </div>
            </div>
            <div className="bg-slate-200 dark:bg-slate-800 rounded-xl aspect-video flex items-center justify-center">
              <span className="text-slate-400 dark:text-slate-500">Kulüp Fotoğrafı</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 glass-card rounded-2xl">
            <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center mb-4 text-white dark:text-slate-900">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">{data.mission.title}</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {data.mission.description}
            </p>
          </div>

          <div className="p-8 glass-card rounded-2xl">
            <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center mb-4 text-white dark:text-slate-900">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">{data.vision.title}</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {data.vision.description}
            </p>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section
        title="Değerlerimiz"
        description="Bizi biz yapan temel değerler"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.values.map((value) => (
            <div key={value.title} className="p-6 glass-card rounded-xl">
              <h3 className="font-semibold text-foreground">{value.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{value.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}




