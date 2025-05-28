import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      cpf: string
      nickname?: string
      chronosBalance: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    cpf: string
    nickname?: string
    chronosBalance: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    cpf: string
    nickname?: string
    chronosBalance: string
  }
}
