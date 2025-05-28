'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search,
  Filter,
  MoreVertical,
  Ban,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Mail,
  Shield,
  DollarSign,
  Calendar
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency, getInitials } from '@/lib/utils'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status: 'active' | 'suspended' | 'banned'
  verified: boolean
  balance: number
  totalDeposits: number
  totalWithdrawals: number
  sweepstakesWon: number
  createdAt: Date
  lastLogin: Date
  role: 'user' | 'moderator' | 'admin'
}

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    status: 'active',
    verified: true,
    balance: 1250.50,
    totalDeposits: 5000,
    totalWithdrawals: 3500,
    sweepstakesWon: 12,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
    role: 'user'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    status: 'active',
    verified: true,
    balance: 850.25,
    totalDeposits: 3200,
    totalWithdrawals: 2100,
    sweepstakesWon: 8,
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(Date.now() - 1000 * 60 * 30),
    role: 'user'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@example.com',
    status: 'suspended',
    verified: false,
    balance: 0,
    totalDeposits: 500,
    totalWithdrawals: 0,
    sweepstakesWon: 0,
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    role: 'user'
  }
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>
      case 'suspended':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Suspenso</Badge>
      case 'banned':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Banido</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Admin</Badge>
      case 'moderator':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Moderador</Badge>
      default:
        return <Badge variant="outline">Usuário</Badge>
    }
  }

  const handleUserAction = (userId: string, action: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === userId) {
          switch (action) {
            case 'suspend':
              return { ...user, status: 'suspended' as const }
            case 'activate':
              return { ...user, status: 'active' as const }
            case 'ban':
              return { ...user, status: 'banned' as const }
            default:
              return user
          }
        }
        return user
      })
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="user-management-card">
        <CardHeader>
          <CardTitle className="user-management-title">
            Gestão de Usuários
          </CardTitle>

          {/* Filters */}
          <div className="user-management-filters">
            <div className="user-search">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="user-search-input"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="user-status-filter"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="suspended">Suspensos</option>
              <option value="banned">Banidos</option>
            </select>
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats */}
          <div className="user-management-stats">
            <div className="user-stat">
              <span className="user-stat-value">{users.length}</span>
              <span className="user-stat-label">Total de Usuários</span>
            </div>
            <div className="user-stat">
              <span className="user-stat-value text-green-400">
                {users.filter(u => u.status === 'active').length}
              </span>
              <span className="user-stat-label">Ativos</span>
            </div>
            <div className="user-stat">
              <span className="user-stat-value text-yellow-400">
                {users.filter(u => u.status === 'suspended').length}
              </span>
              <span className="user-stat-label">Suspensos</span>
            </div>
            <div className="user-stat">
              <span className="user-stat-value text-red-400">
                {users.filter(u => u.status === 'banned').length}
              </span>
              <span className="user-stat-label">Banidos</span>
            </div>
          </div>

          {/* Users List */}
          <div className="users-list">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="user-item"
              >
                <div className="user-item-main">
                  <div className="user-item-avatar">
                    <Avatar className="user-avatar">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="user-item-info">
                      <div className="user-item-name">
                        {user.name}
                        {user.verified && (
                          <CheckCircle className="w-4 h-4 text-green-400 ml-1" />
                        )}
                      </div>
                      <div className="user-item-email">{user.email}</div>
                    </div>
                  </div>

                  <div className="user-item-badges">
                    {getStatusBadge(user.status)}
                    {getRoleBadge(user.role)}
                  </div>
                </div>

                <div className="user-item-stats">
                  <div className="user-stat-item">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span>{formatCurrency(user.balance)}</span>
                  </div>
                  <div className="user-stat-item">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span>{user.sweepstakesWon} vitórias</span>
                  </div>
                  <div className="user-stat-item">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{user.lastLogin.toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="user-item-actions">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar Email
                      </DropdownMenuItem>
                      {user.status === 'active' ? (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            className="text-yellow-400"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Suspender
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUserAction(user.id, 'ban')}
                            className="text-red-400"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Banir
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => handleUserAction(user.id, 'activate')}
                          className="text-green-400"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Ativar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="users-empty">
                <Users className="w-8 h-8 text-gray-400" />
                <p>Nenhum usuário encontrado com os filtros aplicados.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
