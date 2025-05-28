import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { SweepstakeRoom } from '@/components/sweepstakes/sweepstake-room'

interface SweepstakePageProps {
  params: {
    id: string
  }
}

export default async function SweepstakePage({ params }: SweepstakePageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="sweepstake-page">
      <SweepstakeRoom sweepstakeId={params.id} user={session.user} />
    </div>
  )
}
