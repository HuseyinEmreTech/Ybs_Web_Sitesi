'use client'

import ScrollReveal from './ScrollReveal'

interface SectionProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export default function Section({
  children,
  title,
  description,
  className = '',
}: SectionProps) {
  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {(title || description) && (
          <ScrollReveal direction="left" className="max-w-2xl mb-12">
            {title && (
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 text-slate-600 dark:text-slate-400">{description}</p>
            )}
          </ScrollReveal>
        )}
        <ScrollReveal direction="up" delay={0.2}>
          {children}
        </ScrollReveal>
      </div>
    </section>
  )
}
