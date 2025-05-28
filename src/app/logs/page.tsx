import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { LogsHeader } from '@/components/logs/logs-header'
import { LogsFilters } from '@/components/logs/logs-filters'
import { LogsList } from '@/components/logs/logs-list'

export default async function LogsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user is admin
  const isAdmin = session.user.email === 'admin@chronosplatform.com' || 
                  session.user.email?.includes('admin')

  if (!isAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="logs-page">
      <LogsHeader />
      <LogsFilters />
      <LogsList />
    </div>
  )
}
