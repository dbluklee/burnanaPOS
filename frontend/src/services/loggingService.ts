// Main logging service that captures events and manages log display
import { databaseService, type LogEntry } from './database';
import { syncService } from './syncService';

// Event types that can be logged
export enum EventType {
  // Navigation events
  NAVIGATION_WELCOME = 'nav_welcome',
  NAVIGATION_SIGNUP = 'nav_signup',
  NAVIGATION_SIGNIN = 'nav_signin',
  NAVIGATION_HOME = 'nav_home',
  NAVIGATION_MANAGEMENT = 'nav_management',
  NAVIGATION_BACK = 'nav_back',

  // Authentication events
  USER_SIGNUP = 'auth_signup',
  USER_SIGNIN = 'auth_signin',
  USER_SIGNOUT = 'auth_signout',

  // Management events
  PLACE_CREATED = 'place_created',
  PLACE_UPDATED = 'place_updated',
  PLACE_DELETED = 'place_deleted',
  TABLE_CREATED = 'table_created',
  TABLE_UPDATED = 'table_updated',
  TABLE_DELETED = 'table_deleted',

  // System events
  SYSTEM_STARTUP = 'system_startup',
  CONNECTION_ESTABLISHED = 'connection_established',
  CONNECTION_LOST = 'connection_lost',
  SYNC_COMPLETED = 'sync_completed',
  SYNC_FAILED = 'sync_failed',

  // Customer events (for future use)
  CUSTOMER_ARRIVED = 'customer_arrived',
  ORDER_PLACED = 'order_placed',
  ORDER_COMPLETED = 'order_completed',

  // Error events
  ERROR_OCCURRED = 'error_occurred',
}

interface LogContext {
  placeName?: string;
  tableName?: string;
  customerCount?: number;
  orderDetails?: string;
  errorMessage?: string;
  additionalData?: Record<string, any>;
}

class LoggingService {
  private storeNumber: string = 'STORE001'; // This would come from app config
  private currentUserId: string = 'user001'; // This would come from authentication
  private isInitialized: boolean = false;
  private logSubscribers: Set<(logs: LogEntry[]) => void> = new Set();

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await databaseService.initialize();
      
      // Start auto-sync if online
      if (navigator.onLine) {
        syncService.startAutoSync();
      }

      this.isInitialized = true;
      console.log('🚀 Logging service initialized');

      // Log system startup
      await this.log(EventType.SYSTEM_STARTUP, 'The dashboard has been started.');

      // Check initial connection
      if (navigator.onLine) {
        await this.log(EventType.CONNECTION_ESTABLISHED, 'Connection to the server was successful.');
      } else {
        await this.log(EventType.CONNECTION_LOST, 'No internet connection. Working offline.');
      }

    } catch (error) {
      console.error('❌ Failed to initialize logging service:', error);
      throw error;
    }
  }

  async log(eventType: EventType, message: string, context?: LogContext): Promise<void> {
    if (!this.isInitialized) {
      console.warn('⚠️ Logging service not initialized. Call initialize() first.');
      return;
    }

    try {
      // Extract item tags from message and context
      const itemTags = this.extractItemTags(message, context);
      
      // Format message with context
      const formattedMessage = this.formatMessage(message, context);

      const timestamp = Date.now();
      const logEntry: Omit<LogEntry, 'id' | 'createdAt' | 'synced'> = {
        eventId: eventType,
        storeNumber: this.storeNumber,
        userId: this.currentUserId,
        timestamp,
        timeFormatted: this.formatTime(timestamp),
        text: formattedMessage,
        itemTags,
      };

      // Save to local database
      const logId = await databaseService.addLogEntry(logEntry);
      
      // Get the complete log entry with ID
      const completeLogEntry: LogEntry = {
        ...logEntry,
        id: logId,
        createdAt: timestamp,
        synced: false,
      };

      console.log(`📝 Log created: [${eventType}] ${formattedMessage}`);

      // Try to sync immediately if online
      if (navigator.onLine) {
        await syncService.sendLogImmediately(completeLogEntry);
      }

      // Notify subscribers about new log
      this.notifySubscribers();

    } catch (error) {
      console.error('❌ Failed to create log entry:', error);
    }
  }

  private extractItemTags(message: string, context?: LogContext): string[] {
    const tags: string[] = [];

    // Extract place names (ending with "floor")
    const placeRegex = /\b(\w+\s+floor)\b/gi;
    const placeMatches = message.match(placeRegex);
    if (placeMatches) {
      tags.push(...placeMatches);
    }

    // Extract table names (starting with "Table")
    const tableRegex = /\b(Table\w*)\b/gi;
    const tableMatches = message.match(tableRegex);
    if (tableMatches) {
      tags.push(...tableMatches);
    }

    // Add context-based tags
    if (context?.placeName) {
      tags.push(context.placeName);
    }
    if (context?.tableName) {
      tags.push(context.tableName);
    }

    // Extract management keywords
    const managementKeywords = ['Place', 'Category', 'Menu'];
    managementKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(message)) {
        tags.push(keyword);
      }
    });

    return [...new Set(tags)]; // Remove duplicates
  }

  private formatMessage(message: string, context?: LogContext): string {
    let formatted = message;

    // Add context information to message
    if (context?.customerCount) {
      formatted = formatted.replace(/customer/i, `${context.customerCount} customer${context.customerCount > 1 ? 's' : ''}`);
    }

    return formatted;
  }

  private formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Convenience methods for common events
  async logNavigation(from: string, to: string): Promise<void> {
    await this.log(EventType.NAVIGATION_HOME, `Navigated from ${from} to ${to}.`);
  }

  async logPlaceCreated(placeName: string): Promise<void> {
    await this.log(EventType.PLACE_CREATED, `${placeName} has been created.`, { placeName });
  }

  async logPlaceDeleted(placeName: string): Promise<void> {
    await this.log(EventType.PLACE_DELETED, `${placeName} has been deleted.`, { placeName });
  }

  async logTableCreated(tableName: string, placeName: string): Promise<void> {
    await this.log(EventType.TABLE_CREATED, `${placeName} ${tableName} has been created.`, {
      tableName,
      placeName
    });
  }

  async logTableDeleted(tableName: string, placeName: string): Promise<void> {
    await this.log(EventType.TABLE_DELETED, `${placeName} ${tableName} has been deleted.`, {
      tableName,
      placeName
    });
  }

  async logCustomerArrival(placeName: string, tableName: string, customerCount: number = 1): Promise<void> {
    const customerText = customerCount === 1 ? 'A customer' : `${customerCount} customers`;
    await this.log(EventType.CUSTOMER_ARRIVED, `${placeName} ${tableName} ${customerText} has arrived.`, {
      placeName,
      tableName,
      customerCount
    });
  }

  async logError(errorMessage: string, additionalData?: Record<string, any>): Promise<void> {
    await this.log(EventType.ERROR_OCCURRED, `Error: ${errorMessage}`, {
      errorMessage,
      additionalData
    });
  }

  // Data retrieval methods
  async getRecentLogs(limit: number = 50): Promise<LogEntry[]> {
    return await databaseService.getRecentLogs(limit);
  }

  async getAllLogs(): Promise<LogEntry[]> {
    return await databaseService.getAllLogs();
  }

  // Subscription system for real-time log updates
  subscribe(callback: (logs: LogEntry[]) => void): () => void {
    this.logSubscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.logSubscribers.delete(callback);
    };
  }

  private async notifySubscribers(): Promise<void> {
    if (this.logSubscribers.size === 0) return;
    
    const recentLogs = await this.getRecentLogs();
    this.logSubscribers.forEach(callback => callback(recentLogs));
  }

  // Undo functionality
  async undoLog(logId: number): Promise<boolean> {
    try {
      // In a real application, you might want to create a "reversal" log instead of deleting
      // For now, we'll just mark it as deleted or create a reversal entry
      const logs = await databaseService.getAllLogs();
      const logToUndo = logs.find(log => log.id === logId);
      
      if (!logToUndo) {
        console.warn(`⚠️ Log ${logId} not found for undo`);
        return false;
      }

      // Create an undo log entry
      await this.log(EventType.SYSTEM_STARTUP, `Undid: ${logToUndo.text}`);
      
      // Delete the original log
      await databaseService.deleteLogEntry(logId);
      
      console.log(`↩️ Undid log ${logId}: ${logToUndo.text}`);
      
      // Notify subscribers about the change
      this.notifySubscribers();
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to undo log ${logId}:`, error);
      await this.logError(`Failed to undo log: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  // Sync management
  async forceSyncNow(): Promise<void> {
    const result = await syncService.syncPendingLogs();
    
    if (result.success) {
      await this.log(EventType.SYNC_COMPLETED, `Sync completed: ${result.syncedCount} logs synchronized.`);
    } else {
      await this.log(EventType.SYNC_FAILED, `Sync failed: ${result.errors?.join(', ') || 'Unknown error'}`);
    }
  }

  async getSyncStatus(): Promise<{ online: boolean; lastSyncTime?: number; pendingCount: number }> {
    return await syncService.getConnectionStatus();
  }

  // Configuration methods
  setStoreNumber(storeNumber: string): void {
    this.storeNumber = storeNumber;
  }

  setCurrentUser(userId: string): void {
    this.currentUserId = userId;
  }

  // Cleanup
  async destroy(): Promise<void> {
    syncService.destroy();
    await databaseService.close();
    this.logSubscribers.clear();
    this.isInitialized = false;
    console.log('🛑 Logging service destroyed');
  }
}

export const loggingService = new LoggingService();