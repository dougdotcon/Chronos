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

    // Executar em transação
    const result = await prisma.$transaction(async (tx) => {
      // Buscar sorteio e participação
      const sweepstake = await tx.sweepstake.findUnique({
        where: { id: params.id },
        include: {
          participants: {
            where: { userId: session.user.id }
          }
        }
      })

      if (!sweepstake) {
        throw new Error('Sorteio não encontrado')
      }

      // Verificar se o usuário está participando
      if (sweepstake.participants.length === 0) {
        throw new Error('Você não está participando deste sorteio')
      }

      // Verificar se pode sair (apenas se o sorteio ainda não começou o processo de sorteio)
      if (sweepstake.status === 'DRAWING' || sweepstake.status === 'FINISHED') {
        throw new Error('Não é possível sair de um sorteio que já está sendo executado ou finalizado')
      }

      // Verificar tempo limite para sair (ex: não pode sair nos últimos 5 minutos)
      const now = new Date()
      const timeUntilEnd = sweepstake.endTime.getTime() - now.getTime()
      const fiveMinutesInMs = 5 * 60 * 1000

      if (timeUntilEnd < fiveMinutesInMs && timeUntilEnd > 0) {
        throw new Error('Não é possível sair do sorteio nos últimos 5 minutos')
      }

      const participation = sweepstake.participants[0]

      // Remover participação
      await tx.sweepstakeParticipant.delete({
        where: { id: participation.id }
      })

      // Reembolsar o usuário
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          chronosBalance: {
            increment: participation.entryFee
          }
        }
      })

      // Criar transação de reembolso
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: 'SWEEPSTAKE_REFUND',
          amount: participation.entryFee,
          status: 'COMPLETED',
          description: `Reembolso do sorteio: ${sweepstake.title}`,
          sweepstakeId: sweepstake.id
        }
      })

      // Verificar se o sorteio deve voltar para SCHEDULED (se ficar com menos de 2 participantes)
      const remainingParticipants = await tx.sweepstakeParticipant.count({
        where: { sweepstakeId: sweepstake.id }
      })

      let updatedSweepstake = sweepstake
      if (remainingParticipants < 2 && sweepstake.status === 'ACTIVE') {
        updatedSweepstake = await tx.sweepstake.update({
          where: { id: sweepstake.id },
          data: {
            status: 'SCHEDULED'
          }
        })
      }

      return {
        participation,
        sweepstake: updatedSweepstake,
        remainingParticipants
      }
    })

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'SWEEPSTAKE_LEFT',
        details: {
          sweepstakeId: params.id,
          refundAmount: result.participation.entryFee,
          remainingParticipants: result.remainingParticipants
        }
      }
    })

    return NextResponse.json({
      message: 'Você saiu do sorteio e foi reembolsado com sucesso!',
      refundAmount: result.participation.entryFee,
      sweepstakeStatus: result.remainingParticipants < 2 ? 'SCHEDULED' : 'ACTIVE'
    })

  } catch (error: any) {
    console.error('Erro ao sair do sorteio:', error)
    
    // Retornar erro específico se for uma validação
    if (error.message.includes('não encontrado') || 
        error.message.includes('não está participando') ||
        error.message.includes('não é possível sair') ||
        error.message.includes('últimos 5 minutos')) {
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
