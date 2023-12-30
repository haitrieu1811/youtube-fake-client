import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'

import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import AppProvider from '@/providers/app-provider'
import TanstackProvider from '@/providers/tanstack-provider'
import ThemeProvider from '@/providers/theme-provider'
import './globals.css'

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <TanstackProvider>
          <AppProvider>
            <ThemeProvider attribute='class' defaultTheme='system'>
              {children}
              <Toaster />
            </ThemeProvider>
          </AppProvider>
        </TanstackProvider>
      </body>
    </html>
  )
}
