import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ybskulubu.com'

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
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }))
}
