import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { BattlesHeader } from '@/components/battles/battles-header'
import { BattlesList } from '@/components/battles/battles-list'
import { CreateBattleButton } from '@/components/battles/create-battle-button'

export default async function BattlesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="battles-page">
      <BattlesHeader />
      
      <div className="battles-container">
        <div className="battles-content">
          <div className="battles-actions">
            <CreateBattleButton user={session.user} />
          </div>
          
          <BattlesList userId={session.user.id} />
        </div>
      </div>
    </div>
  )
}
