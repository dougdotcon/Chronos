import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { NotificationsHeader } from '@/components/notifications/notifications-header'
import { NotificationsList } from '@/components/notifications/notifications-list'
import { NotificationSettings } from '@/components/notifications/notification-settings'

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="notifications-page">
      <NotificationsHeader />
      
      <div className="notifications-container">
        <div className="notifications-content">
          {/* Main Content */}
          <div className="notifications-main">
            <NotificationsList userId={session.user.id} />
          </div>

          {/* Sidebar */}
          <div className="notifications-sidebar">
            <NotificationSettings userId={session.user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
