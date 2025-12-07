import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/client'
import type { SanityImage } from '@/sanity/lib/queries'

interface CardProps {
  title: string
  description?: string
  image?: SanityImage
  href: string
  date?: string
  category?: string
  tags?: string[]
}

export default function Card({
  title,
  description,
  image,
  href,
  date,
  category,
  tags,
}: CardProps) {
  return (
    <Link href={href} className="group block">
      <article className="bg-white border border-neutral-100 rounded-xl overflow-hidden transition-all hover:border-neutral-200 hover:shadow-sm">
        {/* Image */}
        {image && (
          <div className="aspect-video relative overflow-hidden bg-neutral-100">
            <Image
              src={urlFor(image).width(600).height(340).url()}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-3">
            {category && (
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                {category}
              </span>
            )}
            {date && (
              <time className="text-xs text-neutral-400">
                {new Date(date).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
              {description}
            </p>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-600 rounded"
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

