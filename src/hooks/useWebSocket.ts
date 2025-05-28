import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ChatMessage, SweepstakeUpdate } from '@/lib/websocket-server'

interface UseWebSocketProps {
  userId?: string
  onMessage?: (message: ChatMessage) => void
  onSweepstakeUpdate?: (update: SweepstakeUpdate) => void
  onSweepstakeFinished?: (result: any) => void
  onUserJoined?: (user: { userId: string, userName: string }) => void
  onUserLeft?: (user: { userId: string, userName: string }) => void
  onError?: (error: { message: string }) => void
}

export function useWebSocket({
  userId,
  onMessage,
  onSweepstakeUpdate,
  onSweepstakeFinished,
  onUserJoined,
  onUserLeft,
  onError
}: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const currentSweepstakeRef = useRef<string | null>(null)

  // Inicializar conexão
  useEffect(() => {
    if (!userId) return

    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling']
    })

    socketRef.current = socket

    // Eventos de conexão
    socket.on('connect', () => {
      console.log('WebSocket conectado')
      setIsConnected(true)
      
      // Autenticar usuário
      socket.emit('authenticate', userId)
    })

    socket.on('disconnect', () => {
      console.log('WebSocket desconectado')
      setIsConnected(false)
      setIsAuthenticated(false)
    })

    socket.on('authenticated', (data: { success: boolean, error?: string }) => {
      if (data.success) {
        console.log('WebSocket autenticado')
        setIsAuthenticated(true)
      } else {
        console.error('Erro na autenticação:', data.error)
        onError?.({ message: data.error || 'Erro na autenticação' })
      }
    })

    // Eventos de mensagens
    socket.on('new-message', (message: ChatMessage) => {
      console.log('Nova mensagem recebida:', message)
      onMessage?.(message)
    })

    // Eventos de sorteio
    socket.on('sweepstake-update', (update: SweepstakeUpdate) => {
      console.log('Atualização do sorteio:', update)
      onSweepstakeUpdate?.(update)
    })

    socket.on('sweepstake-state', (state: any) => {
      console.log('Estado do sorteio:', state)
      onSweepstakeUpdate?.(state)
    })

    socket.on('sweepstake-finished', (result: any) => {
      console.log('Sorteio finalizado:', result)
      onSweepstakeFinished?.(result)
    })

    // Eventos de usuários
    socket.on('user-joined-room', (user: { userId: string, userName: string }) => {
      console.log('Usuário entrou na sala:', user)
      onUserJoined?.(user)
    })

    socket.on('user-left-room', (user: { userId: string, userName: string }) => {
      console.log('Usuário saiu da sala:', user)
      onUserLeft?.(user)
    })

    socket.on('user-disconnected', (user: { userId: string, userName: string }) => {
      console.log('Usuário desconectou:', user)
      onUserLeft?.(user)
    })

    // Eventos de erro
    socket.on('error', (error: { message: string }) => {
      console.error('Erro do WebSocket:', error)
      onError?.(error)
    })

    return () => {
      socket.disconnect()
    }
  }, [userId, onMessage, onSweepstakeUpdate, onSweepstakeFinished, onUserJoined, onUserLeft, onError])

  // Entrar em sala de sorteio
  const joinSweepstake = (sweepstakeId: string) => {
    if (socketRef.current && isAuthenticated) {
      // Sair da sala anterior se houver
      if (currentSweepstakeRef.current) {
        socketRef.current.emit('leave-sweepstake', currentSweepstakeRef.current)
      }
      
      // Entrar na nova sala
      socketRef.current.emit('join-sweepstake', sweepstakeId)
      currentSweepstakeRef.current = sweepstakeId
      console.log('Entrando na sala:', sweepstakeId)
    }
  }

  // Sair da sala de sorteio
  const leaveSweepstake = () => {
    if (socketRef.current && currentSweepstakeRef.current) {
      socketRef.current.emit('leave-sweepstake', currentSweepstakeRef.current)
      currentSweepstakeRef.current = null
      console.log('Saindo da sala')
    }
  }

  // Enviar mensagem
  const sendMessage = (message: string) => {
    if (socketRef.current && isAuthenticated && currentSweepstakeRef.current) {
      socketRef.current.emit('send-message', {
        sweepstakeId: currentSweepstakeRef.current,
        message
      })
      console.log('Enviando mensagem:', message)
      return true
    }
    return false
  }

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (currentSweepstakeRef.current) {
        leaveSweepstake()
      }
    }
  }, [])

  return {
    isConnected,
    isAuthenticated,
    joinSweepstake,
    leaveSweepstake,
    sendMessage,
    currentSweepstake: currentSweepstakeRef.current
  }
}
