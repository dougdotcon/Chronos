import nodemailer from 'nodemailer'

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'noreply@chronosplatform.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  }
}

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig)

// Email templates
export const emailTemplates = {
  welcome: {
    subject: '🎉 Bem-vindo ao Chronos Platform!',
    html: (data: { name: string; bonusAmount: number }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bem-vindo ao Chronos</title>
          <style>
            body { font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; color: #1a1a1a; }
            .content { padding: 30px; }
            .bonus-card { background: #3a3a3a; border: 2px solid #D4AF37; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .bonus-amount { font-size: 32px; font-weight: bold; color: #D4AF37; }
            .button { display: inline-block; background: #D4AF37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { background: #1a1a1a; padding: 20px; text-align: center; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚡ CHRONOS PLATFORM</div>
              <p style="margin: 10px 0 0 0; color: #1a1a1a;">A plataforma de sorteios mais transparente do Brasil</p>
            </div>
            
            <div class="content">
              <h2>Olá, ${data.name}! 👋</h2>
              
              <p>Seja muito bem-vindo(a) ao <strong>Chronos Platform</strong>! Estamos muito felizes em tê-lo(a) conosco.</p>
              
              <div class="bonus-card">
                <h3>🎁 Bônus de Boas-vindas</h3>
                <div class="bonus-amount">R$ ${data.bonusAmount.toFixed(2)}</div>
                <p>Creditado automaticamente em sua conta!</p>
              </div>
              
              <p>Com o Chronos Platform, você pode:</p>
              <ul>
                <li>✅ Participar de sorteios transparentes</li>
                <li>✅ Ganhar prêmios reais em dinheiro</li>
                <li>✅ Verificar a transparência de cada sorteio</li>
                <li>✅ Sacar seus ganhos com segurança</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">
                  Acessar Minha Conta
                </a>
              </div>
              
              <p><strong>Dicas importantes:</strong></p>
              <ul>
                <li>🔐 Mantenha sua senha segura</li>
                <li>📧 Confirme seu email para maior segurança</li>
                <li>💰 Comece com sorteios de valores menores</li>
                <li>🎯 Leia nossas regras e termos de uso</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>© 2024 Chronos Platform. Todos os direitos reservados.</p>
              <p>Este é um email automático, não responda a esta mensagem.</p>
              <p>Dúvidas? Entre em contato: suporte@chronosplatform.com</p>
            </div>
          </div>
        </body>
      </html>
    `
  },

  sweepstakeWin: {
    subject: '🏆 Parabéns! Você ganhou um sorteio!',
    html: (data: { name: string; sweepstakeId: string; amount: number; participants: number }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Você Ganhou!</title>
          <style>
            body { font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .win-card { background: linear-gradient(135deg, #D4AF37, #B8941F); color: #1a1a1a; border-radius: 8px; padding: 30px; margin: 20px 0; text-align: center; }
            .win-amount { font-size: 48px; font-weight: bold; margin: 10px 0; }
            .button { display: inline-block; background: #D4AF37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { background: #1a1a1a; padding: 20px; text-align: center; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div style="font-size: 28px; font-weight: bold; color: #1a1a1a;">⚡ CHRONOS PLATFORM</div>
              <h1 style="margin: 10px 0 0 0; color: #1a1a1a;">🎉 VOCÊ GANHOU! 🎉</h1>
            </div>
            
            <div class="content">
              <h2>Parabéns, ${data.name}! 🏆</h2>
              
              <div class="win-card">
                <h3>💰 PRÊMIO GANHO</h3>
                <div class="win-amount">R$ ${data.amount.toFixed(2)}</div>
                <p><strong>Sorteio #${data.sweepstakeId}</strong></p>
                <p>Você venceu entre ${data.participants} participantes!</p>
              </div>
              
              <p>🎯 <strong>Seu prêmio foi creditado automaticamente em sua conta!</strong></p>
              
              <p>Detalhes do sorteio:</p>
              <ul>
                <li>🆔 ID do Sorteio: #${data.sweepstakeId}</li>
                <li>👥 Total de Participantes: ${data.participants}</li>
                <li>💰 Valor do Prêmio: R$ ${data.amount.toFixed(2)}</li>
                <li>⏰ Data: ${new Date().toLocaleString('pt-BR')}</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/history" class="button">
                  Ver Histórico de Ganhos
                </a>
              </div>
              
              <p>🔍 <strong>Transparência Total:</strong> Você pode verificar a legitimidade deste sorteio em nossa página de auditoria pública.</p>
            </div>
            
            <div class="footer">
              <p>© 2024 Chronos Platform. Todos os direitos reservados.</p>
              <p>Parabéns novamente pelo seu prêmio! 🎉</p>
            </div>
          </div>
        </body>
      </html>
    `
  },

  depositConfirmation: {
    subject: '💰 Depósito confirmado com sucesso!',
    html: (data: { name: string; amount: number; method: string; transactionId: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Depósito Confirmado</title>
          <style>
            body { font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .deposit-card { background: #3a3a3a; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .amount { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; margin: 10px 0; }
            .button { display: inline-block; background: #D4AF37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { background: #1a1a1a; padding: 20px; text-align: center; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div style="font-size: 28px; font-weight: bold; color: #fff;">⚡ CHRONOS PLATFORM</div>
              <h1 style="margin: 10px 0 0 0; color: #fff;">✅ Depósito Confirmado</h1>
            </div>
            
            <div class="content">
              <h2>Olá, ${data.name}! 💰</h2>
              
              <p>Seu depósito foi processado com sucesso e já está disponível em sua conta!</p>
              
              <div class="deposit-card">
                <h3 style="text-align: center; color: #10b981;">💳 Depósito Realizado</h3>
                <div class="amount">R$ ${data.amount.toFixed(2)}</div>
                <p><strong>Método:</strong> ${data.method}</p>
                <p><strong>ID da Transação:</strong> ${data.transactionId}</p>
                <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
              </div>
              
              <p>🎯 <strong>Agora você pode participar dos sorteios disponíveis!</strong></p>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/sweepstakes" class="button">
                  Ver Sorteios Disponíveis
                </a>
              </div>
              
              <p><strong>Lembrete de segurança:</strong></p>
              <ul>
                <li>🔐 Nunca compartilhe suas credenciais</li>
                <li>📧 Confirme sempre os emails oficiais</li>
                <li>💰 Jogue com responsabilidade</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>© 2024 Chronos Platform. Todos os direitos reservados.</p>
              <p>Dúvidas sobre este depósito? Entre em contato conosco.</p>
            </div>
          </div>
        </body>
      </html>
    `
  },

  withdrawalRequest: {
    subject: '🏦 Solicitação de saque recebida',
    html: (data: { name: string; amount: number; method: string; requestId: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Saque Solicitado</title>
          <style>
            body { font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .withdrawal-card { background: #3a3a3a; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .amount { font-size: 32px; font-weight: bold; color: #f59e0b; text-align: center; margin: 10px 0; }
            .button { display: inline-block; background: #D4AF37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { background: #1a1a1a; padding: 20px; text-align: center; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div style="font-size: 28px; font-weight: bold; color: #fff;">⚡ CHRONOS PLATFORM</div>
              <h1 style="margin: 10px 0 0 0; color: #fff;">🏦 Saque Solicitado</h1>
            </div>
            
            <div class="content">
              <h2>Olá, ${data.name}! 💰</h2>
              
              <p>Recebemos sua solicitação de saque e ela está sendo processada.</p>
              
              <div class="withdrawal-card">
                <h3 style="text-align: center; color: #f59e0b;">🏦 Saque Solicitado</h3>
                <div class="amount">R$ ${data.amount.toFixed(2)}</div>
                <p><strong>Método:</strong> ${data.method}</p>
                <p><strong>ID da Solicitação:</strong> ${data.requestId}</p>
                <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                <p><strong>Status:</strong> Em processamento</p>
              </div>
              
              <p>⏰ <strong>Tempo de processamento:</strong></p>
              <ul>
                <li>PIX: Até 1 hora</li>
                <li>Transferência Bancária: 1-2 dias úteis</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/withdraw" class="button">
                  Acompanhar Status
                </a>
              </div>
              
              <p><strong>Importante:</strong></p>
              <ul>
                <li>🔍 Saques podem ser verificados por nossa equipe de segurança</li>
                <li>📧 Você receberá um email quando o saque for processado</li>
                <li>💰 O valor será transferido para a conta informada</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>© 2024 Chronos Platform. Todos os direitos reservados.</p>
              <p>Dúvidas sobre este saque? Entre em contato conosco.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

// Email service functions
export class EmailService {
  static async sendEmail(to: string, template: keyof typeof emailTemplates, data: any) {
    try {
      const templateConfig = emailTemplates[template]
      
      const mailOptions = {
        from: `"Chronos Platform" <${emailConfig.auth.user}>`,
        to,
        subject: templateConfig.subject,
        html: templateConfig.html(data)
      }

      // In development, just log the email
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email would be sent:', {
          to,
          subject: templateConfig.subject,
          template,
          data
        })
        return { success: true, messageId: 'dev-' + Date.now() }
      }

      // In production, send real email
      const info = await transporter.sendMail(mailOptions)
      console.log('📧 Email sent:', info.messageId)
      
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error('📧 Email error:', error)
      return { success: false, error: error.message }
    }
  }

  static async sendWelcomeEmail(to: string, name: string, bonusAmount: number = 100) {
    return this.sendEmail(to, 'welcome', { name, bonusAmount })
  }

  static async sendSweepstakeWinEmail(to: string, name: string, sweepstakeId: string, amount: number, participants: number) {
    return this.sendEmail(to, 'sweepstakeWin', { name, sweepstakeId, amount, participants })
  }

  static async sendDepositConfirmationEmail(to: string, name: string, amount: number, method: string, transactionId: string) {
    return this.sendEmail(to, 'depositConfirmation', { name, amount, method, transactionId })
  }

  static async sendWithdrawalRequestEmail(to: string, name: string, amount: number, method: string, requestId: string) {
    return this.sendEmail(to, 'withdrawalRequest', { name, amount, method, requestId })
  }
}

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify()
    console.log('📧 Email configuration verified successfully')
    return true
  } catch (error) {
    console.error('📧 Email configuration error:', error)
    return false
  }
}
