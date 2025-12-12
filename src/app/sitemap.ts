import { MetadataRoute } from 'next'
import { getPosts, getEvents, getProjects } from '@/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ybskulubu.com'

    // Static routes
    const routes = [
        '',
        '/hakkimizda',
        '/ekip',
        '/koordinatorlukler',
        '/etkinlikler',
        '/blog',
        '/projeler',
        '/iletisim',
        '/emegi-gecenler',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic routes
    const posts = await getPosts()
    const events = await getEvents()
    const projects = await getProjects()

    const postRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    const eventRoutes = events.map((event) => ({
        url: `${baseUrl}/etkinlikler/${event.slug}`,
        lastModified: new Date(event.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    const projectRoutes = projects.map((project) => ({
        url: `${baseUrl}/projeler/${project.slug}`,
        lastModified: new Date(project.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...routes, ...postRoutes, ...eventRoutes, ...projectRoutes]
}
