import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { MonthlyBattleHeader } from '@/components/monthly-battle/monthly-battle-header'
import { MonthlyBattleLeaderboard } from '@/components/monthly-battle/monthly-battle-leaderboard'
import { MonthlyBattleStats } from '@/components/monthly-battle/monthly-battle-stats'
import { MonthlyBattleRewards } from '@/components/monthly-battle/monthly-battle-rewards'

export default async function MonthlyBattlePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="monthly-battle-page">
      <MonthlyBattleHeader />
      
      <div className="monthly-battle-container">
        <div className="monthly-battle-content">
          <div className="monthly-battle-grid">
            <div className="monthly-battle-main">
              <MonthlyBattleLeaderboard userId={session.user.id} />
            </div>
            
            <div className="monthly-battle-sidebar">
              <MonthlyBattleStats userId={session.user.id} />
              <MonthlyBattleRewards />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
