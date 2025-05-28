import crypto from 'crypto'

export interface SweepstakeParticipant {
  id: string
  userId: string
  entryFee: number
  createdAt: Date
}

export interface SweepstakeResult {
  winnerId: string
  winnerUserId: string
  algorithm: string
  seed: string
  hash: string
  proof: string
  timestamp: Date
  participants: SweepstakeParticipant[]
}

/**
 * Algoritmo de sorteio criptográfico transparente
 * Utiliza SHA-256 para garantir transparência e auditabilidade
 */
export class SweepstakeAlgorithm {
  /**
   * Executa o sorteio usando algoritmo criptográfico
   */
  static async executeDraw(
    sweepstakeId: string,
    participants: SweepstakeParticipant[]
  ): Promise<SweepstakeResult> {
    if (participants.length === 0) {
      throw new Error('Nenhum participante encontrado')
    }

    if (participants.length === 1) {
      // Se há apenas um participante, ele é o vencedor
      const winner = participants[0]
      return {
        winnerId: winner.id,
        winnerUserId: winner.userId,
        algorithm: 'SINGLE_PARTICIPANT',
        seed: 'N/A',
        hash: 'N/A',
        proof: 'Único participante',
        timestamp: new Date(),
        participants
      }
    }

    // Gerar seed baseado em dados determinísticos
    const seed = this.generateSeed(sweepstakeId, participants)
    
    // Gerar hash do seed
    const hash = crypto.createHash('sha256').update(seed).digest('hex')
    
    // Converter hash para número
    const randomNumber = this.hashToNumber(hash)
    
    // Selecionar vencedor
    const winnerIndex = randomNumber % participants.length
    const winner = participants[winnerIndex]
    
    // Gerar prova de verificação
    const proof = this.generateProof(sweepstakeId, participants, seed, hash, winnerIndex)
    
    return {
      winnerId: winner.id,
      winnerUserId: winner.userId,
      algorithm: 'SHA256_DETERMINISTIC',
      seed,
      hash,
      proof,
      timestamp: new Date(),
      participants
    }
  }

  /**
   * Gera seed determinístico baseado nos dados do sorteio
   */
  private static generateSeed(
    sweepstakeId: string,
    participants: SweepstakeParticipant[]
  ): string {
    // Ordenar participantes por ID para garantir determinismo
    const sortedParticipants = [...participants].sort((a, b) => a.id.localeCompare(b.id))
    
    // Criar string com dados determinísticos
    const participantData = sortedParticipants
      .map(p => `${p.id}:${p.userId}:${p.createdAt.getTime()}`)
      .join('|')
    
    // Adicionar timestamp do bloco mais recente (simulado)
    const blockTimestamp = Math.floor(Date.now() / (5 * 60 * 1000)) * (5 * 60 * 1000) // Arredonda para 5 minutos
    
    // Combinar todos os dados
    const seedData = `${sweepstakeId}:${participantData}:${blockTimestamp}`
    
    return seedData
  }

  /**
   * Converte hash SHA-256 para número
   */
  private static hashToNumber(hash: string): number {
    // Usar os primeiros 8 caracteres do hash para evitar overflow
    const hexSubstring = hash.substring(0, 8)
    return parseInt(hexSubstring, 16)
  }

  /**
   * Gera prova de verificação do sorteio
   */
  private static generateProof(
    sweepstakeId: string,
    participants: SweepstakeParticipant[],
    seed: string,
    hash: string,
    winnerIndex: number
  ): string {
    const proofData = {
      sweepstakeId,
      participantCount: participants.length,
      participantIds: participants.map(p => p.id).sort(),
      seed,
      hash,
      winnerIndex,
      algorithm: 'SHA256_DETERMINISTIC',
      timestamp: new Date().toISOString()
    }

    return JSON.stringify(proofData, null, 2)
  }

  /**
   * Verifica se um resultado de sorteio é válido
   */
  static verifyResult(result: SweepstakeResult, sweepstakeId: string): boolean {
    try {
      // Recriar o seed
      const recreatedSeed = this.generateSeed(sweepstakeId, result.participants)
      
      if (recreatedSeed !== result.seed) {
        console.error('Seed não confere')
        return false
      }

      // Recriar o hash
      const recreatedHash = crypto.createHash('sha256').update(result.seed).digest('hex')
      
      if (recreatedHash !== result.hash) {
        console.error('Hash não confere')
        return false
      }

      // Verificar se o vencedor está correto
      const randomNumber = this.hashToNumber(result.hash)
      const expectedWinnerIndex = randomNumber % result.participants.length
      const expectedWinner = result.participants[expectedWinnerIndex]

      if (expectedWinner.id !== result.winnerId) {
        console.error('Vencedor não confere')
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao verificar resultado:', error)
      return false
    }
  }

  /**
   * Gera estatísticas de distribuição para auditoria
   */
  static generateDistributionStats(
    sweepstakeId: string,
    participants: SweepstakeParticipant[],
    iterations: number = 1000
  ): { [participantId: string]: number } {
    const stats: { [participantId: string]: number } = {}
    
    // Inicializar contadores
    participants.forEach(p => {
      stats[p.id] = 0
    })

    // Simular múltiplos sorteios com seeds diferentes
    for (let i = 0; i < iterations; i++) {
      const modifiedSeed = this.generateSeed(sweepstakeId + i, participants)
      const hash = crypto.createHash('sha256').update(modifiedSeed).digest('hex')
      const randomNumber = this.hashToNumber(hash)
      const winnerIndex = randomNumber % participants.length
      const winner = participants[winnerIndex]
      
      stats[winner.id]++
    }

    // Converter para percentuais
    Object.keys(stats).forEach(key => {
      stats[key] = (stats[key] / iterations) * 100
    })

    return stats
  }
}

/**
 * Utilitários para auditoria pública
 */
export class SweepstakeAudit {
  /**
   * Gera relatório de auditoria público
   */
  static generatePublicAuditReport(result: SweepstakeResult, sweepstakeId: string) {
    const isValid = SweepstakeAlgorithm.verifyResult(result, sweepstakeId)
    
    return {
      sweepstakeId,
      timestamp: result.timestamp,
      algorithm: result.algorithm,
      participantCount: result.participants.length,
      winner: {
        participantId: result.winnerId,
        userId: result.winnerUserId
      },
      verification: {
        isValid,
        seed: result.seed,
        hash: result.hash,
        proof: result.proof
      },
      auditUrl: `/audit/sweepstake/${sweepstakeId}`,
      verificationSteps: [
        '1. Verificar que o seed foi gerado corretamente a partir dos dados do sorteio',
        '2. Verificar que o hash SHA-256 do seed está correto',
        '3. Verificar que o vencedor foi selecionado corretamente baseado no hash',
        '4. Confirmar que todos os participantes tinham chances iguais'
      ]
    }
  }
}
