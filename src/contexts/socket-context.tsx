'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'
import { useChronosStore } from '@/store/chronos-store'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

interface SocketProviderProps {
  children: React.ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  const {
    setConnected,
    addNotification,
    updateChronosBalance,
    addTransaction,
    setActiveRooms,
    setCurrentRoom,
  } = useChronosStore((state) => ({
    setConnected: state.setConnected,
    addNotification: state.addNotification,
    updateChronosBalance: state.updateChronosBalance,
    addTransaction: state.addTransaction,
    setActiveRooms: state.setActiveRooms,
    setCurrentRoom: state.setCurrentRoom,
  }))

  useEffect(() => {
    if (session?.user) {
      // Initialize socket connection
      const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
        auth: {
          userId: session.user.id,
          token: session.user.email, // In production, use proper JWT token
        },
        transports: ['websocket', 'polling'],
      })

      // Connection events
      socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id)
        setIsConnected(true)
        setConnected(true)
        
        addNotification({
          type: 'success',
          title: 'Conectado',
          message: 'Conexão estabelecida com sucesso!',
        })
      })

      socketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason)
        setIsConnected(false)
        setConnected(false)
        
        addNotification({
          type: 'warning',
          title: 'Desconectado',
          message: 'Conexão perdida. Tentando reconectar...',
        })
      })

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
        setIsConnected(false)
        setConnected(false)
        
        addNotification({
          type: 'error',
          title: 'Erro de Conexão',
          message: 'Falha ao conectar com o servidor.',
        })
      })

      // Balance updates
      socketInstance.on('balance_updated', (data: { balance: number }) => {
        updateChronosBalance(data.balance)
        addNotification({
          type: 'info',
          title: 'Saldo Atualizado',
          message: `Seu saldo foi atualizado para ${data.balance} Chronos`,
        })
      })

      // Transaction events
      socketInstance.on('transaction_completed', (transaction: any) => {
        addTransaction({
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount,
          status: 'COMPLETED',
          description: transaction.description,
          createdAt: new Date(transaction.createdAt),
        })
        
        addNotification({
          type: 'success',
          title: 'Transação Concluída',
          message: transaction.description || 'Transação processada com sucesso',
        })
      })

      // Room events
      socketInstance.on('rooms_updated', (rooms: any[]) => {
        setActiveRooms(rooms)
      })

      socketInstance.on('room_joined', (room: any) => {
        setCurrentRoom(room)
        addNotification({
          type: 'success',
          title: 'Sala Entrou',
          message: `Você entrou na sala ${room.name || room.id}`,
        })
      })

      socketInstance.on('room_left', () => {
        setCurrentRoom(null)
        addNotification({
          type: 'info',
          title: 'Sala Saiu',
          message: 'Você saiu da sala',
        })
      })

      socketInstance.on('room_started', (data: { roomId: string; countdown: number }) => {
        addNotification({
          type: 'warning',
          title: 'Sorteio Iniciando',
          message: `O sorteio começará em ${data.countdown} segundos!`,
        })
      })

      socketInstance.on('draw_result', (result: any) => {
        addNotification({
          type: result.isWinner ? 'success' : 'info',
          title: result.isWinner ? '🎉 Parabéns!' : 'Resultado do Sorteio',
          message: result.isWinner 
            ? `Você ganhou ${result.prizeAmount} Chronos!`
            : `O vencedor foi ${result.winnerName}`,
        })
      })

      // Chat events
      socketInstance.on('chat_message', (message: any) => {
        // Handle chat messages if needed
        console.log('Chat message received:', message)
      })

      // Error events
      socketInstance.on('error', (error: any) => {
        console.error('Socket error:', error)
        addNotification({
          type: 'error',
          title: 'Erro',
          message: error.message || 'Ocorreu um erro inesperado',
        })
      })

      setSocket(socketInstance)

      return () => {
        socketInstance.disconnect()
        setSocket(null)
        setIsConnected(false)
        setConnected(false)
      }
    }
  }, [session?.user])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
