import { RankingsHeader } from '@/components/rankings/rankings-header'
import { RankingsTabs } from '@/components/rankings/rankings-tabs'

export default function RankingsPage() {
  return (
    <div className="rankings-page">
      <RankingsHeader />
      <RankingsTabs />
    </div>
  )
}
