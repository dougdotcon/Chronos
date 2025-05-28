import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { SupportHeader } from '@/components/support/support-header'
import { SupportCategories } from '@/components/support/support-categories'
import { SupportFAQ } from '@/components/support/support-faq'
import { SupportContact } from '@/components/support/support-contact'

export default async function SupportPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="support-page">
      <SupportHeader />
      
      <div className="support-container">
        <div className="support-content">
          <div className="support-main">
            <SupportCategories />
            <SupportFAQ />
          </div>
          
          <div className="support-sidebar">
            <SupportContact user={session.user} />
          </div>
        </div>
      </div>
    </div>
  )
}
