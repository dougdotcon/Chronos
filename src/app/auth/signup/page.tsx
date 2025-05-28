'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Eye, EyeOff, Mail, Lock, User, CreditCard, ArrowLeft } from 'lucide-react'
import { validateEmail, validateCPF, formatCPF } from '@/lib/utils'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: dados pessoais, 2: senha
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    if (field === 'cpf') {
      // Formatar CPF automaticamente
      const numericValue = value.replace(/\D/g, '')
      if (numericValue.length <= 11) {
        setFormData(prev => ({
          ...prev,
          [field]: formatCPF(numericValue)
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Nome é obrigatório')
      return false
    }
    if (!validateEmail(formData.email)) {
      setError('Email inválido')
      return false
    }
    if (!validateCPF(formData.cpf)) {
      setError('CPF inválido')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem')
      return false
    }
    return true
  }

  const handleNextStep = () => {
    setError('')
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!validateStep2()) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf.replace(/\D/g, ''),
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta')
      }

      // Redirecionar para página de verificação de email
      router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email))
    } catch (error: any) {
      setError(error.message)
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

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="auth-progress"
        >
          <div className="auth-progress-bar">
            <div 
              className="auth-progress-fill"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
          <div className="auth-progress-steps">
            <span className={step >= 1 ? 'active' : ''}>1. Dados Pessoais</span>
            <span className={step >= 2 ? 'active' : ''}>2. Senha</span>
          </div>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="auth-card-container"
        >
          <Card className="auth-card">
            <CardHeader className="auth-card-header">
              <CardTitle className="auth-card-title">
                {step === 1 ? 'Criar sua conta' : 'Definir senha'}
              </CardTitle>
              <CardDescription className="auth-card-description">
                {step === 1 
                  ? 'Preencha seus dados para começar'
                  : 'Crie uma senha segura para sua conta'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="auth-card-content">
              {step === 1 ? (
                <div className="auth-form">
                  {/* Nome */}
                  <div className="auth-field">
                    <Label htmlFor="name" className="auth-label">
                      Nome Completo
                    </Label>
                    <div className="auth-input-container">
                      <User className="auth-input-icon" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="auth-input"
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="auth-input"
                      />
                    </div>
                  </div>

                  {/* CPF */}
                  <div className="auth-field">
                    <Label htmlFor="cpf" className="auth-label">
                      CPF
                    </Label>
                    <div className="auth-input-container">
                      <CreditCard className="auth-input-icon" />
                      <Input
                        id="cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange('cpf', e.target.value)}
                        className="auth-input"
                        maxLength={14}
                      />
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

                  {/* Next Button */}
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="auth-submit-button"
                  >
                    Continuar
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="auth-form">
                  {/* Password */}
                  <div className="auth-field">
                    <Label htmlFor="password" className="auth-label">
                      Senha
                    </Label>
                    <div className="auth-input-container">
                      <Lock className="auth-input-icon" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
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

                  {/* Confirm Password */}
                  <div className="auth-field">
                    <Label htmlFor="confirmPassword" className="auth-label">
                      Confirmar Senha
                    </Label>
                    <div className="auth-input-container">
                      <Lock className="auth-input-icon" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirme sua senha"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="auth-input"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="auth-password-toggle"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
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

                  {/* Buttons */}
                  <div className="auth-form-buttons">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="auth-back-button"
                      disabled={isLoading}
                    >
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      className="auth-submit-button"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Criando conta...
                        </>
                      ) : (
                        'Criar conta'
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* Sign In Link */}
              <div className="auth-signup-link">
                <span>Já tem uma conta? </span>
                <Link href="/auth/signin" className="auth-link">
                  Entrar
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
