import { Metadata } from 'next'
import { getProjects } from '@/lib/data'
import AnimatedGradientText from '@/components/AnimatedGradientText'
import Button from '@/components/Button'
import ProjectsView from '@/components/ProjectsView'

export const metadata: Metadata = {
  title: 'Projeler',
  description: 'İste YBS Topluluğu projeleri ve çalışmaları - Yazılım geliştirme, araştırma ve inovasyon projeleri',
}

export const revalidate = 60 // ISR: Cache for 60 seconds

export default async function ProjelerPage() {
  const projects = await getProjects()

  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              <AnimatedGradientText>Projeler</AnimatedGradientText>
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Kulübümüzün geliştirdiği ve üzerinde çalıştığı projeler.
            </p>
          </div>
        </div>
      </section>

      {/* Projects List (Client Component) */}
      <ProjectsView initialProjects={projects} />

      {/* CTA */}
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Projelere Katılmak İster Misiniz?
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            YBS Kulübü projelerinde yer almak, yeni teknolojiler öğrenmek ve
            deneyim kazanmak için bize ulaşın.
          </p>
          <div className="mt-8">
            <Button
              href="/iletisim"
              size="lg"
              className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-50 border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-semibold"
            >
              İletişime Geç
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
