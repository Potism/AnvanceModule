import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { LanguageProvider } from '@/lib/language-context'
import { ListinoProvider } from '@/lib/listino-context'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist-sans"
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
})

export const metadata: Metadata = {
  title: 'Anvance Production | Client Portal',
  description: 'Professional video production, cinematic content, reels, YouTube videos, photography, and custom web development services.',
  keywords: ['video production', 'cinematic', 'reels', 'youtube', 'photography', 'web development', 'anvance'],
  authors: [{ name: 'Anvance Production' }],
  openGraph: {
    title: 'Anvance Production | Client Portal',
    description: 'Professional video production and creative services',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        <LanguageProvider>
          <ListinoProvider>
            {children}
          </ListinoProvider>
        </LanguageProvider>
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'oklch(0.14 0 0)',
              border: '1px solid oklch(0.22 0 0)',
              color: 'oklch(0.98 0 0)',
            },
          }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
