'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Ticket, 
  Plus, 
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Eye,
  MoreVertical
} from 'lucide-react'

interface SupportTicket {
  id: string
  title: string
  description: string
  category: 'technical' | 'payment' | 'account' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed'
  createdAt: Date
  updatedAt: Date
  responses: number
  assignedAgent?: string
  attachments?: Array<{
    name: string
    url: string
    type: string
  }>
}

// Mock tickets data
const mockTickets: SupportTicket[] = [
  {
    id: 'TK-001',
    title: 'Problema com saque via PIX',
    description: 'Meu saque foi solicitado há 2 dias mas ainda não foi processado.',
    category: 'payment',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    responses: 3,
    assignedAgent: 'Ana Silva'
  },
  {
    id: 'TK-002',
    title: 'Dúvida sobre verificação de conta',
    description: 'Quais documentos preciso enviar para verificar minha conta?',
    category: 'account',
    priority: 'medium',
    status: 'waiting_response',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    responses: 1,
    assignedAgent: 'Carlos Santos'
  },
  {
    id: 'TK-003',
    title: 'Erro ao participar de sorteio',
    description: 'Quando tento participar de um sorteio, aparece erro 500.',
    category: 'technical',
    priority: 'urgent',
    status: 'open',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    responses: 0
  }
]

export function SupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general' as SupportTicket['category'],
    priority: 'medium' as SupportTicket['priority']
  })

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const createTicket = async () => {
    if (!newTicket.title || !newTicket.description) return

    const ticket: SupportTicket = {
      id: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
      title: newTicket.title,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: 0
    }

    setTickets(prev => [ticket, ...prev])
    setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' })
    setShowCreateForm(false)
  }

  const getStatusBadge = (status: SupportTicket['status']) => {
    const statusConfig = {
      open: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Aberto' },
      in_progress: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Em Andamento' },
      waiting_response: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Aguardando' },
      resolved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Resolvido' },
      closed: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Fechado' }
    }

    const config = statusConfig[status]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    const priorityConfig = {
      low: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Baixa' },
      medium: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Média' },
      high: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'Alta' },
      urgent: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Urgente' }
    }

    const config = priorityConfig[priority]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getCategoryIcon = (category: SupportTicket['category']) => {
    switch (category) {
      case 'technical':
        return '🔧'
      case 'payment':
        return '💳'
      case 'account':
        return '👤'
      default:
        return '❓'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="support-tickets-card">
        <CardHeader>
          <div className="support-tickets-header">
            <CardTitle className="support-tickets-title">
              <Ticket className="w-6 h-6 text-blue-500" />
              Meus Tickets de Suporte
            </CardTitle>

            <Button
              onClick={() => setShowCreateForm(true)}
              className="support-create-ticket-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Ticket
            </Button>
          </div>

          {/* Filters */}
          <div className="support-tickets-filters">
            <div className="support-search">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="support-search-input"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="support-filter-select"
            >
              <option value="all">Todos os status</option>
              <option value="open">Aberto</option>
              <option value="in_progress">Em Andamento</option>
              <option value="waiting_response">Aguardando</option>
              <option value="resolved">Resolvido</option>
              <option value="closed">Fechado</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="support-filter-select"
            >
              <option value="all">Todas categorias</option>
              <option value="technical">Técnico</option>
              <option value="payment">Pagamento</option>
              <option value="account">Conta</option>
              <option value="general">Geral</option>
            </select>
          </div>
        </CardHeader>

        <CardContent>
          {/* Create Ticket Form */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="support-create-form"
            >
              <Card className="support-create-form-card">
                <CardHeader>
                  <CardTitle>Criar Novo Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="support-form-grid">
                    <div className="support-form-group">
                      <label>Título</label>
                      <Input
                        value={newTicket.title}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Descreva brevemente o problema"
                      />
                    </div>

                    <div className="support-form-group">
                      <label>Categoria</label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value as any }))}
                        className="support-form-select"
                      >
                        <option value="general">Geral</option>
                        <option value="technical">Técnico</option>
                        <option value="payment">Pagamento</option>
                        <option value="account">Conta</option>
                      </select>
                    </div>

                    <div className="support-form-group">
                      <label>Prioridade</label>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="support-form-select"
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>

                    <div className="support-form-group support-form-full">
                      <label>Descrição</label>
                      <Textarea
                        value={newTicket.description}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva detalhadamente o problema ou dúvida"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="support-form-actions">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={createTicket}
                      disabled={!newTicket.title || !newTicket.description}
                    >
                      Criar Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tickets List */}
          <div className="support-tickets-list">
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="support-ticket-item"
              >
                <div className="support-ticket-header">
                  <div className="support-ticket-id">
                    <span className="support-ticket-emoji">{getCategoryIcon(ticket.category)}</span>
                    <span className="support-ticket-number">#{ticket.id}</span>
                  </div>

                  <div className="support-ticket-badges">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>

                <div className="support-ticket-content">
                  <h4 className="support-ticket-title">{ticket.title}</h4>
                  <p className="support-ticket-description">{ticket.description}</p>
                </div>

                <div className="support-ticket-meta">
                  <div className="support-ticket-info">
                    <div className="support-ticket-date">
                      <Clock className="w-4 h-4" />
                      <span>Criado em {ticket.createdAt.toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    {ticket.responses > 0 && (
                      <div className="support-ticket-responses">
                        <MessageSquare className="w-4 h-4" />
                        <span>{ticket.responses} resposta{ticket.responses !== 1 ? 's' : ''}</span>
                      </div>
                    )}

                    {ticket.assignedAgent && (
                      <div className="support-ticket-agent">
                        <span>Atribuído a: {ticket.assignedAgent}</span>
                      </div>
                    )}
                  </div>

                  <div className="support-ticket-actions">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="support-tickets-empty">
                <Ticket className="w-8 h-8 text-gray-400" />
                <p>Nenhum ticket encontrado com os filtros aplicados.</p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  variant="outline"
                >
                  Criar Primeiro Ticket
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
