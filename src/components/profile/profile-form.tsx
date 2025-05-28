'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User } from 'next-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  User as UserIcon, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Save,
  AlertTriangle
} from 'lucide-react'

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: '',
    birthDate: '',
    gender: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    bio: '',
    preferences: {
      newsletter: true,
      smsNotifications: false,
      emailNotifications: true
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido'
    }

    if (formData.address.zipCode && !/^\d{5}-?\d{3}$/.test(formData.address.zipCode)) {
      newErrors.zipCode = 'CEP inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Perfil atualizado:', formData)
      alert('Perfil atualizado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      alert('Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="profile-form-card">
        <CardHeader className="profile-form-header">
          <CardTitle className="profile-form-title">
            <UserIcon className="w-5 h-5 text-chronos-gold" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>

        <CardContent className="profile-form-content">
          <form onSubmit={handleSubmit} className="profile-form">
            {/* Basic Info */}
            <div className="form-section">
              <h4 className="form-section-title">Dados Básicos</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                    className="form-input"
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    className="form-input"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value)
                      setFormData(prev => ({ ...prev, phone: formatted }))
                    }}
                    placeholder="(11) 99999-9999"
                    className="form-input"
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <Label htmlFor="gender">Gênero</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefiro não informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="form-section">
              <h4 className="form-section-title">Endereço</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={formData.address.zipCode}
                    onChange={(e) => {
                      const formatted = formatZipCode(e.target.value)
                      setFormData(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, zipCode: formatted }
                      }))
                    }}
                    placeholder="00000-000"
                    className="form-input"
                  />
                  {errors.zipCode && <span className="form-error">{errors.zipCode}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="state">Estado</Label>
                  <Select 
                    value={formData.address.state} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, state: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="SC">Santa Catarina</SelectItem>
                      <SelectItem value="BA">Bahia</SelectItem>
                      <SelectItem value="GO">Goiás</SelectItem>
                      <SelectItem value="PE">Pernambuco</SelectItem>
                      <SelectItem value="CE">Ceará</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, street: e.target.value }
                    }))}
                    placeholder="Nome da rua"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={formData.address.number}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, number: e.target.value }
                    }))}
                    placeholder="123"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.address.complement}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, complement: e.target.value }
                    }))}
                    placeholder="Apto, bloco, etc."
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={formData.address.neighborhood}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, neighborhood: e.target.value }
                    }))}
                    placeholder="Nome do bairro"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    placeholder="Nome da cidade"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="form-section">
              <h4 className="form-section-title">Sobre Você</h4>
              
              <div className="form-group">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Conte um pouco sobre você..."
                  className="form-textarea"
                  rows={4}
                />
                <span className="form-helper">
                  {formData.bio.length}/500 caracteres
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="form-actions">
              <div className="form-warning">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span>
                  Algumas alterações podem exigir verificação adicional.
                </span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="profile-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
