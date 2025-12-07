import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sanityFetch, urlFor } from '@/sanity/lib/client'
import { postBySlugQuery, postsQuery, type Post } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await sanityFetch<Post[]>({ query: postsQuery })
  return posts.map((post) => ({ slug: post.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await sanityFetch<Post>({
    query: postBySlugQuery,
    params: { slug },
  })

  if (!post) return { title: 'Yazı Bulunamadı' }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await sanityFetch<Post>({
    query: postBySlugQuery,
    params: { slug },
    tags: ['posts'],
  })

  if (!post) notFound()

  return (
    <article className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 mb-8"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Blog'a Dön
        </Link>

        {/* Header */}
        <header className="mb-8">
          {post.category && (
            <span className="inline-block px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-full uppercase mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
            {post.author && <span>{post.author}</span>}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.mainImage && (
          <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100 mb-8">
            <Image
              src={urlFor(post.mainImage).width(1200).height(675).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-neutral-600 mb-8 pb-8 border-b border-neutral-100">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        {post.body && (
          <div className="prose max-w-none">
            <PortableText value={post.body} />
          </div>
        )}

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-neutral-100">
          <p className="text-sm text-neutral-500 mb-4">Bu yazıyı paylaşın</p>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-neutral-100 rounded-lg text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://yoursite.com/blog/${post.slug.current}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-neutral-100 rounded-lg text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}

