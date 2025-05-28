'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Download, 
  FileText, 
  Database, 
  Calendar,
  DollarSign,
  Trophy,
  MessageSquare,
  Shield,
  RefreshCw,
  CheckCircle,
  Info
} from 'lucide-react'

interface ExportOption {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  dataType: string
  estimatedSize: string
  format: 'csv' | 'json' | 'pdf'
  enabled: boolean
}

const exportOptions: ExportOption[] = [
  {
    id: 'sweepstakes',
    label: 'Histórico de Sorteios',
    description: 'Todos os sorteios que você participou',
    icon: <Trophy className="w-5 h-5 text-yellow-400" />,
    dataType: 'sweepstakes_history',
    estimatedSize: '~2.5 MB',
    format: 'csv',
    enabled: true
  },
  {
    id: 'transactions',
    label: 'Transações Financeiras',
    description: 'Depósitos, saques e transferências',
    icon: <DollarSign className="w-5 h-5 text-green-400" />,
    dataType: 'financial_transactions',
    estimatedSize: '~1.2 MB',
    format: 'csv',
    enabled: true
  },
  {
    id: 'chat',
    label: 'Mensagens de Chat',
    description: 'Histórico de mensagens em salas',
    icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
    dataType: 'chat_messages',
    estimatedSize: '~800 KB',
    format: 'json',
    enabled: true
  },
  {
    id: 'profile',
    label: 'Dados do Perfil',
    description: 'Informações pessoais e configurações',
    icon: <Shield className="w-5 h-5 text-purple-400" />,
    dataType: 'profile_data',
    estimatedSize: '~50 KB',
    format: 'json',
    enabled: true
  },
  {
    id: 'activity',
    label: 'Log de Atividades',
    description: 'Histórico de ações na plataforma',
    icon: <Database className="w-5 h-5 text-gray-400" />,
    dataType: 'activity_log',
    estimatedSize: '~3.1 MB',
    format: 'csv',
    enabled: true
  },
  {
    id: 'complete',
    label: 'Relatório Completo',
    description: 'Todos os dados em um arquivo PDF',
    icon: <FileText className="w-5 h-5 text-red-400" />,
    dataType: 'complete_report',
    estimatedSize: '~15 MB',
    format: 'pdf',
    enabled: true
  }
]

export function DataExport() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState<'idle' | 'preparing' | 'exporting' | 'complete' | 'error'>('idle')

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const selectAll = () => {
    setSelectedOptions(exportOptions.map(option => option.id))
  }

  const selectNone = () => {
    setSelectedOptions([])
  }

  const startExport = async () => {
    if (selectedOptions.length === 0) {
      alert('Selecione pelo menos uma opção para exportar')
      return
    }

    setIsExporting(true)
    setExportStatus('preparing')
    setExportProgress(0)

    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setExportProgress(i)
        
        if (i === 30) setExportStatus('exporting')
      }

      // Generate and download files
      for (const optionId of selectedOptions) {
        const option = exportOptions.find(opt => opt.id === optionId)
        if (option) {
          await generateExportFile(option)
        }
      }

      setExportStatus('complete')
    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('error')
    } finally {
      setIsExporting(false)
      setTimeout(() => {
        setExportStatus('idle')
        setExportProgress(0)
      }, 3000)
    }
  }

  const generateExportFile = async (option: ExportOption) => {
    // Simulate data generation
    let content = ''
    const timestamp = new Date().toISOString().split('T')[0]
    
    switch (option.format) {
      case 'csv':
        content = generateCSVContent(option.dataType)
        break
      case 'json':
        content = generateJSONContent(option.dataType)
        break
      case 'pdf':
        // For PDF, we would use a library like jsPDF
        content = 'PDF content would be generated here'
        break
    }

    // Create and download file
    const blob = new Blob([content], { 
      type: option.format === 'json' ? 'application/json' : 'text/plain' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chronos-${option.dataType}-${timestamp}.${option.format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateCSVContent = (dataType: string) => {
    switch (dataType) {
      case 'sweepstakes_history':
        return `Data,Sorteio,Valor Apostado,Resultado,Prêmio
2024-01-15,Sorteio #1234,R$ 25.00,Vitória,R$ 500.00
2024-01-14,Sorteio #1233,R$ 15.00,Derrota,R$ 0.00
2024-01-13,Sorteio #1232,R$ 30.00,Vitória,R$ 180.00`
      
      case 'financial_transactions':
        return `Data,Tipo,Método,Valor,Status
2024-01-15,Depósito,PIX,R$ 100.00,Confirmado
2024-01-14,Saque,TED,R$ 250.00,Processando
2024-01-13,Depósito,Cartão,R$ 50.00,Confirmado`
      
      case 'activity_log':
        return `Data,Ação,Detalhes,IP
2024-01-15 14:30,Login,Login realizado com sucesso,192.168.1.100
2024-01-15 14:25,Participação,Entrou no sorteio #1234,192.168.1.100
2024-01-15 14:20,Depósito,Depósito via PIX confirmado,192.168.1.100`
      
      default:
        return 'Dados não disponíveis'
    }
  }

  const generateJSONContent = (dataType: string) => {
    const data = {
      exportDate: new Date().toISOString(),
      dataType,
      user: {
        id: 'user123',
        email: 'usuario@example.com'
      },
      data: []
    }

    switch (dataType) {
      case 'chat_messages':
        data.data = [
          {
            id: '1',
            roomId: 'room123',
            message: 'Boa sorte pessoal!',
            timestamp: '2024-01-15T14:30:00Z'
          },
          {
            id: '2',
            roomId: 'room124',
            message: 'Vamos que vamos!',
            timestamp: '2024-01-15T15:00:00Z'
          }
        ]
        break
      
      case 'profile_data':
        data.data = {
          name: 'João Silva',
          email: 'joao@example.com',
          cpf: '***.***.***-**',
          phone: '(11) 9****-****',
          address: {
            city: 'São Paulo',
            state: 'SP'
          },
          preferences: {
            notifications: true,
            newsletter: false
          }
        }
        break
    }

    return JSON.stringify(data, null, 2)
  }

  const getStatusMessage = () => {
    switch (exportStatus) {
      case 'preparing':
        return 'Preparando dados para exportação...'
      case 'exporting':
        return 'Gerando arquivos de exportação...'
      case 'complete':
        return 'Exportação concluída com sucesso!'
      case 'error':
        return 'Erro durante a exportação. Tente novamente.'
      default:
        return ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="data-export-card">
        <CardHeader>
          <CardTitle className="data-export-title">
            <Download className="w-6 h-6 text-blue-500" />
            Exportar Meus Dados
          </CardTitle>
          <p className="data-export-description">
            Baixe uma cópia dos seus dados da plataforma Chronos
          </p>
        </CardHeader>

        <CardContent>
          <Alert className="data-export-info">
            <Info className="w-4 h-4" />
            <AlertDescription>
              De acordo com a LGPD, você tem direito a uma cópia de todos os seus dados. 
              Selecione quais informações deseja exportar.
            </AlertDescription>
          </Alert>

          {/* Selection Controls */}
          <div className="data-export-controls">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              disabled={isExporting}
            >
              Selecionar Todos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={selectNone}
              disabled={isExporting}
            >
              Limpar Seleção
            </Button>
          </div>

          {/* Export Options */}
          <div className="data-export-options">
            {exportOptions.map((option) => (
              <div
                key={option.id}
                className={`data-export-option ${selectedOptions.includes(option.id) ? 'selected' : ''}`}
              >
                <div className="data-export-option-checkbox">
                  <Checkbox
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={() => handleOptionToggle(option.id)}
                    disabled={!option.enabled || isExporting}
                  />
                </div>

                <div className="data-export-option-icon">
                  {option.icon}
                </div>

                <div className="data-export-option-content">
                  <div className="data-export-option-header">
                    <h4 className="data-export-option-label">{option.label}</h4>
                    <div className="data-export-option-badges">
                      <Badge variant="outline" className="data-export-format-badge">
                        {option.format.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="data-export-size-badge">
                        {option.estimatedSize}
                      </Badge>
                    </div>
                  </div>
                  <p className="data-export-option-description">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="data-export-progress">
              <div className="data-export-progress-header">
                <span className="data-export-progress-text">
                  {getStatusMessage()}
                </span>
                <span className="data-export-progress-percentage">
                  {exportProgress}%
                </span>
              </div>
              <div className="data-export-progress-bar">
                <div 
                  className="data-export-progress-fill"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Export Status */}
          {exportStatus === 'complete' && (
            <Alert className="data-export-success">
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                Seus dados foram exportados com sucesso! Os arquivos foram baixados automaticamente.
              </AlertDescription>
            </Alert>
          )}

          {exportStatus === 'error' && (
            <Alert className="data-export-error">
              <AlertDescription>
                Ocorreu um erro durante a exportação. Verifique sua conexão e tente novamente.
              </AlertDescription>
            </Alert>
          )}

          {/* Export Button */}
          <div className="data-export-actions">
            <Button
              onClick={startExport}
              disabled={isExporting || selectedOptions.length === 0}
              className="data-export-button"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Dados ({selectedOptions.length} selecionados)
                </>
              )}
            </Button>
          </div>

          {/* Export Info */}
          <div className="data-export-footer">
            <div className="data-export-info-item">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Os dados incluem informações dos últimos 12 meses</span>
            </div>
            <div className="data-export-info-item">
              <Shield className="w-4 h-4 text-gray-400" />
              <span>Todos os dados são criptografados durante o download</span>
            </div>
            <div className="data-export-info-item">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>Formatos disponíveis: CSV, JSON e PDF</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
