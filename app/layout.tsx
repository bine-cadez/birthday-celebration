import type React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Montserrat, Open_Sans } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '600', '700', '900'],
})

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Praznovanje',
  description: 'Dobrodošli na moji 50tki!',
  openGraph: {
    title: 'Praznovanje',
    description: 'Dobrodošli na moji 50tki!',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={`${montserrat.variable} ${openSans.variable} antialiased`}
    >
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${openSans.style.fontFamily};
  --font-mono: ${GeistMono.variable};
  --font-heading: ${montserrat.style.fontFamily};
}
        `}</style>
      </head>
      <body>
        <img
          src='/og.jpg'
          alt=''
          width={1200}
          height={630}
          style={{ display: 'none' }}
          aria-hidden='true'
        />
        {children}
      </body>
    </html>
  )
}
