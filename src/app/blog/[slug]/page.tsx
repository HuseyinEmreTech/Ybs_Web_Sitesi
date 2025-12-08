import { notFound } from 'next/navigation'
import { getPostBySlug, getPosts } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return { title: 'Yazı Bulunamadı' }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full">
              {post.category}
            </span>
            <time className="text-sm text-slate-500">
              {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <a
            href="/blog"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Tüm Yazılara Dön
          </a>
        </div>
      </div>
    </article>
  )
}
