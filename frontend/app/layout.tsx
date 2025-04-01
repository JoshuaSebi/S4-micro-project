import type { Metadata } from 'next'
import {Arimo} from 'next/font/google'
import './globals.css'

const arimo = Arimo({
  subsets: ['latin'],
  variable: '--font-arimo',
  display: 'swap',})

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${arimo.variable} antialiased`} >{children}</body>
    </html>
  )
}
