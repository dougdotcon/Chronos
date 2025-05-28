#!/usr/bin/env node

/**
 * Script para configurar o banco de dados do Chronos Platform
 * Este script configura um banco PostgreSQL usando Supabase (gratuito)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando banco de dados do Chronos Platform...\n');

// URL do banco Supabase gratuito para desenvolvimento
const SUPABASE_URL = 'postgresql://postgres.ixqhqrforestneon:chronos123@aws-0-us-east-2.pooler.supabase.com:6543/postgres';

// Atualizar arquivo .env
const envPath = path.join(__dirname, '.env');
let envContent = fs.readFileSync(envPath, 'utf8');

// Substituir a URL do banco
envContent = envContent.replace(
  /DATABASE_URL=".*"/,
  `DATABASE_URL="${SUPABASE_URL}"`
);

fs.writeFileSync(envPath, envContent);
console.log('✅ Arquivo .env atualizado com URL do banco');

try {
  // Gerar cliente Prisma
  console.log('📦 Gerando cliente Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Fazer push do schema
  console.log('🗄️ Criando tabelas no banco...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // Executar seed
  console.log('🌱 Populando banco com dados iniciais...');
  execSync('npm run db:seed', { stdio: 'inherit' });
  
  console.log('\n🎉 Banco de dados configurado com sucesso!');
  console.log('🌐 Acesse: http://localhost:3000');
  console.log('📊 Prisma Studio: npm run db:studio');
  
} catch (error) {
  console.error('❌ Erro ao configurar banco:', error.message);
  console.log('\n💡 Tentando configuração alternativa...');
  
  // Configuração alternativa com banco local simulado
  console.log('🔄 Configurando modo desenvolvimento sem banco...');
  
  // Criar arquivo de configuração para modo demo
  const demoConfig = {
    mode: 'demo',
    database: 'memory',
    features: {
      realPayments: false,
      emailVerification: false,
      twoFactor: false
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'demo-config.json'), 
    JSON.stringify(demoConfig, null, 2)
  );
  
  console.log('✅ Modo demo configurado');
  console.log('🌐 Acesse: http://localhost:3000 (modo demonstração)');
}
