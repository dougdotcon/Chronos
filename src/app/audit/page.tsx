import { AuditHeader } from '@/components/audit/audit-header'
import { AuditStats } from '@/components/audit/audit-stats'
import { RecentSweepstakes } from '@/components/audit/recent-sweepstakes'
import { AuditTools } from '@/components/audit/audit-tools'

export default function AuditPage() {
  return (
    <div className="audit-page">
      <AuditHeader />
      
      <div className="audit-container">
        {/* Stats Section */}
        <div className="audit-stats-section">
          <AuditStats />
        </div>

        {/* Main Content */}
        <div className="audit-content">
          {/* Left Column */}
          <div className="audit-main">
            <RecentSweepstakes />
          </div>

          {/* Right Column */}
          <div className="audit-sidebar">
            <AuditTools />
          </div>
        </div>
      </div>
    </div>
  )
}
