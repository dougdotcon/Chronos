import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('123456', 12)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@chronos.com' },
    update: {},
    create: {
      email: 'demo@chronos.com',
      name: 'Demo User',
      cpf: '12345678901',
      password: hashedPassword,
      isVerified: true,
      chronosBalance: 1000.00,
      nickname: 'DemoPlayer',
      referralCode: 'DEMO2024',
    },
  })

  console.log('✅ Demo user created:', demoUser.email)

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@chronos.com' },
    update: {},
    create: {
      email: 'admin@chronos.com',
      name: 'Admin User',
      cpf: '98765432109',
      password: hashedPassword,
      isVerified: true,
      chronosBalance: 10000.00,
      nickname: 'ChronosAdmin',
      referralCode: 'ADMIN2024',
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create demo rooms
  const demoRoom = await prisma.room.create({
    data: {
      name: 'Sala Demo Gratuita',
      type: 'DEMO',
      betAmount: 0,
      maxParticipants: 10,
      minParticipants: 2,
      houseFee: 0,
      status: 'WAITING',
      totalPrize: 0,
    },
  })

  console.log('✅ Demo room created:', demoRoom.id)

  const individualRoom = await prisma.room.create({
    data: {
      name: 'Sorteio Individual R$ 1,50',
      type: 'INDIVIDUAL',
      betAmount: 1.50,
      maxParticipants: 20,
      minParticipants: 2,
      houseFee: 0.50,
      status: 'WAITING',
      totalPrize: 0,
    },
  })

  console.log('✅ Individual room created:', individualRoom.id)

  const x1Room = await prisma.room.create({
    data: {
      name: 'Duelo X1 R$ 4,50',
      type: 'X1',
      betAmount: 4.50,
      maxParticipants: 2,
      minParticipants: 2,
      houseFee: 0.50,
      status: 'WAITING',
      totalPrize: 0,
    },
  })

  console.log('✅ X1 room created:', x1Room.id)

  // Create sample transactions
  await prisma.transaction.create({
    data: {
      userId: demoUser.id,
      type: 'DEPOSIT',
      amount: 1000.00,
      status: 'COMPLETED',
      description: 'Depósito inicial de boas-vindas',
      gatewayType: 'STRIPE',
    },
  })

  await prisma.transaction.create({
    data: {
      userId: adminUser.id,
      type: 'DEPOSIT',
      amount: 10000.00,
      status: 'COMPLETED',
      description: 'Depósito administrativo',
      gatewayType: 'STRIPE',
    },
  })

  console.log('✅ Sample transactions created')

  // Create audit logs
  await prisma.auditLog.create({
    data: {
      userId: demoUser.id,
      action: 'USER_CREATED',
      details: {
        email: demoUser.email,
        source: 'seed',
      },
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'USER_CREATED',
      details: {
        email: adminUser.email,
        source: 'seed',
        role: 'admin',
      },
    },
  })

  console.log('✅ Audit logs created')

  console.log('🎉 Database seed completed successfully!')
  console.log('')
  console.log('Demo credentials:')
  console.log('Email: demo@chronos.com')
  console.log('Password: 123456')
  console.log('')
  console.log('Admin credentials:')
  console.log('Email: admin@chronos.com')
  console.log('Password: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
