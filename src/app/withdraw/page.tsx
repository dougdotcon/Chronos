import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { WithdrawHeader } from '@/components/withdraw/withdraw-header'
import { WithdrawForm } from '@/components/withdraw/withdraw-form'
import { WithdrawHistory } from '@/components/withdraw/withdraw-history'
import { WithdrawInfo } from '@/components/withdraw/withdraw-info'

export default async function WithdrawPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="withdraw-page">
      <WithdrawHeader />
      
      <div className="withdraw-container">
        <div className="withdraw-content">
          {/* Main Content */}
          <div className="withdraw-main">
            <WithdrawForm user={session.user} />
            <WithdrawHistory userId={session.user.id} />
          </div>

          {/* Sidebar */}
          <div className="withdraw-sidebar">
            <WithdrawInfo />
          </div>
        </div>
      </div>
    </div>
  )
}
