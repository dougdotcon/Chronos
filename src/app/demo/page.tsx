import { DemoHeader } from '@/components/demo/demo-header'
import { DemoSweepstake } from '@/components/demo/demo-sweepstake'
import { DemoFeatures } from '@/components/demo/demo-features'

export default function DemoPage() {
  return (
    <div className="demo-page">
      <DemoHeader />
      <DemoSweepstake />
      <DemoFeatures />
    </div>
  )
}
