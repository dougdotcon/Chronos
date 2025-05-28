import type { Metadata } from 'next'
import { Raleway, Cinzel } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Chronos Platform - Sistema de Sorteios Online',
  description: 'Plataforma de sorteios online com transparência criptográfica e sistema de moeda interna Chronos.',
  keywords: 'sorteios, chronos, plataforma, online, transparente, criptográfico',
  authors: [{ name: 'Chronos Platform Team' }],
  creator: 'Chronos Platform',
  publisher: 'Chronos Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Chronos Platform',
    description: 'Sistema de Sorteios Online com Transparência Criptográfica',
    url: '/',
    siteName: 'Chronos Platform',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Chronos Platform Logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chronos Platform',
    description: 'Sistema de Sorteios Online com Transparência Criptográfica',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${raleway.variable} ${cinzel.variable} font-primary antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
