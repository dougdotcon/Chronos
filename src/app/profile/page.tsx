import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileForm } from '@/components/profile/profile-form'
import { ProfileStats } from '@/components/profile/profile-stats'
import { ProfileSecurity } from '@/components/profile/profile-security'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="profile-page">
      <ProfileHeader user={session.user} />
      
      <div className="profile-container">
        <div className="profile-content">
          {/* Main Content */}
          <div className="profile-main">
            <ProfileForm user={session.user} />
            <ProfileSecurity userId={session.user.id} />
          </div>

          {/* Sidebar */}
          <div className="profile-sidebar">
            <ProfileStats userId={session.user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
