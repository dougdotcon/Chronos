'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from 'next-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useWebSocket } from '@/hooks/useWebSocket'
import { ChatMessage } from '@/lib/websocket-server'
import {
  MessageCircle,
  Send,
  Smile,
  MoreVertical,
  Crown,
  Shield
} from 'lucide-react'
import { getInitials, formatRelativeTime } from '@/lib/utils'

interface SweepstakeChatProps {
  sweepstakeId: string
  user: User
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  userImage?: string
  message: string
  timestamp: Date
  isSystem?: boolean
  isCreator?: boolean
  isModerator?: boolean
}

// Mock data - em produção viria do WebSocket
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: 'system',
    userName: 'Sistema',
    message: 'Sorteio iniciado! Boa sorte a todos! 🍀',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isSystem: true
  },
  {
    id: '2',
    userId: 'user1',
    userName: 'João Silva',
    message: 'Primeira vez aqui, muito legal a plataforma!',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    isCreator: true
  },
  {
    id: '3',
    userId: 'user2',
    userName: 'Maria Santos',
    message: 'Boa sorte pessoal! 🎯',
    timestamp: new Date(Date.now() - 1000 * 60 * 20)
  },
  {
    id: '4',
    userId: 'user3',
    userName: 'Pedro Costa',
    message: 'Alguém sabe qual é a taxa da casa?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: '5',
    userId: 'user1',
    userName: 'João Silva',
    message: 'É 5% Pedro, bem transparente aqui',
    timestamp: new Date(Date.now() - 1000 * 60 * 14),
    isCreator: true
  },
  {
    id: '6',
    userId: 'user4',
    userName: 'Ana Oliveira',
    message: 'Que nervoso! Primeira vez em sorteio online 😅',
    timestamp: new Date(Date.now() - 1000 * 60 * 10)
  }
]

export function SweepstakeChat({ sweepstakeId, user }: SweepstakeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Simular novas mensagens
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance a cada 10 segundos
        const randomMessages = [
          'Boa sorte galera! 🍀',
          'Vamos que vamos! 💪',
          'Quem será o sortudo? 🤔',
          'Energia positiva! ✨',
          'Fé no resultado! 🙏'
        ]

        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          userId: `user${Math.floor(Math.random() * 10)}`,
          userName: `Usuário ${Math.floor(Math.random() * 100)}`,
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date()
        }

        setMessages(prev => [...prev, newMsg])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name || 'Usuário',
      userImage: user.image || undefined,
      message: newMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    inputRef.current?.focus()
  }

  const getMessageStyle = (message: ChatMessage) => {
    if (message.isSystem) return 'message-system'
    if (message.userId === user.id) return 'message-own'
    return 'message-other'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Card className="chat-card">
        <CardHeader className="chat-header">
          <CardTitle className="chat-title">
            <MessageCircle className="w-5 h-5 text-chronos-gold" />
            Chat ao Vivo
            <div className="chat-status">
              <div className={`chat-status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
              <span className="chat-status-text">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="chat-content">
          {/* Messages Area */}
          <div className="chat-messages">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`chat-message ${getMessageStyle(message)}`}
                >
                  {!message.isSystem && (
                    <div className="message-avatar">
                      <Avatar className="message-avatar-img">
                        <AvatarImage src={message.userImage || ''} />
                        <AvatarFallback className="message-avatar-fallback">
                          {getInitials(message.userName)}
                        </AvatarFallback>
                      </Avatar>
                      {message.isCreator && (
                        <div className="message-creator-badge">
                          <Crown className="w-3 h-3" />
                        </div>
                      )}
                      {message.isModerator && (
                        <div className="message-moderator-badge">
                          <Shield className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="message-content">
                    {!message.isSystem && (
                      <div className="message-header">
                        <span className="message-author">
                          {message.userName}
                          {message.isCreator && (
                            <Badge variant="outline" className="message-creator-text">
                              Criador
                            </Badge>
                          )}
                          {message.isModerator && (
                            <Badge variant="outline" className="message-moderator-text">
                              Mod
                            </Badge>
                          )}
                        </span>
                        <span className="message-time">
                          {formatRelativeTime(message.timestamp)}
                        </span>
                      </div>
                    )}

                    <div className={`message-text ${message.isSystem ? 'system' : ''}`}>
                      {message.message}
                    </div>
                  </div>

                  {message.userId === user.id && !message.isSystem && (
                    <button className="message-options">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <div className="chat-input-container">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="chat-input"
                maxLength={200}
                disabled={!isConnected}
              />

              <div className="chat-input-actions">
                <button
                  type="button"
                  className="chat-emoji-btn"
                  disabled={!isConnected}
                >
                  <Smile className="w-4 h-4" />
                </button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={!newMessage.trim() || !isConnected}
                  className="chat-send-btn"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="chat-input-info">
              <span className="chat-char-count">
                {newMessage.length}/200
              </span>
              <span className="chat-rules-link">
                <a href="/chat-rules" target="_blank">
                  Regras do chat
                </a>
              </span>
            </div>
          </form>

          {/* Connection Status */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="chat-disconnected"
            >
              <div className="chat-disconnected-icon">⚠️</div>
              <div className="chat-disconnected-text">
                <strong>Conexão perdida</strong>
                <br />
                Tentando reconectar...
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
