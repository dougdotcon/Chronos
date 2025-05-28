import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { validateEmail, validateCPF, generateSecureRandomString } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { name, email, cpf, password } = await request.json()

    // Validações
    if (!name || !email || !cpf || !password) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: 'Email inválido' },
        { status: 400 }
      )
    }

    if (!validateCPF(cpf)) {
      return NextResponse.json(
        { message: 'CPF inválido' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { cpf }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { message: 'Este email já está em uso' },
          { status: 409 }
        )
      }
      if (existingUser.cpf === cpf) {
        return NextResponse.json(
          { message: 'Este CPF já está cadastrado' },
          { status: 409 }
        )
      }
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Gerar código de referral único
    let referralCode = generateSecureRandomString(8)
    let referralExists = await prisma.user.findUnique({
      where: { referralCode }
    })

    // Garantir que o código seja único
    while (referralExists) {
      referralCode = generateSecureRandomString(8)
      referralExists = await prisma.user.findUnique({
        where: { referralCode }
      })
    }

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        cpf,
        password: hashedPassword,
        referralCode,
        chronosBalance: 100.00, // Bônus de boas-vindas
        isActive: true,
        isVerified: false, // Será verificado por email
      }
    })

    // Criar transação de bônus de boas-vindas
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'DEPOSIT',
        amount: 100.00,
        status: 'COMPLETED',
        description: 'Bônus de boas-vindas',
      }
    })

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_CREATED',
        details: {
          email: user.email,
          cpf: user.cpf,
          referralCode: user.referralCode,
        },
      }
    })

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'Conta criada com sucesso',
        user: userWithoutPassword
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
