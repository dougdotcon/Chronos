import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar sorteio e usuário em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Buscar sorteio
      const sweepstake = await tx.sweepstake.findUnique({
        where: { id: params.id },
        include: {
          participants: {
            where: { userId: session.user.id }
          },
          _count: {
            select: {
              participants: true
            }
          }
        }
      })

      if (!sweepstake) {
        throw new Error('Sorteio não encontrado')
      }

      // Verificações de elegibilidade
      if (sweepstake.status !== 'ACTIVE' && sweepstake.status !== 'SCHEDULED') {
        throw new Error('Este sorteio não está mais aceitando participantes')
      }

      if (sweepstake.participants.length > 0) {
        throw new Error('Você já está participando deste sorteio')
      }

      if (sweepstake._count.participants >= sweepstake.maxParticipants) {
        throw new Error('Este sorteio já atingiu o número máximo de participantes')
      }

      const now = new Date()
      if (now > sweepstake.endTime) {
        throw new Error('Este sorteio já expirou')
      }

      // Buscar usuário
      const user = await tx.user.findUnique({
        where: { id: session.user.id }
      })

      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      // Verificar saldo
      if (user.chronosBalance < sweepstake.entryFee) {
        throw new Error(`Saldo insuficiente. Você precisa de ${sweepstake.entryFee} Chronos`)
      }

      // Debitar saldo do usuário
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          chronosBalance: {
            decrement: sweepstake.entryFee
          }
        }
      })

      // Criar participação
      const participation = await tx.sweepstakeParticipant.create({
        data: {
          sweepstakeId: sweepstake.id,
          userId: session.user.id,
          entryFee: sweepstake.entryFee
        }
      })

      // Criar transação financeira
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: 'SWEEPSTAKE_ENTRY',
          amount: -sweepstake.entryFee,
          status: 'COMPLETED',
          description: `Entrada no sorteio: ${sweepstake.title}`,
          sweepstakeId: sweepstake.id
        }
      })

      // Verificar se o sorteio deve ser ativado
      const newParticipantCount = sweepstake._count.participants + 1
      let updatedSweepstake = sweepstake

      if (sweepstake.status === 'SCHEDULED' && newParticipantCount >= 2) {
        updatedSweepstake = await tx.sweepstake.update({
          where: { id: sweepstake.id },
          data: {
            status: 'ACTIVE'
          }
        })
      }

      // Verificar se o sorteio deve ser finalizado (lotado)
      if (newParticipantCount >= sweepstake.maxParticipants) {
        // Agendar execução do sorteio
        await tx.sweepstake.update({
          where: { id: sweepstake.id },
          data: {
            status: 'DRAWING',
            endTime: new Date() // Finalizar imediatamente
          }
        })
      }

      return {
        participation,
        sweepstake: updatedSweepstake,
        newParticipantCount
      }
    })

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'SWEEPSTAKE_JOINED',
        details: {
          sweepstakeId: params.id,
          entryFee: result.sweepstake.entryFee,
          participantCount: result.newParticipantCount
        }
      }
    })

    // Se o sorteio ficou lotado, executar o sorteio
    if (result.newParticipantCount >= result.sweepstake.maxParticipants) {
      // TODO: Implementar execução automática do sorteio
      console.log('Sorteio lotado - executar algoritmo de sorteio')
    }

    return NextResponse.json({
      message: 'Participação confirmada com sucesso!',
      participation: {
        id: result.participation.id,
        sweepstakeId: result.participation.sweepstakeId,
        entryFee: result.participation.entryFee,
        joinedAt: result.participation.createdAt
      },
      sweepstakeStatus: result.newParticipantCount >= result.sweepstake.maxParticipants ? 'DRAWING' : 'ACTIVE'
    })

  } catch (error: any) {
    console.error('Erro ao participar do sorteio:', error)
    
    // Retornar erro específico se for uma validação
    if (error.message.includes('não encontrado') || 
        error.message.includes('não está mais aceitando') ||
        error.message.includes('já está participando') ||
        error.message.includes('já atingiu') ||
        error.message.includes('já expirou') ||
        error.message.includes('Saldo insuficiente')) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
