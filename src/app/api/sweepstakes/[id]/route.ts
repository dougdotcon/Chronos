import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    const sweepstake = await prisma.sweepstake.findUnique({
      where: { id: params.id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        winner: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    if (!sweepstake) {
      return NextResponse.json(
        { message: 'Sorteio não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário está participando
    let isParticipating = false
    if (session) {
      isParticipating = sweepstake.participants.some(
        p => p.user.id === session.user.id
      )
    }

    // Calcular tempo restante
    const now = new Date()
    const timeLeft = Math.max(0, Math.floor((sweepstake.endTime.getTime() - now.getTime()) / 1000))

    // Verificar se pode participar
    const canParticipate = sweepstake.status === 'ACTIVE' && 
                          sweepstake.participants.length < sweepstake.maxParticipants &&
                          timeLeft > 0 &&
                          !isParticipating

    const response = {
      id: sweepstake.id,
      title: sweepstake.title,
      description: sweepstake.description,
      type: sweepstake.type,
      status: sweepstake.status,
      participants: sweepstake.participants.length,
      maxParticipants: sweepstake.maxParticipants,
      prizePool: sweepstake.prizePool,
      entryFee: sweepstake.entryFee,
      startTime: sweepstake.startTime,
      endTime: sweepstake.endTime,
      timeLeft,
      rules: sweepstake.rules,
      isParticipating,
      canParticipate,
      createdBy: sweepstake.createdBy,
      winner: sweepstake.winner,
      participantsList: sweepstake.participants.map(p => ({
        id: p.id,
        user: p.user,
        joinedAt: p.createdAt
      })),
      createdAt: sweepstake.createdAt
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar sorteio:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const sweepstake = await prisma.sweepstake.findUnique({
      where: { id: params.id },
      include: {
        participants: true
      }
    })

    if (!sweepstake) {
      return NextResponse.json(
        { message: 'Sorteio não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário pode cancelar o sorteio
    const canCancel = sweepstake.createdById === session.user.id &&
                     sweepstake.status === 'SCHEDULED' &&
                     sweepstake.participants.length === 0

    if (!canCancel) {
      return NextResponse.json(
        { message: 'Não é possível cancelar este sorteio' },
        { status: 403 }
      )
    }

    // Cancelar sorteio
    await prisma.sweepstake.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED'
      }
    })

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'SWEEPSTAKE_CANCELLED',
        details: {
          sweepstakeId: sweepstake.id,
          title: sweepstake.title
        }
      }
    })

    return NextResponse.json({
      message: 'Sorteio cancelado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao cancelar sorteio:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
