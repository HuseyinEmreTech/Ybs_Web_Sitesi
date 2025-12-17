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
import StyledComponentsRegistry from '@/lib/registry'

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
    default: 'YBS Kulübü',
    template: '%s | YBS Kulübü',
  },
  description: 'Yönetim Bilişim Sistemleri öğrenci kulübü - Etkinlikler, projeler ve daha fazlası',
  keywords: ['YBS', 'Yönetim Bilişim Sistemleri', 'öğrenci kulübü', 'üniversite', 'teknoloji', 'yazılım', 'kariyer'],
  authors: [{ name: 'YBS Kulübü' }],
  creator: 'YBS Kulübü',
  publisher: 'YBS Kulübü',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://ybskulubu.com',
    title: 'YBS Kulübü',
    description: 'Yönetim Bilişim Sistemleri öğrenci kulübü',
    siteName: 'YBS Kulübü',
    images: [
      {
        url: '/og-image.jpg', // Make sure this exists or is replaced by a real one later
        width: 1200,
        height: 630,
        alt: 'YBS Kulübü',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YBS Kulübü',
    description: 'Yönetim Bilişim Sistemleri öğrenci kulübü',
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

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StyledComponentsRegistry nonce={nonce}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              <ScrollProgress />
              <SmoothScroll />
              <Header />
              <main className="pt-16 min-h-screen">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </ToastProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'YBS Kulübü',
              url: 'https://ybskulubu.com',
              logo: 'https://ybskulubu.com/ekip/logo.jpeg',
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
    </html >
  )
}
