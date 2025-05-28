import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AffiliateHeader } from '@/components/affiliate/affiliate-header'
import { AffiliateStats } from '@/components/affiliate/affiliate-stats'
import { AffiliateTools } from '@/components/affiliate/affiliate-tools'
import { AffiliateCommissions } from '@/components/affiliate/affiliate-commissions'

export default async function AffiliatePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="affiliate-page">
      <AffiliateHeader user={session.user} />
      
      <div className="affiliate-container">
        <div className="affiliate-content">
          <div className="affiliate-main">
            <AffiliateStats userId={session.user.id} />
            <AffiliateCommissions userId={session.user.id} />
          </div>
          
          <div className="affiliate-sidebar">
            <AffiliateTools userId={session.user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
