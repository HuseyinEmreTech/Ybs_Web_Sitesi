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
          <div className="max-w-2xl mb-12">
            {title && (
              <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 text-neutral-600">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}


