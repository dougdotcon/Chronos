# Chronos Platform

Sistema de sorteios online com transparência criptográfica e moeda interna Chronos.

## 🎯 Características Principais

- **Transparência Total**: Sorteios com prova criptográfica SHA-256
- **Tempo Real**: Socket.IO para atualizações instantâneas
- **Múltiplos Formatos**: Demo, Individual, X1, X1 em Grupo, Batalhas Mensais
- **Moeda Interna**: Sistema Chronos com depósitos e saques
- **Interface Moderna**: Dark mode com paleta dourada elegante
- **Auditoria Completa**: Logs imutáveis de todas as transações

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: TailwindCSS + Framer Motion
- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js + JWT
- **Real-time**: Socket.IO
- **Payments**: Stripe + PayPal + Pix
- **State**: Zustand
- **UI Components**: Radix UI

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <repository-url>
cd chronos-platform
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/chronos_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"

# Outros...
```

### 4. Configure o banco de dados

```bash
# Gerar o cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# (Opcional) Popular com dados de exemplo
npm run db:seed
```

### 5. Execute o projeto

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
chronos-platform/
├── src/
│   ├── app/                 # App Router (Next.js 14)
│   │   ├── api/            # API Routes
│   │   ├── auth/           # Páginas de autenticação
│   │   ├── dashboard/      # Dashboard do usuário
│   │   └── globals.css     # Estilos globais
│   ├── components/         # Componentes React
│   │   ├── ui/            # Componentes base (Radix UI)
│   │   ├── layout/        # Layout components
│   │   └── sections/      # Seções da página
│   ├── contexts/          # React Contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilitários e configurações
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript types
├── prisma/                # Schema e migrações do banco
├── public/                # Assets estáticos
└── docs/                  # Documentação
```

## 🎮 Funcionalidades

### Sistema de Usuários
- [x] Cadastro com validação de CPF
- [x] Login/Logout com NextAuth
- [x] Verificação de email
- [x] Perfil do usuário
- [ ] 2FA (Two-Factor Authentication)

### Sistema Financeiro
- [x] Moeda interna Chronos
- [ ] Depósitos via Stripe/PayPal/Pix
- [ ] Saques para conta bancária
- [ ] Transferências P2P
- [x] Histórico de transações

### Sistema de Sorteios
- [x] Salas Demo (gratuitas)
- [ ] Sorteios Individuais
- [ ] Duelos X1
- [ ] Batalhas em Grupo
- [ ] Batalhas Mensais
- [x] PRNG criptográfico
- [x] Logs de auditoria

### Interface
- [x] Design responsivo
- [x] Dark mode elegante
- [x] Animações com Framer Motion
- [x] Componentes acessíveis
- [x] Notificações em tempo real

## 🔐 Segurança

### Criptografia
- SHA-256 para seeds dos sorteios
- Bcrypt para senhas
- JWT para sessões
- SSL/TLS obrigatório

### Auditoria
- Logs imutáveis de todas as ações
- Seeds públicas para verificação
- Histórico completo de transações
- Monitoramento anti-fraude

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com coverage
npm run test:coverage

# Testes E2E
npm run test:e2e
```

## 📊 Monitoramento

- Logs estruturados
- Métricas de performance
- Alertas de erro
- Dashboard de analytics

## 🚀 Deploy

### Vercel (Recomendado para Frontend)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t chronos-platform .
docker run -p 3000:3000 chronos-platform
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- Email: support@chronos-platform.com
- Discord: [Servidor da Comunidade]
- Documentação: [docs.chronos-platform.com]

## 🗺️ Roadmap

### Fase 1 (MVP) - ✅ Concluída
- [x] Interface básica
- [x] Sistema de autenticação
- [x] Estrutura do banco de dados
- [x] Componentes UI fundamentais

### Fase 2 (Core Features)
- [ ] Sistema de pagamentos completo
- [ ] Sorteios funcionais
- [ ] Chat em tempo real
- [ ] Dashboard administrativo

### Fase 3 (Advanced Features)
- [ ] Mobile app (React Native)
- [ ] API pública
- [ ] Sistema de afiliados
- [ ] Analytics avançados

### Fase 4 (Scale)
- [ ] Microserviços
- [ ] CDN global
- [ ] Multi-idioma
- [ ] Compliance internacional

---

**Chronos Platform** - Transparência e inovação em sorteios online 🎯
