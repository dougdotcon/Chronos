'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [step, setStep] = useState<'request' | 'reset' | 'success'>(token ? 'reset' : 'request')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao solicitar reset de senha')
      }

      setStep('success')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao redefinir senha')
      }

      setStep('success')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="reset-success-card">
          <CardHeader className="text-center">
            <div className="reset-success-icon">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            </div>
            <CardTitle className="reset-success-title">
              {token ? 'Senha Redefinida!' : 'Email Enviado!'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center">
            {token ? (
              <div className="reset-success-content">
                <p className="reset-success-message">
                  Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
                </p>
                
                <Button 
                  onClick={() => router.push('/auth/signin')}
                  className="reset-success-button"
                >
                  Fazer Login
                </Button>
              </div>
            ) : (
              <div className="reset-success-content">
                <p className="reset-success-message">
                  Enviamos um link para redefinir sua senha para <strong>{email}</strong>. 
                  Verifique sua caixa de entrada e spam.
                </p>
                
                <div className="reset-success-actions">
                  <Button 
                    variant="outline"
                    onClick={() => setStep('request')}
                    className="reset-back-button"
                  >
                    Enviar Novamente
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/auth/signin')}
                    className="reset-login-button"
                  >
                    Voltar ao Login
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="reset-password-card">
        <CardHeader>
          <div className="reset-header">
            <Link href="/auth/signin" className="reset-back-link">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Login
            </Link>
          </div>
          
          <CardTitle className="reset-title">
            {step === 'request' ? 'Esqueceu sua senha?' : 'Nova Senha'}
          </CardTitle>
          
          <p className="reset-description">
            {step === 'request' 
              ? 'Digite seu email para receber um link de redefinição de senha.'
              : 'Digite sua nova senha abaixo.'
            }
          </p>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="reset-error-alert">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="reset-request-form">
              <div className="reset-form-group">
                <label htmlFor="email" className="reset-form-label">
                  Email
                </label>
                <div className="reset-input-wrapper">
                  <Mail className="reset-input-icon" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="reset-form-input"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="reset-submit-button"
              >
                {isLoading ? 'Enviando...' : 'Enviar Link de Reset'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="reset-password-form">
              <div className="reset-form-group">
                <label htmlFor="password" className="reset-form-label">
                  Nova Senha
                </label>
                <div className="reset-input-wrapper">
                  <Lock className="reset-input-icon" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                    required
                    className="reset-form-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="reset-password-toggle"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="reset-form-group">
                <label htmlFor="confirmPassword" className="reset-form-label">
                  Confirmar Nova Senha
                </label>
                <div className="reset-input-wrapper">
                  <Lock className="reset-input-icon" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    required
                    className="reset-form-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="reset-password-toggle"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="reset-password-requirements">
                <p className="reset-requirements-title">Sua senha deve ter:</p>
                <ul className="reset-requirements-list">
                  <li className={password.length >= 8 ? 'valid' : ''}>
                    Pelo menos 8 caracteres
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'valid' : ''}>
                    Uma letra maiúscula
                  </li>
                  <li className={/[a-z]/.test(password) ? 'valid' : ''}>
                    Uma letra minúscula
                  </li>
                  <li className={/\d/.test(password) ? 'valid' : ''}>
                    Um número
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="reset-submit-button"
              >
                {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
