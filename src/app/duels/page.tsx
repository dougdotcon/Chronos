import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { DuelsHeader } from '@/components/duels/duels-header'
import { DuelsList } from '@/components/duels/duels-list'
import { CreateDuelButton } from '@/components/duels/create-duel-button'

export default async function DuelsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="duels-page">
      <DuelsHeader />
      
      <div className="duels-container">
        <div className="duels-content">
          <div className="duels-actions">
            <CreateDuelButton user={session.user} />
          </div>
          
          <DuelsList userId={session.user.id} />
        </div>
      </div>
    </div>
  )
}
