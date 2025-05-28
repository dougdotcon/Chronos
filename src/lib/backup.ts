import fs from 'fs/promises'
import path from 'path'
import { createReadStream, createWriteStream } from 'fs'
import { createGzip, createGunzip } from 'zlib'
import { pipeline } from 'stream/promises'

export interface BackupConfig {
  enabled: boolean
  schedule: string // cron format
  retention: {
    daily: number // days
    weekly: number // weeks
    monthly: number // months
  }
  storage: {
    local: boolean
    s3?: {
      bucket: string
      region: string
      accessKeyId: string
      secretAccessKey: string
    }
  }
  encryption: {
    enabled: boolean
    key?: string
  }
}

export interface BackupMetadata {
  id: string
  timestamp: number
  type: 'full' | 'incremental'
  size: number
  checksum: string
  tables: string[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  error?: string
}

// Default backup configuration
const defaultConfig: BackupConfig = {
  enabled: true,
  schedule: '0 2 * * *', // Daily at 2 AM
  retention: {
    daily: 7,
    weekly: 4,
    monthly: 12
  },
  storage: {
    local: true
  },
  encryption: {
    enabled: false
  }
}

export class BackupManager {
  private config: BackupConfig
  private backupDir: string

  constructor(config: Partial<BackupConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.backupDir = path.join(process.cwd(), 'backups')
  }

  // Initialize backup system
  async initialize(): Promise<void> {
    try {
      // Create backup directory if it doesn't exist
      await fs.mkdir(this.backupDir, { recursive: true })
      
      // Create subdirectories
      await fs.mkdir(path.join(this.backupDir, 'daily'), { recursive: true })
      await fs.mkdir(path.join(this.backupDir, 'weekly'), { recursive: true })
      await fs.mkdir(path.join(this.backupDir, 'monthly'), { recursive: true })
      
      console.log('📦 Backup system initialized')
    } catch (error) {
      console.error('📦 Failed to initialize backup system:', error)
      throw error
    }
  }

  // Create a full backup
  async createFullBackup(): Promise<BackupMetadata> {
    const backupId = `full_${Date.now()}`
    const timestamp = Date.now()
    
    const metadata: BackupMetadata = {
      id: backupId,
      timestamp,
      type: 'full',
      size: 0,
      checksum: '',
      tables: [],
      status: 'pending'
    }

    try {
      console.log('📦 Starting full backup:', backupId)
      metadata.status = 'running'

      // In a real implementation, this would backup the actual database
      // For now, we'll simulate backing up important data
      const backupData = await this.gatherBackupData()
      
      // Create backup file
      const backupPath = path.join(this.backupDir, 'daily', `${backupId}.json.gz`)
      await this.writeCompressedBackup(backupPath, backupData)
      
      // Calculate file size and checksum
      const stats = await fs.stat(backupPath)
      metadata.size = stats.size
      metadata.checksum = await this.calculateChecksum(backupPath)
      metadata.tables = Object.keys(backupData)
      metadata.status = 'completed'

      // Save metadata
      await this.saveBackupMetadata(metadata)
      
      console.log('📦 Full backup completed:', backupId)
      return metadata
    } catch (error) {
      console.error('📦 Full backup failed:', error)
      metadata.status = 'failed'
      metadata.error = error.message
      await this.saveBackupMetadata(metadata)
      throw error
    }
  }

  // Create an incremental backup
  async createIncrementalBackup(lastBackupTimestamp: number): Promise<BackupMetadata> {
    const backupId = `incremental_${Date.now()}`
    const timestamp = Date.now()
    
    const metadata: BackupMetadata = {
      id: backupId,
      timestamp,
      type: 'incremental',
      size: 0,
      checksum: '',
      tables: [],
      status: 'pending'
    }

    try {
      console.log('📦 Starting incremental backup:', backupId)
      metadata.status = 'running'

      // Gather only changed data since last backup
      const backupData = await this.gatherIncrementalData(lastBackupTimestamp)
      
      if (Object.keys(backupData).length === 0) {
        console.log('📦 No changes since last backup')
        metadata.status = 'completed'
        return metadata
      }

      // Create backup file
      const backupPath = path.join(this.backupDir, 'daily', `${backupId}.json.gz`)
      await this.writeCompressedBackup(backupPath, backupData)
      
      // Calculate file size and checksum
      const stats = await fs.stat(backupPath)
      metadata.size = stats.size
      metadata.checksum = await this.calculateChecksum(backupPath)
      metadata.tables = Object.keys(backupData)
      metadata.status = 'completed'

      // Save metadata
      await this.saveBackupMetadata(metadata)
      
      console.log('📦 Incremental backup completed:', backupId)
      return metadata
    } catch (error) {
      console.error('📦 Incremental backup failed:', error)
      metadata.status = 'failed'
      metadata.error = error.message
      await this.saveBackupMetadata(metadata)
      throw error
    }
  }

  // Restore from backup
  async restoreFromBackup(backupId: string, options: {
    tables?: string[]
    targetTimestamp?: number
    dryRun?: boolean
  } = {}): Promise<void> {
    try {
      console.log('📦 Starting restore from backup:', backupId)
      
      // Load backup metadata
      const metadata = await this.loadBackupMetadata(backupId)
      if (!metadata) {
        throw new Error(`Backup ${backupId} not found`)
      }

      // Find backup file
      const backupPath = await this.findBackupFile(backupId)
      if (!backupPath) {
        throw new Error(`Backup file for ${backupId} not found`)
      }

      // Verify backup integrity
      const isValid = await this.verifyBackupIntegrity(backupPath, metadata.checksum)
      if (!isValid) {
        throw new Error(`Backup ${backupId} failed integrity check`)
      }

      // Load backup data
      const backupData = await this.readCompressedBackup(backupPath)
      
      if (options.dryRun) {
        console.log('📦 Dry run - would restore:', Object.keys(backupData))
        return
      }

      // Restore data
      await this.restoreData(backupData, options)
      
      console.log('📦 Restore completed successfully')
    } catch (error) {
      console.error('📦 Restore failed:', error)
      throw error
    }
  }

  // List available backups
  async listBackups(): Promise<BackupMetadata[]> {
    try {
      const metadataFiles = await fs.readdir(path.join(this.backupDir, 'metadata'))
      const backups: BackupMetadata[] = []

      for (const file of metadataFiles) {
        if (file.endsWith('.json')) {
          const metadata = await this.loadBackupMetadata(file.replace('.json', ''))
          if (metadata) {
            backups.push(metadata)
          }
        }
      }

      return backups.sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error('📦 Failed to list backups:', error)
      return []
    }
  }

  // Clean up old backups based on retention policy
  async cleanupOldBackups(): Promise<void> {
    try {
      console.log('📦 Starting backup cleanup')
      
      const backups = await this.listBackups()
      const now = Date.now()
      
      for (const backup of backups) {
        const age = now - backup.timestamp
        const ageInDays = age / (24 * 60 * 60 * 1000)
        
        let shouldDelete = false
        
        // Apply retention policy
        if (backup.type === 'full') {
          if (ageInDays > this.config.retention.monthly * 30) {
            shouldDelete = true
          }
        } else if (backup.type === 'incremental') {
          if (ageInDays > this.config.retention.daily) {
            shouldDelete = true
          }
        }
        
        if (shouldDelete) {
          await this.deleteBackup(backup.id)
          console.log('📦 Deleted old backup:', backup.id)
        }
      }
      
      console.log('📦 Backup cleanup completed')
    } catch (error) {
      console.error('📦 Backup cleanup failed:', error)
    }
  }

  // Private helper methods
  private async gatherBackupData(): Promise<Record<string, any>> {
    // In a real implementation, this would query the database
    // For simulation, we'll create mock data
    return {
      users: [
        { id: 1, email: 'user1@example.com', createdAt: new Date() },
        { id: 2, email: 'user2@example.com', createdAt: new Date() }
      ],
      sweepstakes: [
        { id: 1, title: 'Test Sweepstake', prizeAmount: 1000, status: 'completed' }
      ],
      transactions: [
        { id: 1, userId: 1, amount: 100, type: 'deposit', createdAt: new Date() }
      ],
      settings: {
        platform: 'chronos',
        version: '1.0.0',
        backupTimestamp: Date.now()
      }
    }
  }

  private async gatherIncrementalData(since: number): Promise<Record<string, any>> {
    // In a real implementation, this would query for changes since timestamp
    const allData = await this.gatherBackupData()
    
    // Filter data modified since last backup
    // This is simplified - in reality you'd have timestamps on all records
    return {
      // Only include records modified since 'since' timestamp
      // For simulation, we'll return empty if no recent changes
    }
  }

  private async writeCompressedBackup(filePath: string, data: any): Promise<void> {
    const jsonData = JSON.stringify(data, null, 2)
    const readStream = require('stream').Readable.from([jsonData])
    const writeStream = createWriteStream(filePath)
    const gzipStream = createGzip()
    
    await pipeline(readStream, gzipStream, writeStream)
  }

  private async readCompressedBackup(filePath: string): Promise<any> {
    const readStream = createReadStream(filePath)
    const gunzipStream = createGunzip()
    
    let data = ''
    gunzipStream.on('data', (chunk) => {
      data += chunk.toString()
    })
    
    await pipeline(readStream, gunzipStream)
    return JSON.parse(data)
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    const crypto = require('crypto')
    const hash = crypto.createHash('sha256')
    const stream = createReadStream(filePath)
    
    for await (const chunk of stream) {
      hash.update(chunk)
    }
    
    return hash.digest('hex')
  }

  private async verifyBackupIntegrity(filePath: string, expectedChecksum: string): Promise<boolean> {
    const actualChecksum = await this.calculateChecksum(filePath)
    return actualChecksum === expectedChecksum
  }

  private async saveBackupMetadata(metadata: BackupMetadata): Promise<void> {
    const metadataDir = path.join(this.backupDir, 'metadata')
    await fs.mkdir(metadataDir, { recursive: true })
    
    const metadataPath = path.join(metadataDir, `${metadata.id}.json`)
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
  }

  private async loadBackupMetadata(backupId: string): Promise<BackupMetadata | null> {
    try {
      const metadataPath = path.join(this.backupDir, 'metadata', `${backupId}.json`)
      const data = await fs.readFile(metadataPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      return null
    }
  }

  private async findBackupFile(backupId: string): Promise<string | null> {
    const possiblePaths = [
      path.join(this.backupDir, 'daily', `${backupId}.json.gz`),
      path.join(this.backupDir, 'weekly', `${backupId}.json.gz`),
      path.join(this.backupDir, 'monthly', `${backupId}.json.gz`)
    ]
    
    for (const filePath of possiblePaths) {
      try {
        await fs.access(filePath)
        return filePath
      } catch {
        continue
      }
    }
    
    return null
  }

  private async restoreData(backupData: Record<string, any>, options: any): Promise<void> {
    // In a real implementation, this would restore to the database
    console.log('📦 Restoring data:', Object.keys(backupData))
    
    // Simulate restoration process
    for (const [table, data] of Object.entries(backupData)) {
      if (options.tables && !options.tables.includes(table)) {
        continue
      }
      
      console.log(`📦 Restoring table: ${table} (${Array.isArray(data) ? data.length : 1} records)`)
      
      // Here you would execute database operations to restore the data
      // For example: await prisma[table].createMany({ data })
    }
  }

  private async deleteBackup(backupId: string): Promise<void> {
    // Delete backup file
    const backupPath = await this.findBackupFile(backupId)
    if (backupPath) {
      await fs.unlink(backupPath)
    }
    
    // Delete metadata
    const metadataPath = path.join(this.backupDir, 'metadata', `${backupId}.json`)
    try {
      await fs.unlink(metadataPath)
    } catch {
      // Metadata file might not exist
    }
  }
}

// Backup scheduler
export class BackupScheduler {
  private manager: BackupManager
  private intervalId?: NodeJS.Timeout

  constructor(manager: BackupManager) {
    this.manager = manager
  }

  start(): void {
    // Simple daily backup scheduler
    // In production, use a proper cron library
    const runBackup = async () => {
      try {
        await this.manager.createFullBackup()
        await this.manager.cleanupOldBackups()
      } catch (error) {
        console.error('📦 Scheduled backup failed:', error)
      }
    }

    // Run backup every 24 hours
    this.intervalId = setInterval(runBackup, 24 * 60 * 60 * 1000)
    
    console.log('📦 Backup scheduler started')
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
      console.log('📦 Backup scheduler stopped')
    }
  }
}
