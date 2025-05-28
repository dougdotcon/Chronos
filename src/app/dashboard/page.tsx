import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { BalanceCard } from '@/components/dashboard/balance-card'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ActiveSweepstakes } from '@/components/dashboard/active-sweepstakes'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { StatsOverview } from '@/components/dashboard/stats-overview'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="dashboard">
      <DashboardHeader user={session.user} />
      
      <div className="dashboard-container">
        {/* Top Section - Balance and Quick Actions */}
        <div className="dashboard-top">
          <BalanceCard balance={session.user.chronosBalance} />
          <QuickActions />
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="dashboard-left">
            <ActiveSweepstakes />
            <RecentTransactions userId={session.user.id} />
          </div>

          {/* Right Column */}
          <div className="dashboard-right">
            <StatsOverview userId={session.user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
