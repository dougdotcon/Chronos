'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { SocketProvider } from '@/contexts/socket-context'
import { ChronosStoreProvider } from '@/store/chronos-store'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <ChronosStoreProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </ChronosStoreProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
