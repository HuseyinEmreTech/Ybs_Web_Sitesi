import Link from 'next/link'
import Section from '@/components/Section'
import Card from '@/components/Card'
import { getPosts, type Post } from '@/lib/data'

export const revalidate = 60 // ISR: Cache for 60 seconds

export const metadata = {
  title: 'Blog',
  description: 'YBS Kulübü blog yazıları ve haberleri',
}

export default async function BlogPage() {
  const posts = (await getPosts()).sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <Section
      title="Blog"
      description="Yazılarımızı ve haberlerimizi takip edin"
    >
      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Card
              key={post.id}
              title={post.title}
              description={post.excerpt}
              href={`/blog/${post.slug}`}
              date={post.publishedAt}
              category={post.category}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-4">Henüz yazı yayınlanmadı</p>
          <p className="text-slate-400 dark:text-slate-500 mb-6">İlk blog yazısını admin panelinden ekleyebilirsiniz.</p>
          <Link
            href="/admin/blog"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Admin Paneli →
          </Link>
        </div>
      )}
    </Section>
  )
}
