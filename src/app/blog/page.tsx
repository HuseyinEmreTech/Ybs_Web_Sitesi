import { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { postsQuery, type Post } from '@/sanity/lib/queries'
import Section from '@/components/Section'
import Card from '@/components/Card'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'YBS Kulübü blog yazıları, haberler ve duyurular',
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await sanityFetch<Post[]>({
    query: postsQuery,
    tags: ['posts'],
  })

  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Blog
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Haberler, duyurular, makaleler ve daha fazlası.
            </p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <Section className="bg-slate-50 dark:bg-slate-900/50">
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card
                key={post._id}
                title={post.title}
                description={post.excerpt}
                image={post.mainImage}
                href={`/blog/${post.slug.current}`}
                date={post.publishedAt}
                category={post.category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground">Henüz yazı yok</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Blog yazıları admin panelinden eklenebilir.
            </p>
            <a
              href="/studuio"
              className="inline-flex mt-4 text-sm text-foreground underline underline-offset-2"
            >
              Admin Paneline Git →
            </a>
          </div>
        )}
      </Section>
    </>
  )
}



