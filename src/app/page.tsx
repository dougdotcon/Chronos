import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Header } from '@/components/layout/header'
import { HeroSection } from '@/components/sections/hero-section'
import { SweepstakesSection } from '@/components/sections/sweepstakes-section'
import { StatsSection } from '@/components/sections/stats-section'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-chronos-charcoal">
      <Header />
      
      <main className="relative">
        <Suspense fallback={<LoadingSpinner />}>
          <HeroSection />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <SweepstakesSection />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <StatsSection />
        </Suspense>
      </main>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-chronos-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chronos-violet/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
