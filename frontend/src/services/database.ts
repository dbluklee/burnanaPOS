// Local database service using IndexedDB for offline storage
import { openDB, type IDBPDatabase } from 'idb';

export interface LogEntry {
  id?: number; // Auto-increment primary key
  eventId: string; // Unique identifier for the event type
  storeNumber: string; // Store's unique identifier
  userId: string; // Current user ID
  timestamp: number; // Unix timestamp
  timeFormatted: string; // Human-readable time (e.g., "10:31")
  text: string; // Log message including Item references
  itemTags?: string[]; // Extracted item tags for easier querying
  synced: boolean; // Whether this entry has been synced to server
  createdAt: number; // When the log was created locally
}

export interface SyncMetadata {
  id: string;
  lastSyncTime: number;
  pendingSyncCount: number;
}

const DB_NAME = 'BurnanaLogDB';
const DB_VERSION = 1;
const LOG_STORE = 'logs';
const SYNC_META_STORE = 'sync_metadata';

class DatabaseService {
  private db: IDBPDatabase | null = null;

  async initialize(): Promise<void> {
    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Logs store
        if (!db.objectStoreNames.contains(LOG_STORE)) {
          const logStore = db.createObjectStore(LOG_STORE, {
            keyPath: 'id',
            autoIncrement: true
          });
          
          // Create indices for efficient querying
          logStore.createIndex('timestamp', 'timestamp');
          logStore.createIndex('eventId', 'eventId');
          logStore.createIndex('synced', 'synced');
          logStore.createIndex('storeNumber', 'storeNumber');
          logStore.createIndex('userId', 'userId');
        }

        // Sync metadata store
        if (!db.objectStoreNames.contains(SYNC_META_STORE)) {
          db.createObjectStore(SYNC_META_STORE, { keyPath: 'id' });
        }
      },
    });
  }

  async addLogEntry(entry: Omit<LogEntry, 'id' | 'createdAt' | 'synced'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const logEntry: Omit<LogEntry, 'id'> = {
      ...entry,
      synced: false,
      createdAt: Date.now(),
    };

    return await this.db.add(LOG_STORE, logEntry);
  }

  async getAllLogs(): Promise<LogEntry[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAll(LOG_STORE);
  }

  async getRecentLogs(limit: number = 50): Promise<LogEntry[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(LOG_STORE, 'readonly');
    const store = transaction.objectStore(LOG_STORE);
    const index = store.index('timestamp');
    
    // Get logs in descending order (most recent first)
    const logs = await index.getAll(IDBKeyRange.lowerBound(0), limit);
    return logs.reverse(); // Reverse to get most recent first
  }

  async getUnsyncedLogs(): Promise<LogEntry[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(LOG_STORE, 'readonly');
    const store = transaction.objectStore(LOG_STORE);
    const index = store.index('synced');
    
    return await index.getAll(false); // Get all unsynced logs
  }

  async markLogAsSynced(logId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(LOG_STORE, 'readwrite');
    const store = transaction.objectStore(LOG_STORE);
    const log = await store.get(logId);
    
    if (log) {
      log.synced = true;
      await store.put(log);
    }
  }

  async markMultipleLogsAsSynced(logIds: number[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(LOG_STORE, 'readwrite');
    const store = transaction.objectStore(LOG_STORE);
    
    for (const logId of logIds) {
      const log = await store.get(logId);
      if (log) {
        log.synced = true;
        await store.put(log);
      }
    }
  }

  async deleteLogEntry(logId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.delete(LOG_STORE, logId);
  }

  async updateSyncMetadata(metadata: SyncMetadata): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put(SYNC_META_STORE, metadata);
  }

  async getSyncMetadata(id: string): Promise<SyncMetadata | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.get(SYNC_META_STORE, id);
  }

  async clearAllLogs(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.clear(LOG_STORE);
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export const databaseService = new DatabaseService();