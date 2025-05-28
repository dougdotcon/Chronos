'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Smile,
  X,
  Minimize2,
  Maximize2,
  Phone,
  Video,
  MoreVertical,
  Clock,
  CheckCheck,
  AlertCircle
} from 'lucide-react'

interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
  type: 'text' | 'image' | 'file'
  attachments?: Array<{
    name: string
    url: string
    type: string
    size: number
  }>
}

interface SupportAgent {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'away' | 'busy'
  department: string
  rating: number
}

// Mock data
const mockAgent: SupportAgent = {
  id: 'agent1',
  name: 'Ana Silva',
  avatar: '/avatars/agent1.jpg',
  status: 'online',
  department: 'Suporte Técnico',
  rating: 4.9
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Olá! Sou a Ana do suporte Chronos. Como posso ajudá-lo hoje?',
    sender: 'agent',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'read',
    type: 'text'
  },
  {
    id: '2',
    content: 'Oi! Estou com dificuldade para fazer um saque.',
    sender: 'user',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    status: 'read',
    type: 'text'
  },
  {
    id: '3',
    content: 'Entendo sua preocupação. Vou verificar sua conta. Pode me informar qual erro está aparecendo?',
    sender: 'agent',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    status: 'read',
    type: 'text'
  }
]

interface SupportChatProps {
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
  isMinimized: boolean
}

export function SupportChat({ isOpen, onClose, onMinimize, isMinimized }: SupportChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connected')
  const [agent, setAgent] = useState<SupportAgent>(mockAgent)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')

    // Simulate message sending
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      )
    }, 500)

    // Simulate agent typing
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getAgentResponse(newMessage),
        sender: 'agent',
        timestamp: new Date(),
        status: 'sent',
        type: 'text'
      }
      
      setMessages(prev => [...prev, agentResponse])
    }, 2000)
  }

  const getAgentResponse = (userMessage: string): string => {
    const responses = [
      'Entendi. Vou verificar isso para você imediatamente.',
      'Obrigada pela informação. Deixe-me analisar sua conta.',
      'Perfeito! Vou resolver isso agora mesmo.',
      'Compreendo sua situação. Vamos solucionar juntos.',
      'Ótima pergunta! Vou explicar como funciona.'
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusIcon = (status: ChatMessage['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />
      case 'sent':
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-400" />
      default:
        return null
    }
  }

  const getAgentStatusColor = (status: SupportAgent['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          height: isMinimized ? 'auto' : '600px'
        }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="support-chat-container"
      >
        <Card className="support-chat-card">
          {/* Chat Header */}
          <CardHeader className="support-chat-header">
            <div className="support-chat-header-content">
              <div className="support-agent-info">
                <div className="support-agent-avatar">
                  <Avatar className="support-avatar">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className={`support-agent-status ${getAgentStatusColor(agent.status)}`} />
                </div>
                
                <div className="support-agent-details">
                  <h4 className="support-agent-name">{agent.name}</h4>
                  <p className="support-agent-department">{agent.department}</p>
                  <div className="support-agent-rating">
                    ⭐ {agent.rating}
                  </div>
                </div>
              </div>

              <div className="support-chat-actions">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onMinimize}>
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Connection Status */}
            <div className="support-connection-status">
              <div className={`support-status-indicator ${connectionStatus}`}>
                <div className="support-status-dot" />
                <span>
                  {connectionStatus === 'connected' && 'Conectado'}
                  {connectionStatus === 'connecting' && 'Conectando...'}
                  {connectionStatus === 'disconnected' && 'Desconectado'}
                </span>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="support-chat-content">
              {/* Messages Area */}
              <div className="support-messages-area">
                <div className="support-messages-list">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`support-message ${message.sender === 'user' ? 'user' : 'agent'}`}
                    >
                      {message.sender === 'agent' && (
                        <Avatar className="support-message-avatar">
                          <AvatarImage src={agent.avatar} alt={agent.name} />
                          <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className="support-message-content">
                        <div className="support-message-bubble">
                          <p>{message.content}</p>
                        </div>
                        
                        <div className="support-message-meta">
                          <span className="support-message-time">
                            {message.timestamp.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {message.sender === 'user' && getStatusIcon(message.status)}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="support-typing-indicator"
                    >
                      <Avatar className="support-message-avatar">
                        <AvatarImage src={agent.avatar} alt={agent.name} />
                        <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="support-typing-bubble">
                        <div className="support-typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="support-input-area">
                <div className="support-input-container">
                  <Button variant="ghost" size="sm" className="support-attachment-button">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="support-message-input"
                  />
                  
                  <Button variant="ghost" size="sm" className="support-emoji-button">
                    <Smile className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="support-send-button"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="support-quick-actions">
                  <Button variant="outline" size="sm" onClick={() => setNewMessage('Preciso de ajuda com depósito')}>
                    Depósito
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setNewMessage('Tenho dúvidas sobre saque')}>
                    Saque
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setNewMessage('Como funciona o sorteio?')}>
                    Sorteios
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

// Support Chat Widget (floating button)
export function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true)

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="support-chat-widget"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="w-6 h-6" />
          {hasUnreadMessages && (
            <div className="support-chat-notification-dot" />
          )}
        </motion.div>
      )}

      {/* Chat Window */}
      <SupportChat
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setIsMinimized(false)
        }}
        onMinimize={() => setIsMinimized(!isMinimized)}
        isMinimized={isMinimized}
      />
    </>
  )
}
