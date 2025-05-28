import { prisma } from '@/lib/prisma'
import { SweepstakeAlgorithm } from '@/lib/sweepstake-algorithm'
import { websocketManager } from '@/lib/websocket-server'

export class SweepstakeAutomation {
  private static instance: SweepstakeAutomation
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private isRunning = false

  static getInstance(): SweepstakeAutomation {
    if (!SweepstakeAutomation.instance) {
      SweepstakeAutomation.instance = new SweepstakeAutomation()
    }
    return SweepstakeAutomation.instance
  }

  start() {
    if (this.isRunning) return
    
    this.isRunning = true
    console.log('🤖 Sistema de automação de sorteios iniciado')
    
    // Verificar sorteios a cada 30 segundos
    this.schedulePeriodicCheck()
    
    // Verificar sorteios existentes
    this.checkExistingSweepstakes()
  }

  stop() {
    this.isRunning = false
    
    // Limpar todos os intervalos
    this.intervals.forEach(interval => clearTimeout(interval))
    this.intervals.clear()
    
    console.log('🛑 Sistema de automação de sorteios parado')
  }

  private schedulePeriodicCheck() {
    if (!this.isRunning) return

    setTimeout(async () => {
      await this.checkActiveSweepstakes()
      this.schedulePeriodicCheck() // Reagendar
    }, 30000) // 30 segundos
  }

  private async checkExistingSweepstakes() {
    try {
      const activeSweepstakes = await prisma.sweepstake.findMany({
        where: {
          status: {
            in: ['SCHEDULED', 'ACTIVE']
          }
        },
        include: {
          participants: true
        }
      })

      for (const sweepstake of activeSweepstakes) {
        this.scheduleSweepstakeExecution(sweepstake)
      }

      console.log(`📋 ${activeSweepstakes.length} sorteios ativos encontrados`)
    } catch (error) {
      console.error('Erro ao verificar sorteios existentes:', error)
    }
  }

  private async checkActiveSweepstakes() {
    try {
      const now = new Date()
      
      // Buscar sorteios que devem ser executados
      const sweepstakesToExecute = await prisma.sweepstake.findMany({
        where: {
          OR: [
            // Sorteios que expiraram
            {
              status: 'ACTIVE',
              endTime: {
                lte: now
              }
            },
            // Sorteios que ficaram lotados
            {
              status: 'DRAWING'
            }
          ]
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      })

      for (const sweepstake of sweepstakesToExecute) {
        await this.executeSweepstake(sweepstake)
      }

      // Buscar sorteios que devem ser ativados
      const sweepstakesToActivate = await prisma.sweepstake.findMany({
        where: {
          status: 'SCHEDULED',
          startTime: {
            lte: now
          }
        },
        include: {
          participants: true
        }
      })

      for (const sweepstake of sweepstakesToActivate) {
        if (sweepstake.participants.length >= 2) {
          await this.activateSweepstake(sweepstake)
        }
      }

    } catch (error) {
      console.error('Erro ao verificar sorteios ativos:', error)
    }
  }

  private scheduleSweepstakeExecution(sweepstake: any) {
    const now = new Date()
    const timeUntilEnd = sweepstake.endTime.getTime() - now.getTime()

    if (timeUntilEnd <= 0) {
      // Executar imediatamente
      this.executeSweepstake(sweepstake)
      return
    }

    // Agendar execução
    const timeoutId = setTimeout(() => {
      this.executeSweepstake(sweepstake)
    }, timeUntilEnd)

    this.intervals.set(sweepstake.id, timeoutId)
    
    console.log(`⏰ Sorteio ${sweepstake.id} agendado para execução em ${Math.round(timeUntilEnd / 1000)}s`)
  }

  private async activateSweepstake(sweepstake: any) {
    try {
      await prisma.sweepstake.update({
        where: { id: sweepstake.id },
        data: { status: 'ACTIVE' }
      })

      // Notificar via WebSocket
      websocketManager.broadcastSweepstakeUpdate({
        sweepstakeId: sweepstake.id,
        participants: sweepstake.participants.length,
        timeLeft: Math.max(0, Math.floor((sweepstake.endTime.getTime() - Date.now()) / 1000)),
        status: 'ACTIVE'
      })

      websocketManager.broadcastSystemMessage(
        sweepstake.id,
        '🚀 Sorteio ativado! Boa sorte a todos!'
      )

      console.log(`✅ Sorteio ${sweepstake.id} ativado automaticamente`)
    } catch (error) {
      console.error(`Erro ao ativar sorteio ${sweepstake.id}:`, error)
    }
  }

  private async executeSweepstake(sweepstake: any) {
    try {
      // Verificar se já foi executado
      if (sweepstake.winnerId) {
        console.log(`⚠️ Sorteio ${sweepstake.id} já foi executado`)
        return
      }

      // Verificar se tem participantes suficientes
      if (sweepstake.participants.length === 0) {
        await this.cancelSweepstake(sweepstake, 'Nenhum participante')
        return
      }

      console.log(`🎲 Executando sorteio ${sweepstake.id} com ${sweepstake.participants.length} participantes`)

      // Executar algoritmo de sorteio
      const participantsData = sweepstake.participants.map((p: any) => ({
        id: p.id,
        userId: p.userId,
        entryFee: p.entryFee,
        createdAt: p.createdAt
      }))

      const drawResult = await SweepstakeAlgorithm.executeDraw(
        sweepstake.id,
        participantsData
      )

      // Encontrar vencedor
      const winnerParticipant = sweepstake.participants.find(
        (p: any) => p.id === drawResult.winnerId
      )

      if (!winnerParticipant) {
        throw new Error('Vencedor não encontrado')
      }

      // Atualizar banco de dados em transação
      await prisma.$transaction(async (tx) => {
        // Atualizar sorteio
        await tx.sweepstake.update({
          where: { id: sweepstake.id },
          data: {
            status: 'FINISHED',
            winnerId: winnerParticipant.userId,
            winnerParticipantId: winnerParticipant.id,
            executedAt: new Date(),
            algorithm: drawResult.algorithm,
            seed: drawResult.seed,
            hash: drawResult.hash,
            proof: drawResult.proof
          }
        })

        // Creditar prêmio
        await tx.user.update({
          where: { id: winnerParticipant.userId },
          data: {
            chronosBalance: {
              increment: sweepstake.prizePool
            }
          }
        })

        // Criar transação de prêmio
        await tx.transaction.create({
          data: {
            userId: winnerParticipant.userId,
            type: 'PRIZE_WIN',
            amount: sweepstake.prizePool,
            status: 'COMPLETED',
            description: `Prêmio do sorteio: ${sweepstake.title}`,
            sweepstakeId: sweepstake.id
          }
        })

        // Log de auditoria
        await tx.auditLog.create({
          data: {
            userId: 'SYSTEM',
            action: 'SWEEPSTAKE_AUTO_EXECUTED',
            details: {
              sweepstakeId: sweepstake.id,
              winnerId: winnerParticipant.userId,
              prizeAmount: sweepstake.prizePool,
              participantCount: sweepstake.participants.length,
              algorithm: drawResult.algorithm,
              executionType: 'AUTOMATIC'
            }
          }
        })
      })

      // Notificar via WebSocket
      websocketManager.broadcastSweepstakeResult(sweepstake.id, {
        name: winnerParticipant.user.name,
        prize: sweepstake.prizePool
      })

      // Limpar agendamento
      const timeoutId = this.intervals.get(sweepstake.id)
      if (timeoutId) {
        clearTimeout(timeoutId)
        this.intervals.delete(sweepstake.id)
      }

      console.log(`🎉 Sorteio ${sweepstake.id} executado! Vencedor: ${winnerParticipant.user.name}`)

    } catch (error) {
      console.error(`Erro ao executar sorteio ${sweepstake.id}:`, error)
      
      // Tentar novamente em 1 minuto
      setTimeout(() => {
        this.executeSweepstake(sweepstake)
      }, 60000)
    }
  }

  private async cancelSweepstake(sweepstake: any, reason: string) {
    try {
      await prisma.sweepstake.update({
        where: { id: sweepstake.id },
        data: {
          status: 'CANCELLED',
          cancelReason: reason
        }
      })

      websocketManager.broadcastSystemMessage(
        sweepstake.id,
        `❌ Sorteio cancelado: ${reason}`
      )

      console.log(`❌ Sorteio ${sweepstake.id} cancelado: ${reason}`)
    } catch (error) {
      console.error(`Erro ao cancelar sorteio ${sweepstake.id}:`, error)
    }
  }

  // Método para agendar novo sorteio
  scheduleSweepstake(sweepstakeId: string) {
    prisma.sweepstake.findUnique({
      where: { id: sweepstakeId },
      include: { participants: true }
    }).then(sweepstake => {
      if (sweepstake) {
        this.scheduleSweepstakeExecution(sweepstake)
      }
    }).catch(error => {
      console.error('Erro ao agendar sorteio:', error)
    })
  }
}

// Instância singleton
export const sweepstakeAutomation = SweepstakeAutomation.getInstance()
