import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import { ThemeProvider } from '@/components/ThemeProvider'
import PageTransition from '@/components/PageTransition'
import { Analytics } from '@vercel/analytics/next'
import { ToastProvider } from '@/components/Toast'
import ScrollProgress from '@/components/ScrollProgress'
import { getSettings } from '@/lib/data'
import { MotionProvider } from '@/components/MotionProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ybskulubu.com'),
  title: {
    default: 'İste YBS Topluluğu',
    template: '%s | İste YBS Topluluğu',
  },
  description: 'İskenderun Teknik Üniversitesi Yönetim Bilişim Sistemleri Topluluğu - Teknoloji, yönetim ve kariyer alanında etkinlikler, projeler ve daha fazlası',
  keywords: ['İste YBS', 'İSTE YBS', 'Yönetim Bilişim Sistemleri', 'İSTE', 'İskenderun Teknik Üniversitesi', 'öğrenci topluluğu', 'üniversite', 'teknoloji', 'yazılım', 'kariyer', 'YBS topluluğu', 'Hatay', 'İskenderun'],
  authors: [{ name: 'İste YBS Topluluğu' }],
  creator: 'İste YBS Topluluğu',
  publisher: 'İste YBS Topluluğu',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://ybskulubu.com',
    title: 'İste YBS Topluluğu',
    description: 'İskenderun Teknik Üniversitesi Yönetim Bilişim Sistemleri Topluluğu - Teknoloji, yönetim ve kariyer alanında etkinlikler ve projeler',
    siteName: 'İste YBS Topluluğu',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'İste YBS Topluluğu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'İste YBS Topluluğu',
    description: 'İskenderun Teknik Üniversitesi Yönetim Bilişim Sistemleri Topluluğu',
    images: ['/og-image.jpg'],
    creator: '@ybskulubu',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const nonce = (await headers()).get('x-nonce') || ''

  // Fetch settings server-side for better performance
  let siteName = 'İste YBS Topluluğu'
  try {
    const settings = await getSettings()
    siteName = settings.siteName || 'İste YBS Topluluğu'
  } catch {
    // Fallback to default if settings fetch fails
    // Silently fail to avoid blocking page render
  }

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <MotionProvider>
              <ScrollProgress />
              <SmoothScroll />
              <Header initialSiteName={siteName} />
              <main className="pt-20 sm:pt-24 min-h-screen">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </MotionProvider>
          </ToastProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'İste YBS Topluluğu',
              alternateName: 'İSTE YBS Topluluğu',
              url: 'https://ybskulubu.com',
              logo: 'https://ybskulubu.com/ekip/logo.jpeg',
              description: 'İskenderun Teknik Üniversitesi Yönetim Bilişim Sistemleri Topluluğu',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'TR',
                addressLocality: 'İskenderun',
                addressRegion: 'Hatay'
              },
              sameAs: [
                'https://twitter.com/ybskulubu',
                'https://instagram.com/ybskulubu',
                'https://linkedin.com/company/ybskulubu'
              ]
            })
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
