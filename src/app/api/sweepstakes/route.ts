import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const prizeRange = searchParams.get('prizeRange')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}

    if (category && category !== 'all') {
      where.type = category.toUpperCase()
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive'
      }
    }

    if (prizeRange) {
      const ranges = {
        low: { gte: 1, lte: 100 },
        medium: { gte: 100, lte: 1000 },
        high: { gte: 1000, lte: 10000 },
        premium: { gte: 10000 }
      }
      
      if (ranges[prizeRange as keyof typeof ranges]) {
        where.prizePool = ranges[prizeRange as keyof typeof ranges]
      }
    }

    // Buscar sorteios
    const [sweepstakes, total] = await Promise.all([
      prisma.sweepstake.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { status: 'asc' }, // Ativos primeiro
          { createdAt: 'desc' }
        ],
        include: {
          _count: {
            select: {
              participants: true
            }
          }
        }
      }),
      prisma.sweepstake.count({ where })
    ])

    // Formatar resposta
    const formattedSweepstakes = sweepstakes.map(sweepstake => ({
      id: sweepstake.id,
      title: sweepstake.title,
      type: sweepstake.type,
      status: sweepstake.status,
      participants: sweepstake._count.participants,
      maxParticipants: sweepstake.maxParticipants,
      prizePool: sweepstake.prizePool,
      entryFee: sweepstake.entryFee,
      startTime: sweepstake.startTime,
      endTime: sweepstake.endTime,
      createdAt: sweepstake.createdAt,
      isHot: sweepstake._count.participants > sweepstake.maxParticipants * 0.8
    }))

    return NextResponse.json({
      sweepstakes: formattedSweepstakes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao buscar sorteios:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const {
      title,
      description,
      type,
      maxParticipants,
      entryFee,
      duration // em minutos
    } = await request.json()

    // Validações
    if (!title || !type || !maxParticipants || entryFee === undefined) {
      return NextResponse.json(
        { message: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    if (maxParticipants < 2 || maxParticipants > 10000) {
      return NextResponse.json(
        { message: 'Número de participantes deve estar entre 2 e 10.000' },
        { status: 400 }
      )
    }

    if (entryFee < 0) {
      return NextResponse.json(
        { message: 'Taxa de entrada não pode ser negativa' },
        { status: 400 }
      )
    }

    // Calcular tempos
    const now = new Date()
    const startTime = new Date(now.getTime() + 2 * 60 * 1000) // Inicia em 2 minutos
    const endTime = new Date(startTime.getTime() + (duration || 60) * 60 * 1000)

    // Calcular prêmio total
    const prizePool = maxParticipants * entryFee * 0.95 // 5% de taxa da casa

    // Criar sorteio
    const sweepstake = await prisma.sweepstake.create({
      data: {
        title,
        description: description || `Sorteio ${type} criado por ${session.user.name}`,
        type: type.toUpperCase(),
        status: 'SCHEDULED',
        maxParticipants,
        entryFee,
        prizePool,
        startTime,
        endTime,
        createdById: session.user.id,
        rules: [
          'Cada participante pode comprar apenas 1 entrada',
          'O sorteio acontece automaticamente quando atingir o número máximo de participantes ou quando o tempo esgotar',
          'O vencedor é escolhido através de algoritmo criptográfico verificável',
          'Prêmios são creditados automaticamente na conta do vencedor'
        ]
      }
    })

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'SWEEPSTAKE_CREATED',
        details: {
          sweepstakeId: sweepstake.id,
          title: sweepstake.title,
          type: sweepstake.type,
          maxParticipants: sweepstake.maxParticipants,
          entryFee: sweepstake.entryFee,
          prizePool: sweepstake.prizePool
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'Sorteio criado com sucesso',
        sweepstake: {
          id: sweepstake.id,
          title: sweepstake.title,
          type: sweepstake.type,
          status: sweepstake.status
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erro ao criar sorteio:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
