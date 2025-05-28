'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Camera,
  User,
  CreditCard,
  Home,
  RefreshCw,
  Eye,
  X
} from 'lucide-react'

interface KYCDocument {
  type: 'identity' | 'address' | 'selfie'
  file: File | null
  status: 'pending' | 'uploaded' | 'verified' | 'rejected'
  rejectionReason?: string
}

interface KYCData {
  personalInfo: {
    fullName: string
    dateOfBirth: string
    cpf: string
    rg: string
    nationality: string
    occupation: string
  }
  address: {
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  documents: {
    identity: KYCDocument
    address: KYCDocument
    selfie: KYCDocument
  }
}

export function KYCVerification() {
  const [step, setStep] = useState<'info' | 'personal' | 'address' | 'documents' | 'review' | 'complete'>('info')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [kycData, setKycData] = useState<KYCData>({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      cpf: '',
      rg: '',
      nationality: 'Brasileira',
      occupation: ''
    },
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    documents: {
      identity: { type: 'identity', file: null, status: 'pending' },
      address: { type: 'address', file: null, status: 'pending' },
      selfie: { type: 'selfie', file: null, status: 'pending' }
    }
  })

  const handlePersonalInfoChange = (field: string, value: string) => {
    setKycData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setKycData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }))
  }

  const handleFileUpload = (documentType: keyof KYCData['documents'], file: File) => {
    setKycData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: {
          ...prev.documents[documentType],
          file,
          status: 'uploaded'
        }
      }
    }))
  }

  const submitKYC = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In production, upload documents and submit for verification
      console.log('Submitting KYC data:', kycData)

      setStep('complete')
    } catch (error) {
      setError('Erro ao enviar documentos. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
  }

  if (step === 'info') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="kyc-info-card">
          <CardHeader>
            <CardTitle className="kyc-title">
              <Shield className="w-6 h-6 text-blue-500" />
              Verificação de Identidade (KYC)
            </CardTitle>
            <p className="kyc-description">
              Para sua segurança e conformidade legal, precisamos verificar sua identidade
            </p>
          </CardHeader>

          <CardContent>
            <div className="kyc-requirements">
              <h4>Você precisará de:</h4>
              <div className="kyc-requirement-list">
                <div className="kyc-requirement">
                  <User className="w-5 h-5 text-blue-400" />
                  <div>
                    <strong>Documento de Identidade</strong>
                    <p>RG, CNH ou Passaporte (frente e verso)</p>
                  </div>
                </div>
                
                <div className="kyc-requirement">
                  <Home className="w-5 h-5 text-green-400" />
                  <div>
                    <strong>Comprovante de Endereço</strong>
                    <p>Conta de luz, água ou telefone (últimos 3 meses)</p>
                  </div>
                </div>
                
                <div className="kyc-requirement">
                  <Camera className="w-5 h-5 text-purple-400" />
                  <div>
                    <strong>Selfie com Documento</strong>
                    <p>Foto sua segurando o documento de identidade</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="kyc-benefits">
              <h4>Benefícios da Verificação:</h4>
              <ul className="kyc-benefits-list">
                <li>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Saques sem limitações
                </li>
                <li>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Maior segurança da conta
                </li>
                <li>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Acesso a recursos premium
                </li>
                <li>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Conformidade legal
                </li>
              </ul>
            </div>

            <Alert className="kyc-security-info">
              <Shield className="w-4 h-4" />
              <AlertDescription>
                Seus dados são protegidos com criptografia de nível bancário e usados apenas para verificação de identidade.
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => setStep('personal')}
              className="kyc-start-button"
            >
              Iniciar Verificação
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (step === 'personal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="kyc-form-card">
          <CardHeader>
            <CardTitle className="kyc-step-title">
              <User className="w-6 h-6 text-blue-500" />
              Informações Pessoais
            </CardTitle>
            <div className="kyc-progress">
              <div className="kyc-progress-bar">
                <div className="kyc-progress-fill" style={{ width: '25%' }} />
              </div>
              <span>Passo 1 de 4</span>
            </div>
          </CardHeader>

          <CardContent>
            <div className="kyc-form-grid">
              <div className="kyc-form-group">
                <label>Nome Completo</label>
                <Input
                  value={kycData.personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="kyc-form-group">
                <label>Data de Nascimento</label>
                <Input
                  type="date"
                  value={kycData.personalInfo.dateOfBirth}
                  onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                />
              </div>

              <div className="kyc-form-group">
                <label>CPF</label>
                <Input
                  value={kycData.personalInfo.cpf}
                  onChange={(e) => handlePersonalInfoChange('cpf', formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <div className="kyc-form-group">
                <label>RG</label>
                <Input
                  value={kycData.personalInfo.rg}
                  onChange={(e) => handlePersonalInfoChange('rg', e.target.value)}
                  placeholder="00.000.000-0"
                />
              </div>

              <div className="kyc-form-group">
                <label>Nacionalidade</label>
                <Input
                  value={kycData.personalInfo.nationality}
                  onChange={(e) => handlePersonalInfoChange('nationality', e.target.value)}
                  placeholder="Brasileira"
                />
              </div>

              <div className="kyc-form-group">
                <label>Profissão</label>
                <Input
                  value={kycData.personalInfo.occupation}
                  onChange={(e) => handlePersonalInfoChange('occupation', e.target.value)}
                  placeholder="Sua profissão"
                />
              </div>
            </div>

            <div className="kyc-form-actions">
              <Button
                variant="outline"
                onClick={() => setStep('info')}
              >
                Voltar
              </Button>
              
              <Button
                onClick={() => setStep('address')}
                disabled={!kycData.personalInfo.fullName || !kycData.personalInfo.cpf}
              >
                Próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (step === 'address') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="kyc-form-card">
          <CardHeader>
            <CardTitle className="kyc-step-title">
              <Home className="w-6 h-6 text-green-500" />
              Endereço Residencial
            </CardTitle>
            <div className="kyc-progress">
              <div className="kyc-progress-bar">
                <div className="kyc-progress-fill" style={{ width: '50%' }} />
              </div>
              <span>Passo 2 de 4</span>
            </div>
          </CardHeader>

          <CardContent>
            <div className="kyc-form-grid">
              <div className="kyc-form-group">
                <label>CEP</label>
                <Input
                  value={kycData.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', formatCEP(e.target.value))}
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>

              <div className="kyc-form-group">
                <label>Rua/Avenida</label>
                <Input
                  value={kycData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  placeholder="Nome da rua"
                />
              </div>

              <div className="kyc-form-group">
                <label>Número</label>
                <Input
                  value={kycData.address.number}
                  onChange={(e) => handleAddressChange('number', e.target.value)}
                  placeholder="123"
                />
              </div>

              <div className="kyc-form-group">
                <label>Complemento</label>
                <Input
                  value={kycData.address.complement}
                  onChange={(e) => handleAddressChange('complement', e.target.value)}
                  placeholder="Apto, bloco, etc."
                />
              </div>

              <div className="kyc-form-group">
                <label>Bairro</label>
                <Input
                  value={kycData.address.neighborhood}
                  onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                  placeholder="Nome do bairro"
                />
              </div>

              <div className="kyc-form-group">
                <label>Cidade</label>
                <Input
                  value={kycData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="Nome da cidade"
                />
              </div>

              <div className="kyc-form-group">
                <label>Estado</label>
                <select
                  value={kycData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="kyc-select"
                >
                  <option value="">Selecione o estado</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="RS">Rio Grande do Sul</option>
                  {/* Add more states */}
                </select>
              </div>
            </div>

            <div className="kyc-form-actions">
              <Button
                variant="outline"
                onClick={() => setStep('personal')}
              >
                Voltar
              </Button>
              
              <Button
                onClick={() => setStep('documents')}
                disabled={!kycData.address.street || !kycData.address.city}
              >
                Próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Continue with documents step...
  return (
    <div className="kyc-verification">
      <p>KYC Verification Component</p>
    </div>
  )
}
