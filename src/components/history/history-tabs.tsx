'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SweepstakesHistory } from './sweepstakes-history'
import { TransactionsHistory } from './transactions-history'
import { PrizesHistory } from './prizes-history'
import { ActivityHistory } from './activity-history'
import { 
  Trophy, 
  DollarSign, 
  Gift,
  Activity
} from 'lucide-react'

interface HistoryTabsProps {
  userId: string
}

export function HistoryTabs({ userId }: HistoryTabsProps) {
  const [activeTab, setActiveTab] = useState('sweepstakes')

  const tabs = [
    {
      value: 'sweepstakes',
      label: 'Sorteios',
      icon: Trophy,
      count: 47
    },
    {
      value: 'transactions',
      label: 'Transações',
      icon: DollarSign,
      count: 15
    },
    {
      value: 'prizes',
      label: 'Prêmios',
      icon: Gift,
      count: 3
    },
    {
      value: 'activity',
      label: 'Atividade',
      icon: Activity,
      count: 128
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="history-tabs"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="history-tabs-container">
        <TabsList className="history-tabs-list">
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <TabsTrigger value={tab.value} className="history-tab-trigger">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="history-tab-count">{tab.count}</span>
              </TabsTrigger>
            </motion.div>
          ))}
        </TabsList>

        <div className="history-tabs-content">
          <TabsContent value="sweepstakes" className="history-tab-content">
            <SweepstakesHistory userId={userId} />
          </TabsContent>

          <TabsContent value="transactions" className="history-tab-content">
            <TransactionsHistory userId={userId} />
          </TabsContent>

          <TabsContent value="prizes" className="history-tab-content">
            <PrizesHistory userId={userId} />
          </TabsContent>

          <TabsContent value="activity" className="history-tab-content">
            <ActivityHistory userId={userId} />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  )
}
