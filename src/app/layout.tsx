import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './components/theme-provider'
import { Suspense } from 'react'
import Loading from './loading'
import ErrorBoundary from './components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: 'Current Affairs App',
    template: '%s | Current Affairs App',
  },
  description: 'Stay updated with the latest news and current affairs from around the world.',
  keywords: ['current affairs', 'news', 'world events', 'daily updates'],
  authors: [{ name: 'Leon Cyriac', url: 'https://news.leoncyriac.me' }],
  creator: 'Leon Cyriac',
  publisher: 'NxC3',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://news.leoncyriac.me',
    site_name: 'Current Affairs',
    title: 'Current Affairs - Stay Informed, Stay Ahead',
    description: 'Get your daily dose of current affairs and world news. Stay informed with the latest updates and insights.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            <SkipToContent />
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}

function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Skip to content
    </a>
  )
}

function GoogleAnalytics() {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
          `,
        }}
      />
    </>
  )
}