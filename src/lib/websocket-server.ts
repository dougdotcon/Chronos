import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  userImage?: string
  message: string
  timestamp: Date
  sweepstakeId: string
  isSystem?: boolean
  isCreator?: boolean
  isModerator?: boolean
}

export interface SweepstakeUpdate {
  sweepstakeId: string
  participants: number
  timeLeft: number
  status: string
  lastParticipant?: {
    name: string
    joinedAt: Date
  }
}

class WebSocketManager {
  private io: SocketIOServer | null = null
  private connectedUsers = new Map<string, { socketId: string, userId: string, userName: string }>()

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })

    this.io.on('connection', (socket: Socket) => {
      console.log('Cliente conectado:', socket.id)

      // Autenticação do socket
      socket.on('authenticate', async (token: string) => {
        try {
          // Verificar token de autenticação
          // Em produção, validar JWT token aqui
          const userId = token // Simplificado para demo
          
          if (userId) {
            this.connectedUsers.set(socket.id, {
              socketId: socket.id,
              userId,
              userName: `User ${userId}`
            })
            
            socket.emit('authenticated', { success: true })
            console.log(`Usuário ${userId} autenticado`)
          }
        } catch (error) {
          socket.emit('authenticated', { success: false, error: 'Token inválido' })
        }
      })

      // Entrar em sala de sorteio
      socket.on('join-sweepstake', async (sweepstakeId: string) => {
        try {
          socket.join(`sweepstake-${sweepstakeId}`)
          
          // Buscar dados do sorteio
          const sweepstake = await prisma.sweepstake.findUnique({
            where: { id: sweepstakeId },
            include: {
              participants: {
                include: {
                  user: {
                    select: { id: true, name: true, image: true }
                  }
                }
              }
            }
          })

          if (sweepstake) {
            // Enviar estado atual do sorteio
            socket.emit('sweepstake-state', {
              sweepstakeId,
              participants: sweepstake.participants.length,
              maxParticipants: sweepstake.maxParticipants,
              timeLeft: Math.max(0, Math.floor((sweepstake.endTime.getTime() - Date.now()) / 1000)),
              status: sweepstake.status
            })

            // Notificar outros usuários sobre nova conexão
            const user = this.connectedUsers.get(socket.id)
            if (user) {
              socket.to(`sweepstake-${sweepstakeId}`).emit('user-joined-room', {
                userId: user.userId,
                userName: user.userName
              })
            }
          }

          console.log(`Socket ${socket.id} entrou na sala ${sweepstakeId}`)
        } catch (error) {
          console.error('Erro ao entrar na sala:', error)
          socket.emit('error', { message: 'Erro ao entrar na sala' })
        }
      })

      // Sair da sala de sorteio
      socket.on('leave-sweepstake', (sweepstakeId: string) => {
        socket.leave(`sweepstake-${sweepstakeId}`)
        
        const user = this.connectedUsers.get(socket.id)
        if (user) {
          socket.to(`sweepstake-${sweepstakeId}`).emit('user-left-room', {
            userId: user.userId,
            userName: user.userName
          })
        }
        
        console.log(`Socket ${socket.id} saiu da sala ${sweepstakeId}`)
      })

      // Enviar mensagem no chat
      socket.on('send-message', async (data: { sweepstakeId: string, message: string }) => {
        try {
          const user = this.connectedUsers.get(socket.id)
          if (!user) {
            socket.emit('error', { message: 'Usuário não autenticado' })
            return
          }

          // Validar mensagem
          if (!data.message || data.message.trim().length === 0) {
            socket.emit('error', { message: 'Mensagem vazia' })
            return
          }

          if (data.message.length > 200) {
            socket.emit('error', { message: 'Mensagem muito longa' })
            return
          }

          // Criar mensagem
          const chatMessage: ChatMessage = {
            id: Date.now().toString(),
            userId: user.userId,
            userName: user.userName,
            message: data.message.trim(),
            timestamp: new Date(),
            sweepstakeId: data.sweepstakeId
          }

          // Salvar no banco (opcional)
          // await prisma.chatMessage.create({ data: chatMessage })

          // Enviar para todos na sala
          this.io?.to(`sweepstake-${data.sweepstakeId}`).emit('new-message', chatMessage)
          
          console.log(`Mensagem enviada na sala ${data.sweepstakeId}:`, data.message)
        } catch (error) {
          console.error('Erro ao enviar mensagem:', error)
          socket.emit('error', { message: 'Erro ao enviar mensagem' })
        }
      })

      // Desconexão
      socket.on('disconnect', () => {
        const user = this.connectedUsers.get(socket.id)
        if (user) {
          // Notificar salas sobre desconexão
          socket.rooms.forEach(room => {
            if (room.startsWith('sweepstake-')) {
              socket.to(room).emit('user-disconnected', {
                userId: user.userId,
                userName: user.userName
              })
            }
          })
        }
        
        this.connectedUsers.delete(socket.id)
        console.log('Cliente desconectado:', socket.id)
      })
    })

    console.log('WebSocket server inicializado')
  }

  // Métodos para enviar atualizações do servidor
  broadcastSweepstakeUpdate(update: SweepstakeUpdate) {
    if (this.io) {
      this.io.to(`sweepstake-${update.sweepstakeId}`).emit('sweepstake-update', update)
    }
  }

  broadcastSystemMessage(sweepstakeId: string, message: string) {
    if (this.io) {
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'Sistema',
        message,
        timestamp: new Date(),
        sweepstakeId,
        isSystem: true
      }
      
      this.io.to(`sweepstake-${sweepstakeId}`).emit('new-message', systemMessage)
    }
  }

  broadcastSweepstakeResult(sweepstakeId: string, winner: { name: string, prize: number }) {
    if (this.io) {
      this.io.to(`sweepstake-${sweepstakeId}`).emit('sweepstake-finished', {
        sweepstakeId,
        winner,
        timestamp: new Date()
      })

      // Mensagem do sistema
      this.broadcastSystemMessage(
        sweepstakeId,
        `🎉 Sorteio finalizado! Parabéns ${winner.name}, você ganhou R$ ${winner.prize.toFixed(2)}!`
      )
    }
  }

  getConnectedUsersCount(): number {
    return this.connectedUsers.size
  }

  getSweepstakeRoomSize(sweepstakeId: string): number {
    if (this.io) {
      const room = this.io.sockets.adapter.rooms.get(`sweepstake-${sweepstakeId}`)
      return room ? room.size : 0
    }
    return 0
  }
}

export const websocketManager = new WebSocketManager()
export default websocketManager
