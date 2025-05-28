'use client'

import { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

// Types
interface User {
  id: string
  email: string
  name: string
  cpf: string
  nickname?: string
  chronosBalance: number
  image?: string
}

interface Room {
  id: string
  name?: string
  type: 'DEMO' | 'INDIVIDUAL' | 'X1' | 'X1_GROUP' | 'MONTHLY_BATTLE'
  betAmount: number
  maxParticipants: number
  participants: number
  status: 'WAITING' | 'STARTING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  timeLeft?: number
  prizePool: number
}

interface Transaction {
  id: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'ROOM_ENTRY' | 'PRIZE_WIN' | 'TRANSFER_SENT' | 'TRANSFER_RECEIVED'
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  description?: string
  createdAt: Date
}

interface ChronosState {
  // User state
  user: User | null
  chronosBalance: number

  // Rooms state
  activeRooms: Room[]
  currentRoom: Room | null

  // Transactions state
  transactions: Transaction[]

  // UI state
  isLoading: boolean
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: Date
  }>

  // Socket state
  isConnected: boolean

  // Actions
  setUser: (user: User | null) => void
  updateChronosBalance: (balance: number) => void
  addTransaction: (transaction: Transaction) => void
  setActiveRooms: (rooms: Room[]) => void
  setCurrentRoom: (room: Room | null) => void
  joinRoom: (roomId: string) => void
  leaveRoom: () => void
  addNotification: (notification: Omit<ChronosState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  setLoading: (loading: boolean) => void
  setConnected: (connected: boolean) => void
}

type ChronosStore = ReturnType<typeof createChronosStore>

const createChronosStore = () =>
  createStore<ChronosState>()(
    subscribeWithSelector((set, get) => ({
        // Initial state
        user: null,
        chronosBalance: 0,
        activeRooms: [],
        currentRoom: null,
        transactions: [],
        isLoading: false,
        notifications: [],
        isConnected: false,

        // Actions
        setUser: (user) =>
          set((state) => ({
            ...state,
            user,
            chronosBalance: user ? user.chronosBalance : 0,
          })),

        updateChronosBalance: (balance) =>
          set((state) => ({
            ...state,
            chronosBalance: balance,
            user: state.user ? { ...state.user, chronosBalance: balance } : null,
          })),

        addTransaction: (transaction) =>
          set((state) => {
            const newTransactions = [transaction, ...state.transactions]
            return {
              ...state,
              transactions: newTransactions.slice(0, 100), // Keep only last 100
            }
          }),

        setActiveRooms: (rooms) =>
          set((state) => ({
            ...state,
            activeRooms: rooms,
          })),

        setCurrentRoom: (room) =>
          set((state) => ({
            ...state,
            currentRoom: room,
          })),

        joinRoom: (roomId) =>
          set((state) => {
            const room = state.activeRooms.find((r) => r.id === roomId)
            return {
              ...state,
              currentRoom: room || null,
            }
          }),

        leaveRoom: () =>
          set((state) => ({
            ...state,
            currentRoom: null,
          })),

        addNotification: (notification) =>
          set((state) => {
            const newNotification = {
              ...notification,
              id: Math.random().toString(36).substr(2, 9),
              timestamp: new Date(),
            }
            const newNotifications = [newNotification, ...state.notifications]
            return {
              ...state,
              notifications: newNotifications.slice(0, 10), // Keep only last 10
            }
          }),

        removeNotification: (id) =>
          set((state) => ({
            ...state,
            notifications: state.notifications.filter((n) => n.id !== id),
          })),

        setLoading: (loading) =>
          set((state) => ({
            ...state,
            isLoading: loading,
          })),

        setConnected: (connected) =>
          set((state) => ({
            ...state,
            isConnected: connected,
          })),
      }))
    )

const ChronosStoreContext = createContext<ChronosStore | null>(null)

export function ChronosStoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ChronosStore>()
  if (!storeRef.current) {
    storeRef.current = createChronosStore()
  }

  return (
    <ChronosStoreContext.Provider value={storeRef.current}>
      {children}
    </ChronosStoreContext.Provider>
  )
}

export function useChronosStore<T>(selector: (state: ChronosState) => T): T {
  const store = useContext(ChronosStoreContext)
  if (!store) {
    throw new Error('useChronosStore must be used within ChronosStoreProvider')
  }
  return useStore(store, selector)
}
