'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/client'
import type { SanityImage } from '@/sanity/lib/queries'
import { twMerge } from 'tailwind-merge'
import { m, LazyMotion, domAnimation } from 'framer-motion'

interface CardProps {
  title: string
  description?: string
  image?: SanityImage
  imageUrl?: string | null
  href: string
  date?: string
  category?: string
  tags?: string[]
  className?: string
  index?: number
}

export default function Card({
  title,
  description,
  image,
  imageUrl,
  href,
  date,
  category,
  tags,
  className,
  index = 0,
}: CardProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Link href={href} className="group block h-full">
          <article className={twMerge(
            "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col",
            className
          )}>
            {/* Image */}
            <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  unoptimized={true}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : image ? (
                <Image
                  src={urlFor(image).width(600).height(340).url()}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
              {/* Meta */}
              <div className="flex items-center gap-3 mb-3">
                {category && (
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    {category}
                  </span>
                )}
                {date && (
                  <time className="text-xs text-slate-400 font-medium">
                    {new Date(date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {title}
              </h3>

              {/* Description */}
              {description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {description}
                </p>
              )}

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
                  {tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        </Link>
      </m.div>
    </LazyMotion>
  )
}
