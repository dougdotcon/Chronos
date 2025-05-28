'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Trophy, 
  DollarSign, 
  Settings, 
  Shield,
  BarChart3
} from 'lucide-react'
import { UserManagement } from './user-management'
import { SweepstakeManagement } from './sweepstake-management'
import { FinancialReports } from './financial-reports'
import { PlatformSettings } from './platform-settings'
import { SecurityCenter } from './security-center'
import { AnalyticsDashboard } from './analytics-dashboard'

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState('users')

  const tabs = [
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
      component: UserManagement
    },
    {
      id: 'sweepstakes',
      label: 'Sorteios',
      icon: Trophy,
      component: SweepstakeManagement
    },
    {
      id: 'financial',
      label: 'Financeiro',
      icon: DollarSign,
      component: FinancialReports
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: AnalyticsDashboard
    },
    {
      id: 'security',
      label: 'Segurança',
      icon: Shield,
      component: SecurityCenter
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      component: PlatformSettings
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="admin-tabs"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="admin-tabs-container">
        <TabsList className="admin-tabs-list">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="admin-tab-trigger"
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {tabs.map((tab) => {
          const Component = tab.component
          return (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="admin-tab-content"
            >
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Component />
              </motion.div>
            </TabsContent>
          )
        })}
      </Tabs>
    </motion.div>
  )
}
