import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { validateCPF, validateEmail } from '@/lib/utils'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        if (!validateEmail(credentials.email)) {
          throw new Error('Email inválido')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          throw new Error('Usuário não encontrado')
        }

        if (!user.isActive) {
          throw new Error('Conta desativada. Entre em contato com o suporte.')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Senha incorreta')
        }

        if (!user.isVerified) {
          throw new Error('Email não verificado. Verifique sua caixa de entrada.')
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          image: user.image || undefined,
          cpf: user.cpf,
          nickname: user.nickname || undefined,
          chronosBalance: user.chronosBalance.toString(),
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.cpf = user.cpf
        token.nickname = user.nickname
        token.chronosBalance = user.chronosBalance
      }

      // Update token when session is updated
      if (trigger === 'update' && session) {
        token.name = session.name
        token.email = session.email
        token.image = session.image
        token.nickname = session.nickname
        token.chronosBalance = session.chronosBalance
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.cpf = token.cpf as string
        session.user.nickname = token.nickname as string
        session.user.chronosBalance = token.chronosBalance as string
      }

      return session
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log successful sign in
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_SIGNIN',
          details: {
            provider: account?.provider,
            isNewUser,
          },
        },
      })
    },
    async signOut({ token }) {
      // Log sign out
      if (token?.id) {
        await prisma.auditLog.create({
          data: {
            userId: token.id as string,
            action: 'USER_SIGNOUT',
            details: {},
          },
        })
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
}
