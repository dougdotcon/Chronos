'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  User,
  Settings,
  LogOut,
  Wallet,
  Menu,
  X
} from 'lucide-react'
import { useChronosStore } from '@/store/chronos-store'
import { formatCurrency } from '@/lib/utils'

export function Header() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const chronosBalance = useChronosStore((state) => state.chronosBalance)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="header">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Chronos Platform"
              width={40}
              height={40}
              className="logo"
            />
            <span className="logo-text">
              CHRONOS
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-menu">
          {session ? (
            <>
              <Link href="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link href="/sweepstakes" className="nav-link">
                Sorteios
              </Link>
              <Link href="/deposit" className="nav-link">
                Depósito
              </Link>
              <Link href="/withdraw" className="nav-link">
                Saque
              </Link>
              <Link href="/history" className="nav-link">
                Histórico
              </Link>
              <Link href="/audit" className="nav-link">
                Auditoria
              </Link>
            </>
          ) : (
            <>
              <Link href="/about" className="nav-link">
                Sobre
              </Link>
              <Link href="/how-it-works" className="nav-link">
                Como Funciona
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              {/* Chronos Balance */}
              <div className="hidden sm:flex items-center space-x-2 bg-chronos-gold/10 px-3 py-1 rounded-full">
                <Wallet className="h-4 w-4 text-chronos-gold" />
                <span className="text-sm font-semibold text-chronos-gold">
                  {formatCurrency(chronosBalance)} Chronos
                </span>
              </div>

              {/* Deposit Button */}
              <Button asChild className="btn-primary">
                <Link href="/deposit">
                  Depositar
                </Link>
              </Button>

              {/* Notifications */}
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    3
                  </Badge>
                </Link>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                      <AvatarFallback className="bg-chronos-gold text-chronos-charcoal">
                        {session.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="outline" className="btn-login">
                <Link href="/auth/signin">
                  Entrar
                </Link>
              </Button>
              <Button asChild className="btn-primary">
                <Link href="/auth/signup">
                  Cadastrar
                </Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-chronos-bronze/30 bg-white dark:bg-chronos-charcoal">
          <div className="container px-4 py-4 space-y-4">
            {session ? (
              <>
                <div className="flex items-center space-x-2 bg-chronos-gold/10 px-3 py-2 rounded-lg">
                  <Wallet className="h-4 w-4 text-chronos-gold" />
                  <span className="text-sm font-semibold text-chronos-gold">
                    {formatCurrency(chronosBalance)} Chronos
                  </span>
                </div>
                <Button asChild className="w-full chronos-button-primary">
                  <Link href="/deposit">Depositar</Link>
                </Button>
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="block py-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/sweepstakes"
                    className="block py-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sorteios
                  </Link>
                  <Link
                    href="/deposit"
                    className="block py-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Depósito
                  </Link>
                  <Link
                    href="/withdraw"
                    className="block py-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Saque
                  </Link>
                  <Link
                    href="/history"
                    className="block py-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Histórico
                  </Link>
                  <Link
                    href="/notifications"
                    className="block py-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Notificações
                  </Link>
                  <Link
                    href="/audit"
                    className="block py-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Auditoria
                  </Link>
                  <Link
                    href="/profile"
                    className="block py-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/about"
                  className="block py-2 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sobre
                </Link>
                <Link
                  href="/how-it-works"
                  className="block py-2 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Como Funciona
                </Link>
                <div className="pt-4 space-y-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/auth/signin">Entrar</Link>
                  </Button>
                  <Button asChild className="w-full chronos-button-primary">
                    <Link href="/auth/signup">Cadastrar</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
