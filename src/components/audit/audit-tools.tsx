'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Search, 
  Shield, 
  Download,
  Calculator,
  FileText,
  ExternalLink
} from 'lucide-react'

const auditTools = [
  {
    id: 'verify-hash',
    title: 'Verificar Hash',
    description: 'Verifique a integridade de um sorteio usando seu hash',
    icon: Shield,
    color: 'text-green-400'
  },
  {
    id: 'search-sweepstake',
    title: 'Buscar Sorteio',
    description: 'Encontre um sorteio específico por ID ou hash',
    icon: Search,
    color: 'text-blue-400'
  },
  {
    id: 'download-proof',
    title: 'Baixar Prova',
    description: 'Baixe a prova criptográfica de um sorteio',
    icon: Download,
    color: 'text-purple-400'
  },
  {
    id: 'calculate-odds',
    title: 'Calcular Probabilidades',
    description: 'Calcule as chances de vitória em um sorteio',
    icon: Calculator,
    color: 'text-orange-400'
  }
]

const externalResources = [
  {
    title: 'Código Fonte',
    description: 'Veja nosso algoritmo no GitHub',
    url: 'https://github.com/chronos-platform/algorithm',
    icon: FileText
  },
  {
    title: 'Documentação Técnica',
    description: 'Entenda como funciona nossa criptografia',
    url: '/docs/algorithm',
    icon: FileText
  },
  {
    title: 'Relatório de Auditoria',
    description: 'Auditoria independente por empresa terceirizada',
    url: '/audit-report.pdf',
    icon: Download
  }
]

export function AuditTools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [hashInput, setHashInput] = useState('')

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(selectedTool === toolId ? null : toolId)
  }

  const handleVerifyHash = () => {
    if (!hashInput.trim()) return
    
    // Simular verificação
    alert(`Verificando hash: ${hashInput.slice(0, 16)}...`)
  }

  const handleSearchSweepstake = () => {
    if (!searchInput.trim()) return
    
    // Simular busca
    alert(`Buscando sorteio: ${searchInput}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="audit-tools"
    >
      {/* Tools Card */}
      <Card className="audit-tools-card">
        <CardHeader className="audit-tools-header">
          <CardTitle className="audit-tools-title">
            <Shield className="w-5 h-5 text-chronos-gold" />
            Ferramentas de Auditoria
          </CardTitle>
        </CardHeader>

        <CardContent className="audit-tools-content">
          <div className="audit-tools-list">
            {auditTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className="audit-tool-item"
              >
                <button
                  onClick={() => handleToolSelect(tool.id)}
                  className={`audit-tool-button ${selectedTool === tool.id ? 'active' : ''}`}
                >
                  <div className={`audit-tool-icon ${tool.color}`}>
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <div className="audit-tool-content">
                    <h4 className="audit-tool-title">
                      {tool.title}
                    </h4>
                    <p className="audit-tool-description">
                      {tool.description}
                    </p>
                  </div>
                </button>

                {/* Tool Forms */}
                {selectedTool === tool.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="audit-tool-form"
                  >
                    {tool.id === 'verify-hash' && (
                      <div className="tool-form-content">
                        <Label htmlFor="hash-input">Hash do Sorteio</Label>
                        <Input
                          id="hash-input"
                          placeholder="Cole o hash aqui..."
                          value={hashInput}
                          onChange={(e) => setHashInput(e.target.value)}
                          className="tool-input"
                        />
                        <Button 
                          onClick={handleVerifyHash}
                          disabled={!hashInput.trim()}
                          className="tool-submit-btn"
                        >
                          Verificar Hash
                        </Button>
                      </div>
                    )}

                    {tool.id === 'search-sweepstake' && (
                      <div className="tool-form-content">
                        <Label htmlFor="search-input">ID ou Hash do Sorteio</Label>
                        <Input
                          id="search-input"
                          placeholder="Digite o ID ou hash..."
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          className="tool-input"
                        />
                        <Button 
                          onClick={handleSearchSweepstake}
                          disabled={!searchInput.trim()}
                          className="tool-submit-btn"
                        >
                          Buscar Sorteio
                        </Button>
                      </div>
                    )}

                    {tool.id === 'download-proof' && (
                      <div className="tool-form-content">
                        <p className="tool-form-text">
                          Baixe a prova criptográfica completa de qualquer sorteio 
                          para verificação independente.
                        </p>
                        <Button className="tool-submit-btn">
                          <Download className="w-4 h-4 mr-2" />
                          Baixar Última Prova
                        </Button>
                      </div>
                    )}

                    {tool.id === 'calculate-odds' && (
                      <div className="tool-form-content">
                        <p className="tool-form-text">
                          Calcule suas chances de vitória baseado no número 
                          de participantes e valor da entrada.
                        </p>
                        <Button className="tool-submit-btn">
                          <Calculator className="w-4 h-4 mr-2" />
                          Abrir Calculadora
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* External Resources */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <Card className="external-resources-card">
          <CardHeader className="external-resources-header">
            <CardTitle className="external-resources-title">
              <ExternalLink className="w-5 h-5 text-chronos-gold" />
              Recursos Externos
            </CardTitle>
          </CardHeader>

          <CardContent className="external-resources-content">
            <div className="external-resources-list">
              {externalResources.map((resource, index) => (
                <motion.a
                  key={resource.title}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                  className="external-resource-item"
                >
                  <div className="external-resource-icon">
                    <resource.icon className="w-5 h-5" />
                  </div>
                  <div className="external-resource-content">
                    <h4 className="external-resource-title">
                      {resource.title}
                    </h4>
                    <p className="external-resource-description">
                      {resource.description}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 external-resource-link-icon" />
                </motion.a>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
