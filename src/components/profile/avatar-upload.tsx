'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { User } from 'next-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  Camera, 
  Upload,
  X,
  Check,
  AlertTriangle
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface AvatarUploadProps {
  user: User
  onAvatarChange?: (avatarUrl: string) => void
}

export function AvatarUpload({ user, onAvatarChange }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB')
      return
    }

    setError('')

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!previewUrl) return

    setIsUploading(true)
    try {
      // Simular upload - em produção seria uma API real
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular URL do avatar
      const avatarUrl = previewUrl
      
      onAvatarChange?.(avatarUrl)
      setPreviewUrl(null)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      alert('Avatar atualizado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      setError('Erro ao fazer upload da imagem. Tente novamente.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setPreviewUrl(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="avatar-upload">
      <div className="avatar-upload-container">
        {/* Current/Preview Avatar */}
        <div className="avatar-upload-preview">
          <Avatar className="avatar-upload-image">
            <AvatarImage src={previewUrl || user.image || ''} alt={user.name || ''} />
            <AvatarFallback className="avatar-upload-fallback">
              {getInitials(user.name || 'Usuario')}
            </AvatarFallback>
          </Avatar>
          
          {/* Upload Button Overlay */}
          <button
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="avatar-upload-overlay"
          >
            <Camera className="w-5 h-5" />
            <span>Alterar</span>
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="avatar-upload-input"
          style={{ display: 'none' }}
        />

        {/* Preview Actions */}
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="avatar-upload-actions"
          >
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              size="sm"
              className="avatar-upload-confirm"
            >
              {isUploading ? (
                <>
                  <div className="loading-spinner" />
                  Enviando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar
                </>
              )}
            </Button>
            
            <Button
              onClick={handleCancel}
              disabled={isUploading}
              variant="outline"
              size="sm"
              className="avatar-upload-cancel"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </motion.div>
        )}

        {/* Upload Instructions */}
        {!previewUrl && (
          <div className="avatar-upload-instructions">
            <Button
              onClick={triggerFileSelect}
              variant="outline"
              size="sm"
              className="avatar-upload-button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Escolher Imagem
            </Button>
            
            <div className="avatar-upload-tips">
              <p className="avatar-upload-tip">
                Formatos aceitos: JPG, PNG, GIF
              </p>
              <p className="avatar-upload-tip">
                Tamanho máximo: 5MB
              </p>
              <p className="avatar-upload-tip">
                Recomendado: 400x400px
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="avatar-upload-error"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>

      {/* Avatar Guidelines */}
      <div className="avatar-upload-guidelines">
        <h4 className="avatar-guidelines-title">Diretrizes para Avatar</h4>
        <ul className="avatar-guidelines-list">
          <li>Use uma foto clara do seu rosto</li>
          <li>Evite imagens ofensivas ou inadequadas</li>
          <li>Não use logos ou marcas registradas</li>
          <li>A imagem será redimensionada automaticamente</li>
        </ul>
      </div>
    </div>
  )
}
