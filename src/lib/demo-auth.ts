/**
 * Sistema de autenticação demo para Chronos Platform
 * Funciona sem banco de dados para demonstração
 */

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  chronosBalance: number;
  isDemo: boolean;
}

// Usuários demo pré-definidos
const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-user-1',
    email: 'demo@chronos.com',
    name: 'Usuário Demo',
    nickname: 'ChronosPlayer',
    chronosBalance: 100.00,
    isDemo: true
  },
  {
    id: 'demo-user-2',
    email: 'teste@chronos.com',
    name: 'Teste Chronos',
    nickname: 'TestPlayer',
    chronosBalance: 50.00,
    isDemo: true
  }
];

// Simular login
export function demoLogin(email: string, password: string): DemoUser | null {
  // Aceitar qualquer senha para demo
  const user = DEMO_USERS.find(u => u.email === email);
  
  if (user) {
    // Salvar no localStorage para persistir sessão
    if (typeof window !== 'undefined') {
      localStorage.setItem('chronos-demo-user', JSON.stringify(user));
    }
    return user;
  }
  
  // Se não encontrar, criar usuário demo automaticamente
  if (email.includes('@')) {
    const newUser: DemoUser = {
      id: `demo-${Date.now()}`,
      email,
      name: email.split('@')[0],
      nickname: `Player${Math.floor(Math.random() * 1000)}`,
      chronosBalance: 25.00, // Saldo inicial demo
      isDemo: true
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('chronos-demo-user', JSON.stringify(newUser));
    }
    
    return newUser;
  }
  
  return null;
}

// Simular registro
export function demoRegister(email: string, password: string, name: string): DemoUser {
  const newUser: DemoUser = {
    id: `demo-${Date.now()}`,
    email,
    name,
    nickname: `${name.replace(/\s+/g, '')}${Math.floor(Math.random() * 100)}`,
    chronosBalance: 50.00, // Saldo inicial para novos usuários
    isDemo: true
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('chronos-demo-user', JSON.stringify(newUser));
  }
  
  return newUser;
}

// Obter usuário atual
export function getCurrentDemoUser(): DemoUser | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('chronos-demo-user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  
  return null;
}

// Logout
export function demoLogout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('chronos-demo-user');
  }
}

// Atualizar saldo
export function updateDemoBalance(newBalance: number): void {
  const user = getCurrentDemoUser();
  if (user && typeof window !== 'undefined') {
    user.chronosBalance = newBalance;
    localStorage.setItem('chronos-demo-user', JSON.stringify(user));
  }
}

// Verificar se está logado
export function isDemoLoggedIn(): boolean {
  return getCurrentDemoUser() !== null;
}
