import { Metadata } from 'next'
import Image from 'next/image'
import { sanityFetch, urlFor } from '@/sanity/lib/client'
import { projectsQuery, type Project } from '@/sanity/lib/queries'
import Section from '@/components/Section'
import AnimatedGradientText from '@/components/AnimatedGradientText'
import Button from '@/components/Button'

export const metadata: Metadata = {
  title: 'Projeler',
  description: 'YBS Kulübü projeleri ve çalışmaları',
}

export const revalidate = 60

const statusLabels: Record<string, { label: string; color: string }> = {
  devam: { label: 'Devam Ediyor', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  tamamlandi: { label: 'Tamamlandı', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  planlaniyor: { label: 'Planlanıyor', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
}

export default async function ProjelerPage() {
  const projects = await sanityFetch<Project[]>({
    query: projectsQuery,
    tags: ['projects'],
  })

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

      {/* Projects */}
      <Section className="bg-slate-50 dark:bg-slate-900/50">
        {projects.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group"
              >
                {/* Image */}
                {project.image && (
                  <div className="aspect-video relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <Image
                      src={urlFor(project.image).width(800).height(450).url()}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Status & Year */}
                  <div className="flex items-center gap-3 mb-3">
                    {project.status && (
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusLabels[project.status]?.color || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                        {statusLabels[project.status]?.label || project.status}
                      </span>
                    )}
                    {project.year && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{project.year}</span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h2>

                  {/* Description */}
                  {project.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Team */}
                  {project.teamMembers && project.teamMembers.length > 0 && (
                    <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex -space-x-2">
                        {project.teamMembers.slice(0, 4).map((member, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800"
                          >
                            {member.image ? (
                              <Image
                                src={urlFor(member.image).width(64).height(64).url()}
                                alt={member.name}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-xs text-slate-500 font-medium">
                                {member.name.charAt(0)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {project.teamMembers.length} katkıda bulunan
                      </span>
                    </div>
                  )}

                  {/* Links */}
                  <div className="mt-4 flex gap-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground">Henüz proje yok</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Projeler admin panelinden eklenebilir.
            </p>
          </div>
        )}
      </Section>

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


