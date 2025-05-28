import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminStats } from '@/components/admin/admin-stats'
import { AdminTabs } from '@/components/admin/admin-tabs'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user is admin (in production, this would check user role)
  const isAdmin = session.user.email === 'admin@chronosplatform.com' || 
                  session.user.email?.includes('admin')

  if (!isAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="admin-page">
      <AdminHeader />
      <AdminStats />
      <AdminTabs />
    </div>
  )
}
