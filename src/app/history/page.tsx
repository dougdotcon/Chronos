import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { HistoryHeader } from '@/components/history/history-header'
import { HistoryTabs } from '@/components/history/history-tabs'

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="history-page">
      <HistoryHeader />
      
      <div className="history-container">
        <HistoryTabs userId={session.user.id} />
      </div>
    </div>
  )
}
