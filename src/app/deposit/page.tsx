import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { DepositForm } from '@/components/deposit/deposit-form'
import { DepositMethods } from '@/components/deposit/deposit-methods'
import { DepositHistory } from '@/components/deposit/deposit-history'

export default async function DepositPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="deposit-page">
      <div className="deposit-container">
        {/* Header */}
        <div className="deposit-header">
          <h1 className="deposit-title">
            Depositar Chronos
          </h1>
          <p className="deposit-subtitle">
            Adicione saldo à sua conta para participar dos sorteios
          </p>
        </div>

        {/* Main Content */}
        <div className="deposit-content">
          {/* Left Column - Deposit Form */}
          <div className="deposit-main">
            <DepositForm user={session.user} />
          </div>

          {/* Right Column - Methods and History */}
          <div className="deposit-sidebar">
            <DepositMethods />
            <DepositHistory userId={session.user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
