import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { SettingsHeader } from '@/components/settings/settings-header'
import { SettingsTabs } from '@/components/settings/settings-tabs'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="settings-page">
      <SettingsHeader />
      <SettingsTabs user={session.user} />
    </div>
  )
}
