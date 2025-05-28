import crypto from 'crypto'

/**
 * Cryptographic utilities for Chronos Platform
 * Used for generating provably fair random numbers for sweepstakes
 */

export interface DrawSeed {
  timestamp: number
  roomId: string
  participants: string[]
  entropy: string
}

export interface DrawResult {
  seed: DrawSeed
  seedHash: string
  randomValue: string
  winnerIndex: number
  winnerId: string
}

/**
 * Generate a cryptographically secure random seed for a draw
 */
export function generateDrawSeed(roomId: string, participants: string[]): DrawSeed {
  const timestamp = Date.now()
  const entropy = crypto.randomBytes(32).toString('hex')
  
  return {
    timestamp,
    roomId,
    participants: [...participants].sort(), // Sort for consistency
    entropy,
  }
}

/**
 * Create a SHA-256 hash of the draw seed
 */
export function hashSeed(seed: DrawSeed): string {
  const seedString = JSON.stringify(seed)
  return crypto.createHash('sha256').update(seedString).digest('hex')
}

/**
 * Generate a random number from 0 to max-1 using the seed
 */
export function generateRandomFromSeed(seedHash: string, max: number): number {
  // Use the seed hash to generate a deterministic random number
  const hash = crypto.createHash('sha256').update(seedHash).digest('hex')
  
  // Convert first 8 bytes of hash to a number
  const randomHex = hash.substring(0, 16)
  const randomNumber = parseInt(randomHex, 16)
  
  // Return number in range [0, max)
  return randomNumber % max
}

/**
 * Perform a complete draw with cryptographic proof
 */
export function performDraw(roomId: string, participants: string[]): DrawResult {
  if (participants.length === 0) {
    throw new Error('No participants in draw')
  }

  // Generate seed
  const seed = generateDrawSeed(roomId, participants)
  
  // Hash the seed
  const seedHash = hashSeed(seed)
  
  // Generate random winner index
  const winnerIndex = generateRandomFromSeed(seedHash, participants.length)
  const winnerId = participants[winnerIndex]
  
  // Create random value for display (first 16 chars of hash)
  const randomValue = seedHash.substring(0, 16)
  
  return {
    seed,
    seedHash,
    randomValue,
    winnerIndex,
    winnerId,
  }
}

/**
 * Verify a draw result using the original seed
 */
export function verifyDraw(result: DrawResult): boolean {
  try {
    // Recreate the hash from the seed
    const expectedHash = hashSeed(result.seed)
    
    // Check if hashes match
    if (expectedHash !== result.seedHash) {
      return false
    }
    
    // Recreate the random number
    const expectedWinnerIndex = generateRandomFromSeed(result.seedHash, result.seed.participants.length)
    
    // Check if winner index matches
    if (expectedWinnerIndex !== result.winnerIndex) {
      return false
    }
    
    // Check if winner ID matches
    const expectedWinnerId = result.seed.participants[expectedWinnerIndex]
    if (expectedWinnerId !== result.winnerId) {
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error verifying draw:', error)
    return false
  }
}

/**
 * Create an obfuscated version of the seed for public display
 * Removes sensitive entropy while keeping verifiable data
 */
export function obfuscateSeed(seed: DrawSeed): Partial<DrawSeed> {
  return {
    timestamp: seed.timestamp,
    roomId: seed.roomId,
    participants: seed.participants,
    // entropy is removed for privacy
  }
}

/**
 * Generate a signature for audit logs
 */
export function signAuditLog(data: any, secret: string): string {
  const dataString = JSON.stringify(data)
  return crypto
    .createHmac('sha256', secret)
    .update(dataString)
    .digest('hex')
}

/**
 * Verify an audit log signature
 */
export function verifyAuditLog(data: any, signature: string, secret: string): boolean {
  const expectedSignature = signAuditLog(data, secret)
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}

/**
 * Generate a secure random string for invite codes, etc.
 */
export function generateSecureRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length)
    result += chars[randomIndex]
  }
  
  return result
}

/**
 * Hash a password using bcrypt-compatible method
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(password, 12)
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(password, hash)
}
