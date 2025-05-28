'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleResendEmail = async () => {
    if (!email) return

    setIsResending(true)
    setResendMessage('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setResendMessage('Email de verificação reenviado com sucesso!')
      } else {
        setResendMessage('Erro ao reenviar email. Tente novamente.')
      }
    } catch (error) {
      setResendMessage('Erro ao reenviar email. Tente novamente.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Background */}
      <div className="auth-background">
        <div className="hero-statue left-statue"></div>
        <div className="hero-statue right-statue"></div>
      </div>

      <div className="auth-container">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="auth-back"
        >
          <Link href="/auth/signin" className="auth-back-link">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao login
          </Link>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="auth-logo"
        >
          <Image
            src="/logo.png"
            alt="Chronos Platform"
            width={60}
            height={60}
            className="logo"
          />
          <h1 className="auth-logo-text">CHRONOS</h1>
        </motion.div>

        {/* Verification Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="auth-card-container"
        >
          <Card className="auth-card">
            <CardHeader className="auth-card-header text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mx-auto mb-4"
              >
                <div className="w-16 h-16 bg-chronos-gold/20 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-chronos-gold" />
                </div>
              </motion.div>
              
              <CardTitle className="auth-card-title">
                Verifique seu email
              </CardTitle>
              <CardDescription className="auth-card-description">
                Enviamos um link de verificação para
                <br />
                <strong className="text-chronos-gold">{email}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="auth-card-content">
              <div className="space-y-6 text-center">
                {/* Instructions */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 text-left">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-chronos-ivory/80">
                      Clique no link do email para ativar sua conta
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 text-left">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-chronos-ivory/80">
                      Verifique sua caixa de spam se não encontrar o email
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 text-left">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-chronos-ivory/80">
                      Após verificar, você poderá fazer login normalmente
                    </p>
                  </div>
                </div>

                {/* Resend Message */}
                {resendMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm p-3 rounded-lg ${
                      resendMessage.includes('sucesso')
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {resendMessage}
                  </motion.div>
                )}

                {/* Resend Button */}
                <div className="space-y-4">
                  <p className="text-sm text-chronos-ivory/60">
                    Não recebeu o email?
                  </p>
                  <Button
                    onClick={handleResendEmail}
                    disabled={isResending}
                    variant="outline"
                    className="w-full border-chronos-gold text-chronos-gold hover:bg-chronos-gold hover:text-chronos-charcoal"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Reenviando...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Reenviar email
                      </>
                    )}
                  </Button>
                </div>

                {/* Login Link */}
                <div className="pt-4 border-t border-chronos-bronze/30">
                  <p className="text-sm text-chronos-ivory/60 mb-3">
                    Já verificou seu email?
                  </p>
                  <Button asChild className="w-full chronos-button-gold">
                    <Link href="/auth/signin">
                      Fazer Login
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-chronos-ivory/50">
            Problemas com a verificação?{' '}
            <Link href="/support" className="text-chronos-gold hover:underline">
              Entre em contato
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
