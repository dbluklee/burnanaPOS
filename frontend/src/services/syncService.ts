// Service for synchronizing logs between local database and server
import axios, { type AxiosResponse } from 'axios';
import { databaseService, type LogEntry } from './database';

interface ServerLogEntry {
  id?: string; // Server-generated ID
  eventId: string;
  storeNumber: string;
  userId: string;
  timestamp: number;
  text: string;
  itemTags?: string[];
}

interface SyncResponse {
  success: boolean;
  syncedCount: number;
  errors?: string[];
}

class SyncService {
  private baseUrl: string;
  private syncInterval: number | null = null;
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;

  constructor() {
    // In development, we'll use a mock API endpoint
    // In production, this would be your actual server endpoint
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  private handleOnline(): void {
    this.isOnline = true;
    console.log('💡 Connection restored. Starting automatic sync...');
    this.startAutoSync();
    this.syncPendingLogs();
  }

  private handleOffline(): void {
    this.isOnline = false;
    console.log('🔌 Connection lost. Stopping automatic sync...');
    this.stopAutoSync();
  }

  async syncPendingLogs(): Promise<SyncResponse> {
    if (!this.isOnline || this.syncInProgress) {
      return { success: false, syncedCount: 0, errors: ['Offline or sync in progress'] };
    }

    this.syncInProgress = true;

    try {
      const unsyncedLogs = await databaseService.getUnsyncedLogs();
      
      if (unsyncedLogs.length === 0) {
        console.log('✅ No logs to sync');
        return { success: true, syncedCount: 0 };
      }

      console.log(`🔄 Syncing ${unsyncedLogs.length} pending logs...`);

      // Convert local logs to server format
      const serverLogs: ServerLogEntry[] = unsyncedLogs.map(log => ({
        eventId: log.eventId,
        storeNumber: log.storeNumber,
        userId: log.userId,
        timestamp: log.timestamp,
        text: log.text,
        itemTags: log.itemTags
      }));

      // Send logs to server in batches
      const batchSize = 10;
      let syncedCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < serverLogs.length; i += batchSize) {
        const batch = serverLogs.slice(i, i + batchSize);
        const correspondingLocalLogs = unsyncedLogs.slice(i, i + batchSize);

        try {
          const response: AxiosResponse = await axios.post(
            `${this.baseUrl}/logs/batch`,
            { logs: batch },
            { 
              timeout: 10000,
              headers: { 'Content-Type': 'application/json' }
            }
          );

          if (response.data.success) {
            // Mark these logs as synced in local database
            const syncedIds = correspondingLocalLogs.map(log => log.id!);
            await databaseService.markMultipleLogsAsSynced(syncedIds);
            syncedCount += batch.length;
            console.log(`✅ Synced batch of ${batch.length} logs`);
          } else {
            errors.push(`Server rejected batch: ${response.data.message}`);
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`Batch sync failed: ${errorMsg}`);
          console.error('❌ Batch sync error:', error);
        }
      }

      // Update sync metadata
      await databaseService.updateSyncMetadata({
        id: 'last_sync',
        lastSyncTime: Date.now(),
        pendingSyncCount: unsyncedLogs.length - syncedCount
      });

      console.log(`🎉 Sync completed: ${syncedCount}/${unsyncedLogs.length} logs synced`);
      
      return {
        success: errors.length === 0,
        syncedCount,
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error) {
      console.error('❌ Sync service error:', error);
      return {
        success: false,
        syncedCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown sync error']
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  async sendLogImmediately(log: LogEntry): Promise<boolean> {
    if (!this.isOnline) {
      console.log('📱 Offline: Log saved locally for later sync');
      return false;
    }

    try {
      const serverLog: ServerLogEntry = {
        eventId: log.eventId,
        storeNumber: log.storeNumber,
        userId: log.userId,
        timestamp: log.timestamp,
        text: log.text,
        itemTags: log.itemTags
      };

      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/logs`,
        serverLog,
        { 
          timeout: 5000,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success && log.id) {
        await databaseService.markLogAsSynced(log.id);
        console.log('✅ Log sent immediately to server');
        return true;
      } else {
        console.log('❌ Server rejected immediate log send');
        return false;
      }
    } catch (error) {
      console.log('📱 Failed to send immediately, will sync later:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  startAutoSync(intervalMinutes: number = 2): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = window.setInterval(() => {
      if (this.isOnline) {
        this.syncPendingLogs();
      }
    }, intervalMinutes * 60 * 1000);

    console.log(`🔄 Auto-sync started (every ${intervalMinutes} minutes)`);
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('⏹️ Auto-sync stopped');
    }
  }

  async getConnectionStatus(): Promise<{ online: boolean; lastSyncTime?: number; pendingCount: number }> {
    const metadata = await databaseService.getSyncMetadata('last_sync');
    const unsyncedLogs = await databaseService.getUnsyncedLogs();
    
    return {
      online: this.isOnline,
      lastSyncTime: metadata?.lastSyncTime,
      pendingCount: unsyncedLogs.length
    };
  }

  // Mock server for development - this would be replaced by actual API calls
  private async mockServerRequest(logs: ServerLogEntry[]): Promise<{ success: boolean; message?: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Simulate occasional failures for testing
    if (Math.random() < 0.1) { // 10% failure rate
      throw new Error('Mock server error for testing');
    }
    
    return { success: true };
  }

  destroy(): void {
    this.stopAutoSync();
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
  }
}

export const syncService = new SyncService();