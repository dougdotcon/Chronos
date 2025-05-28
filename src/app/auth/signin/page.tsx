'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { validateEmail } from '@/lib/utils'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validações
    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      setIsLoading(false)
      return
    }

    if (!validateEmail(email)) {
      setError('Por favor, insira um email válido')
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        // Verificar se o login foi bem-sucedido
        const session = await getSession()
        if (session) {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setError('Erro interno do servidor. Tente novamente.')
    } finally {
      setIsLoading(false)
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
          <Link href="/" className="auth-back-link">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
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

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="auth-card-container"
        >
          <Card className="auth-card">
            <CardHeader className="auth-card-header">
              <CardTitle className="auth-card-title">
                Entrar na sua conta
              </CardTitle>
              <CardDescription className="auth-card-description">
                Acesse sua conta e participe dos sorteios
              </CardDescription>
            </CardHeader>

            <CardContent className="auth-card-content">
              <form onSubmit={handleSubmit} className="auth-form">
                {/* Email Field */}
                <div className="auth-field">
                  <Label htmlFor="email" className="auth-label">
                    Email
                  </Label>
                  <div className="auth-input-container">
                    <Mail className="auth-input-icon" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="auth-field">
                  <Label htmlFor="password" className="auth-label">
                    Senha
                  </Label>
                  <div className="auth-input-container">
                    <Lock className="auth-input-icon" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-password-toggle"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="auth-error"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="auth-submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>

                {/* Forgot Password */}
                <div className="auth-forgot">
                  <Link href="/auth/forgot-password" className="auth-forgot-link">
                    Esqueceu sua senha?
                  </Link>
                </div>

                {/* Divider */}
                <div className="auth-divider">
                  <span>ou</span>
                </div>

                {/* Sign Up Link */}
                <div className="auth-signup-link">
                  <span>Não tem uma conta? </span>
                  <Link href="/auth/signup" className="auth-link">
                    Cadastre-se
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="auth-demo"
        >
          <div className="auth-demo-card">
            <h3>Credenciais Demo</h3>
            <p>Email: demo@chronos.com</p>
            <p>Senha: 123456</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
