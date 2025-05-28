import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { SweepstakesHeader } from '@/components/sweepstakes/sweepstakes-header'
import { SweepstakesFilters } from '@/components/sweepstakes/sweepstakes-filters'
import { SweepstakesList } from '@/components/sweepstakes/sweepstakes-list'
import { CreateSweepstakeButton } from '@/components/sweepstakes/create-sweepstake-button'

export default async function SweepstakesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="sweepstakes-page">
      <SweepstakesHeader />
      
      <div className="sweepstakes-container">
        {/* Top Section */}
        <div className="sweepstakes-top">
          <SweepstakesFilters />
          <CreateSweepstakeButton />
        </div>

        {/* Main Content */}
        <div className="sweepstakes-content">
          <SweepstakesList />
        </div>
      </div>
    </div>
  )
}
