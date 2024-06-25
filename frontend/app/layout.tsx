import { Inter } from 'next/font/google'
import './globals.css'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
