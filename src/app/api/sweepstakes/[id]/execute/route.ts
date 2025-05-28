import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SweepstakeAlgorithm, SweepstakeAudit } from '@/lib/sweepstake-algorithm'

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

    // Executar sorteio em transação
    const result = await prisma.$transaction(async (tx) => {
      // Buscar sorteio com participantes
      const sweepstake = await tx.sweepstake.findUnique({
        where: { id: params.id },
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
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      })

      if (!sweepstake) {
        throw new Error('Sorteio não encontrado')
      }

      // Verificar se o sorteio pode ser executado
      if (sweepstake.status !== 'DRAWING' && sweepstake.status !== 'ACTIVE') {
        throw new Error('Este sorteio não pode ser executado no momento')
      }

      if (sweepstake.participants.length === 0) {
        throw new Error('Nenhum participante encontrado')
      }

      // Verificar se já foi executado
      if (sweepstake.winnerId) {
        throw new Error('Este sorteio já foi executado')
      }

      // Preparar dados dos participantes para o algoritmo
      const participantsData = sweepstake.participants.map(p => ({
        id: p.id,
        userId: p.userId,
        entryFee: p.entryFee,
        createdAt: p.createdAt
      }))

      // Executar algoritmo de sorteio
      const drawResult = await SweepstakeAlgorithm.executeDraw(
        sweepstake.id,
        participantsData
      )

      // Encontrar o vencedor
      const winnerParticipant = sweepstake.participants.find(
        p => p.id === drawResult.winnerId
      )

      if (!winnerParticipant) {
        throw new Error('Erro interno: vencedor não encontrado')
      }

      // Atualizar sorteio com resultado
      const updatedSweepstake = await tx.sweepstake.update({
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

      // Creditar prêmio ao vencedor
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

      // Criar transação de taxa da casa (5%)
      const houseFee = sweepstake.participants.length * sweepstake.entryFee * 0.05
      if (houseFee > 0) {
        await tx.transaction.create({
          data: {
            userId: 'SYSTEM',
            type: 'HOUSE_FEE',
            amount: houseFee,
            status: 'COMPLETED',
            description: `Taxa da casa - Sorteio: ${sweepstake.title}`,
            sweepstakeId: sweepstake.id
          }
        })
      }

      return {
        sweepstake: updatedSweepstake,
        winner: winnerParticipant,
        drawResult,
        houseFee
      }
    })

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'SWEEPSTAKE_EXECUTED',
        details: {
          sweepstakeId: params.id,
          winnerId: result.winner.userId,
          prizeAmount: result.sweepstake.prizePool,
          participantCount: result.sweepstake.participants?.length || 0,
          algorithm: result.drawResult.algorithm,
          hash: result.drawResult.hash
        }
      }
    })

    // Gerar relatório de auditoria
    const auditReport = SweepstakeAudit.generatePublicAuditReport(
      result.drawResult,
      params.id
    )

    // TODO: Enviar notificações para participantes
    // TODO: Publicar resultado em canal público

    return NextResponse.json({
      message: 'Sorteio executado com sucesso!',
      result: {
        sweepstakeId: result.sweepstake.id,
        winner: {
          userId: result.winner.userId,
          name: result.winner.user.name,
          prizeAmount: result.sweepstake.prizePool
        },
        execution: {
          algorithm: result.drawResult.algorithm,
          timestamp: result.drawResult.timestamp,
          hash: result.drawResult.hash,
          participantCount: result.drawResult.participants.length
        },
        audit: auditReport
      }
    })

  } catch (error: any) {
    console.error('Erro ao executar sorteio:', error)
    
    // Retornar erro específico se for uma validação
    if (error.message.includes('não encontrado') || 
        error.message.includes('não pode ser executado') ||
        error.message.includes('Nenhum participante') ||
        error.message.includes('já foi executado')) {
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
