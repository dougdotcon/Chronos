import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { PrivateRoomsHeader } from '@/components/private-rooms/private-rooms-header'
import { PrivateRoomsList } from '@/components/private-rooms/private-rooms-list'
import { CreatePrivateRoomButton } from '@/components/private-rooms/create-private-room-button'
import { JoinPrivateRoomForm } from '@/components/private-rooms/join-private-room-form'

export default async function PrivateRoomsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="private-rooms-page">
      <PrivateRoomsHeader />
      
      <div className="private-rooms-container">
        <div className="private-rooms-content">
          <div className="private-rooms-actions">
            <CreatePrivateRoomButton user={session.user} />
            <JoinPrivateRoomForm />
          </div>
          
          <PrivateRoomsList userId={session.user.id} />
        </div>
      </div>
    </div>
  )
}
