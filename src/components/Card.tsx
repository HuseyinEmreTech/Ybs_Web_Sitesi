import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/client'
import type { SanityImage } from '@/sanity/lib/queries'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface CardProps {
  title: string
  description?: string
  image?: SanityImage
  href: string
  date?: string
  category?: string
  tags?: string[]
  className?: string
}

export default function Card({
  title,
  description,
  image,
  href,
  date,
  category,
  tags,
  className,
}: CardProps) {
  return (
    <Link href={href} className="group block h-full">
      <article className={twMerge(
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col",
        className
      )}>
        {/* Image */}
        {image && (
          <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
            <Image
              src={urlFor(image).width(600).height(340).url()}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}

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
  )
}


