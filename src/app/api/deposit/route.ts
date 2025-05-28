import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSecureRandomString } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { method, amount, feeAmount, totalAmount } = await request.json()

    // Validações
    if (!method || !amount || amount <= 0) {
      return NextResponse.json(
        { message: 'Dados inválidos' },
        { status: 400 }
      )
    }

    // Validar método de pagamento
    const validMethods = ['pix', 'credit_card', 'bank_transfer']
    if (!validMethods.includes(method)) {
      return NextResponse.json(
        { message: 'Método de pagamento inválido' },
        { status: 400 }
      )
    }

    // Validar limites por método
    const limits = {
      pix: { min: 10, max: 5000 },
      credit_card: { min: 20, max: 2000 },
      bank_transfer: { min: 50, max: 10000 }
    }

    const methodLimits = limits[method as keyof typeof limits]
    if (amount < methodLimits.min || amount > methodLimits.max) {
      return NextResponse.json(
        { message: `Valor deve estar entre R$ ${methodLimits.min} e R$ ${methodLimits.max}` },
        { status: 400 }
      )
    }

    // Gerar ID único para a transação
    const transactionId = generateSecureRandomString(16)

    // Criar transação de depósito
    const deposit = await prisma.transaction.create({
      data: {
        id: transactionId,
        userId: session.user.id,
        type: 'DEPOSIT',
        amount: amount,
        status: 'PENDING',
        description: `Depósito via ${method.toUpperCase()}`,
        paymentMethod: method.toUpperCase(),
        feeAmount: feeAmount || 0,
        totalAmount: totalAmount || amount,
        metadata: {
          method,
          originalAmount: amount,
          feeAmount: feeAmount || 0,
          totalAmount: totalAmount || amount,
          timestamp: new Date().toISOString()
        }
      }
    })

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DEPOSIT_INITIATED',
        details: {
          transactionId: deposit.id,
          method,
          amount,
          feeAmount: feeAmount || 0,
          totalAmount: totalAmount || amount
        }
      }
    })

    // Simular processamento baseado no método
    let response: any = {
      transactionId: deposit.id,
      status: 'pending',
      method,
      amount,
      message: 'Depósito iniciado com sucesso'
    }

    switch (method) {
      case 'pix':
        // Simular geração de QR Code PIX
        response = {
          ...response,
          pixCode: `00020126580014BR.GOV.BCB.PIX0136${transactionId}5204000053039865802BR5925CHRONOS PLATFORM LTDA6009SAO PAULO62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          qrCodeUrl: `/api/deposit/${deposit.id}/qr`,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
          instructions: [
            'Abra o app do seu banco',
            'Escaneie o QR Code ou copie o código PIX',
            'Confirme o pagamento',
            'O saldo será creditado automaticamente'
          ]
        }
        break

      case 'credit_card':
        // Simular redirecionamento para gateway de pagamento
        response = {
          ...response,
          paymentUrl: `/payment/credit-card/${deposit.id}`,
          redirectRequired: true,
          instructions: [
            'Você será redirecionado para o gateway de pagamento',
            'Insira os dados do seu cartão',
            'Confirme o pagamento',
            'Retorne para a plataforma'
          ]
        }
        break

      case 'bank_transfer':
        // Simular dados bancários para transferência
        response = {
          ...response,
          bankData: {
            bank: 'Banco Chronos',
            agency: '0001',
            account: '123456-7',
            accountHolder: 'Chronos Platform Ltda',
            cnpj: '12.345.678/0001-90'
          },
          reference: deposit.id,
          instructions: [
            'Faça uma transferência TED/DOC para os dados bancários fornecidos',
            'Use o ID da transação como referência',
            'O processamento pode levar até 2 dias úteis',
            'Envie o comprovante para acelerar o processo'
          ]
        }
        break
    }

    // Para PIX e cartão, simular processamento automático após alguns segundos
    if (method === 'pix') {
      // Simular confirmação automática após 10 segundos (para demo)
      setTimeout(async () => {
        try {
          await prisma.transaction.update({
            where: { id: deposit.id },
            data: {
              status: 'COMPLETED',
              processedAt: new Date()
            }
          })

          // Creditar saldo do usuário
          await prisma.user.update({
            where: { id: session.user.id },
            data: {
              chronosBalance: {
                increment: amount
              }
            }
          })

          // Log de auditoria
          await prisma.auditLog.create({
            data: {
              userId: session.user.id,
              action: 'DEPOSIT_COMPLETED',
              details: {
                transactionId: deposit.id,
                amount,
                method: 'PIX_AUTO'
              }
            }
          })

          console.log(`Depósito ${deposit.id} processado automaticamente`)
        } catch (error) {
          console.error('Erro ao processar depósito automaticamente:', error)
        }
      }, 10000) // 10 segundos para demo
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Erro ao processar depósito:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Buscar histórico de depósitos do usuário
    const [deposits, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: session.user.id,
          type: 'DEPOSIT'
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.transaction.count({
        where: {
          userId: session.user.id,
          type: 'DEPOSIT'
        }
      })
    ])

    return NextResponse.json({
      deposits,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao buscar histórico de depósitos:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
