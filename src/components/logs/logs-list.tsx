'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Shield,
  DollarSign,
  Trophy
} from 'lucide-react'

interface LogEntry {
  id: string
  timestamp: number
  level: 'info' | 'warning' | 'error' | 'critical'
  category: 'auth' | 'payment' | 'sweepstake' | 'security' | 'system' | 'user'
  action: string
  message: string
  userId?: string
  userEmail?: string
  ip?: string
  userAgent?: string
  metadata?: Record<string, any>
}

// Mock log data
const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: Date.now() - 1000 * 60 * 5,
    level: 'info',
    category: 'sweepstake',
    action: 'sweepstake_completed',
    message: 'Sorteio #1234 finalizado com sucesso',
    userId: 'user123',
    userEmail: 'joao@example.com',
    ip: '192.168.1.100',
    metadata: { sweepstakeId: '1234', winnerId: 'user456', prizeAmount: 2500 }
  },
  {
    id: '2',
    timestamp: Date.now() - 1000 * 60 * 10,
    level: 'warning',
    category: 'security',
    action: 'failed_login',
    message: 'Tentativa de login falhada',
    userEmail: 'hacker@example.com',
    ip: '10.0.0.1',
    metadata: { attempts: 3, reason: 'invalid_password' }
  },
  {
    id: '3',
    timestamp: Date.now() - 1000 * 60 * 15,
    level: 'info',
    category: 'payment',
    action: 'deposit_confirmed',
    message: 'Depósito confirmado via PIX',
    userId: 'user789',
    userEmail: 'maria@example.com',
    ip: '192.168.1.200',
    metadata: { amount: 100, method: 'pix', transactionId: 'tx_abc123' }
  },
  {
    id: '4',
    timestamp: Date.now() - 1000 * 60 * 20,
    level: 'error',
    category: 'system',
    action: 'database_error',
    message: 'Erro de conexão com banco de dados',
    metadata: { error: 'Connection timeout', duration: 5000 }
  },
  {
    id: '5',
    timestamp: Date.now() - 1000 * 60 * 25,
    level: 'critical',
    category: 'security',
    action: 'fraud_detected',
    message: 'Atividade fraudulenta detectada',
    userId: 'user999',
    userEmail: 'suspicious@example.com',
    ip: '1.2.3.4',
    metadata: { riskScore: 95, reasons: ['multiple_accounts', 'unusual_pattern'] }
  }
]

export function LogsList() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(mockLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)

  // Filter logs based on search and filters
  useEffect(() => {
    let filtered = logs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip?.includes(searchTerm)
      )
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, levelFilter, categoryFilter])

  const refreshLogs = async () => {
    setIsLoading(true)
    try {
      // In production, fetch from API
      await new Promise(resolve => setTimeout(resolve, 1000))
      // setLogs(await fetchLogs())
    } catch (error) {
      console.error('Failed to refresh logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportLogs = () => {
    const csvContent = [
      'Timestamp,Level,Category,Action,Message,User,IP',
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.level,
        log.category,
        log.action,
        log.message.replace(/,/g, ';'),
        log.userEmail || '',
        log.ip || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chronos-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-400" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <User className="w-4 h-4" />
      case 'payment':
        return <DollarSign className="w-4 h-4" />
      case 'sweepstake':
        return <Trophy className="w-4 h-4" />
      case 'security':
        return <Shield className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'critical':
        return 'bg-red-600/20 text-red-300 border-red-600/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="logs-list-card">
        <CardHeader className="logs-list-header">
          <CardTitle className="logs-list-title">
            Logs do Sistema
          </CardTitle>

          {/* Filters */}
          <div className="logs-filters">
            <div className="logs-search">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="logs-search-input"
              />
            </div>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="logs-filter-select">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="logs-filter-select">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="auth">Autenticação</SelectItem>
                <SelectItem value="payment">Pagamento</SelectItem>
                <SelectItem value="sweepstake">Sorteio</SelectItem>
                <SelectItem value="security">Segurança</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={refreshLogs}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>

            <Button
              onClick={exportLogs}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="logs-list-content">
          {/* Stats */}
          <div className="logs-stats">
            <div className="logs-stat">
              <span className="logs-stat-value">{filteredLogs.length}</span>
              <span className="logs-stat-label">Total</span>
            </div>
            <div className="logs-stat">
              <span className="logs-stat-value text-red-400">
                {filteredLogs.filter(l => l.level === 'error' || l.level === 'critical').length}
              </span>
              <span className="logs-stat-label">Erros</span>
            </div>
            <div className="logs-stat">
              <span className="logs-stat-value text-yellow-400">
                {filteredLogs.filter(l => l.level === 'warning').length}
              </span>
              <span className="logs-stat-label">Avisos</span>
            </div>
          </div>

          {/* Logs List */}
          <div className="logs-entries">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="log-entry"
              >
                <div className="log-entry-header">
                  <div className="log-entry-meta">
                    <div className="log-entry-level">
                      {getLevelIcon(log.level)}
                      <Badge className={`log-level-badge ${getLevelBadgeColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="log-entry-category">
                      {getCategoryIcon(log.category)}
                      <span>{log.category}</span>
                    </div>

                    <div className="log-entry-time">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="log-entry-action">
                    <code>{log.action}</code>
                  </div>
                </div>

                <div className="log-entry-message">
                  {log.message}
                </div>

                {(log.userEmail || log.ip) && (
                  <div className="log-entry-details">
                    {log.userEmail && (
                      <span className="log-detail">
                        <User className="w-3 h-3" />
                        {log.userEmail}
                      </span>
                    )}
                    {log.ip && (
                      <span className="log-detail">
                        <Shield className="w-3 h-3" />
                        {log.ip}
                      </span>
                    )}
                  </div>
                )}

                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <details className="log-entry-metadata">
                    <summary>Metadados</summary>
                    <pre className="log-metadata-content">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </details>
                )}
              </motion.div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="logs-empty">
                <Info className="w-8 h-8 text-gray-400" />
                <p>Nenhum log encontrado com os filtros aplicados.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
