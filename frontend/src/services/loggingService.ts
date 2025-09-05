// Main logging service that captures events and manages log display
import { databaseService, type LogEntry } from './database';
import { syncService } from './syncService';
import { placeService, type PlaceData } from './placeService';

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
  MENU_CREATED = 'menu_created',
  MENU_UPDATED = 'menu_updated',
  MENU_DELETED = 'menu_deleted',
  CATEGORY_CREATED = 'category_created',
  CATEGORY_UPDATED = 'category_updated',
  CATEGORY_DELETED = 'category_deleted',

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
  additionalData?: any; // Can contain preData/postData and other metadata
}

class LoggingService {
  // Dynamic user information - retrieved from localStorage
  private isInitialized: boolean = false;
  
  // Helper methods to get current user information
  private getCurrentUser() {
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) return null;
    try {
      return JSON.parse(currentUserStr);
    } catch (error) {
      console.error('Failed to parse current user from localStorage:', error);
      return null;
    }
  }
  
  private setCurrentUser(userId: string) {
    // This is handled by the auth service, we just need this method to avoid errors
  }
  
  private getStoreNumber(): string {
    const currentUser = this.getCurrentUser();
    return currentUser?.storeNumber || 'UNKNOWN_STORE';
  }
  
  private getCurrentUserId(): string {
    const currentUser = this.getCurrentUser();
    return currentUser?.userPin || 'UNKNOWN_USER';
  }
  private logSubscribers: Set<(logs: LogEntry[]) => void> = new Set();
  private sessionStartTime: number | null = null;
  private places: PlaceData[] = []; // Cache of places from database

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await databaseService.initialize();
      
      // Restore session start time from localStorage if available
      const savedSessionStartTime = localStorage.getItem('sessionStartTime');
      if (savedSessionStartTime) {
        this.sessionStartTime = parseInt(savedSessionStartTime, 10);
      }
      
      // Start auto-sync immediately
      syncService.startAutoSync();

      this.isInitialized = true;

      // Only log system messages if there's an active session
      // System startup logs are not useful for session-based logging
      // These messages will be logged when user actually signs in

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
      // Format message with context
      const formattedMessage = this.formatMessage(message, context);

      const timestamp = Date.now();
      const logEntry: Omit<LogEntry, 'id' | 'createdAt' | 'synced'> = {
        eventId: eventType,
        storeNumber: this.getStoreNumber(),
        userId: this.getCurrentUserId(),
        timestamp,
        timeFormatted: this.formatTime(timestamp),
        text: formattedMessage,
        additionalData: context?.additionalData,
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


      // Immediately sync the log to server
      await syncService.sendLogImmediately(completeLogEntry);

      // Notify subscribers about new log
      this.notifySubscribers();

    } catch (error) {
      console.error('❌ Failed to create log entry:', error);
    }
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
    // Convert to Korean time (Asia/Seoul timezone)
    const koreanTime = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
    const hours = koreanTime.getHours().toString().padStart(2, '0');
    const minutes = koreanTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Convenience methods for common events
  async logNavigation(from: string, to: string): Promise<void> {
    await this.log(EventType.NAVIGATION_HOME, `Navigated from ${from} to ${to}.`);
  }

  async logPlaceCreated(placeName: string, color: string): Promise<void> {
    // Auto-initialize if not already initialized
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const metadata = {
      preData: { placeName: "", color: "" },
      postData: { placeName, color }
    };
    await this.log(EventType.PLACE_CREATED, `{{${placeName}}} has been created.`, { 
      placeName, 
      additionalData: metadata 
    });
  }

  async logPlaceDeleted(placeName: string, color: string): Promise<void> {
    // Auto-initialize if not already initialized
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const metadata = {
      preData: { placeName, color },
      postData: { placeName: "", color: "" }
    };
    await this.log(EventType.PLACE_DELETED, `{{${placeName}}} has been deleted.`, { 
      placeName, 
      additionalData: metadata 
    });
  }

  async logPlaceUpdated(oldPlaceName: string, oldColor: string, newPlaceName: string, newColor: string): Promise<void> {
    // Auto-initialize if not already initialized
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const metadata = {
      preData: { placeName: oldPlaceName, color: oldColor },
      postData: { placeName: newPlaceName, color: newColor }
    };
    await this.log(EventType.PLACE_UPDATED, `{{${newPlaceName}}} has been modified.`, { 
      placeName: newPlaceName, 
      additionalData: metadata 
    });
  }

  async logTableCreated(tableName: string, placeName: string, tableData?: any): Promise<void> {
    const metadata = {
      preData: { tableName: "", placeName: placeName, ...tableData },
      postData: { tableName, placeName, ...tableData }
    };
    await this.log(EventType.TABLE_CREATED, `{{${placeName}}} {{${tableName}}} has been created.`, {
      tableName,
      placeName,
      additionalData: metadata
    });
  }

  async logTableDeleted(tableName: string, placeName: string, tableData?: any): Promise<void> {
    const metadata = {
      preData: { tableName, placeName, ...tableData },
      postData: { tableName: "", placeName: placeName, ...tableData }
    };
    await this.log(EventType.TABLE_DELETED, `{{${placeName}}} {{${tableName}}} has been deleted.`, {
      tableName,
      placeName,
      additionalData: metadata
    });
  }

  async logCustomerArrival(placeName: string, tableName: string, customerCount: number = 1): Promise<void> {
    const customerText = customerCount === 1 ? 'A customer' : `${customerCount} customers`;
    await this.log(EventType.CUSTOMER_ARRIVED, `{{${placeName}}} {{${tableName}}} ${customerText} has arrived.`, {
      place: placeName,
      table: tableName,
      customerCount
    });
  }

  // Future Menu logging methods
  async logMenuCreated(menuName: string): Promise<void> {
    await this.log(EventType.MENU_CREATED, `{{${menuName}}} has been created.`, { menu: menuName });
  }

  async logMenuDeleted(menuName: string): Promise<void> {
    await this.log(EventType.MENU_DELETED, `{{${menuName}}} has been deleted.`, { menu: menuName });
  }

  // Future Category logging methods
  async logCategoryCreated(categoryName: string): Promise<void> {
    await this.log(EventType.CATEGORY_CREATED, `{{${categoryName}}} has been created.`, { category: categoryName });
  }

  async logCategoryDeleted(categoryName: string): Promise<void> {
    await this.log(EventType.CATEGORY_DELETED, `{{${categoryName}}} has been deleted.`, { category: categoryName });
  }

  async logError(errorMessage: string, additionalData?: Record<string, any>): Promise<void> {
    await this.log(EventType.ERROR_OCCURRED, `Error: ${errorMessage}`, {
      errorMessage,
      additionalData
    });
  }

  // Authentication event methods
  async logUserSignIn(userId: string): Promise<void> {
    this.setCurrentUser(userId);
    
    // Clear all local logs and start fresh session automatically
    await this.clearAllLocalData();
    
    // Small delay to ensure clearing is complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.markSessionStart(); // Mark session start when user signs in
    
    await this.log(EventType.USER_SIGNIN, `User ${userId} has signed in.`);
  }

  async logServerConnection(isConnected: boolean, message: string): Promise<void> {
    if (isConnected) {
      await this.log(EventType.CONNECTION_ESTABLISHED, `Server connection verified: ${message}`);
    } else {
      await this.log(EventType.CONNECTION_LOST, `Server connection failed: ${message}`);
    }
  }

  async logUserSignUp(userId: string): Promise<void> {
    this.setCurrentUser(userId);
    
    // Clear all local logs and start fresh session automatically
    await this.clearAllLocalData();
    
    // Small delay to ensure clearing is complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.markSessionStart(); // Mark session start when user signs up
    
    await this.log(EventType.USER_SIGNUP, `User ${userId} has signed up.`);
  }

  async logUserSignOut(): Promise<void> {
    await this.log(EventType.USER_SIGNOUT, `User ${this.getCurrentUserId()} has signed out.`);
    
    // Force sync all accumulated logs with the database before logout
    await this.forceSyncNow();
    
    // Clear session start time on sign out to ensure fresh session on next login
    this.sessionStartTime = null;
    localStorage.removeItem('sessionStartTime');
  }

  // Session management
  markSessionStart(): void {
    this.sessionStartTime = Date.now();
    // Persist session start time to localStorage
    localStorage.setItem('sessionStartTime', this.sessionStartTime.toString());
  }

  getSessionStartTime(): number | null {
    return this.sessionStartTime;
  }

  // Data retrieval methods
  async getRecentLogs(limit: number = 50): Promise<LogEntry[]> {
    const allLogs = await databaseService.getRecentLogs(limit * 2); // Get more to account for filtering
    
    // If no session start time is set, return all recent logs
    if (!this.sessionStartTime) {
      return allLogs.slice(0, limit);
    }
    
    // Filter logs from session start time onwards
    const sessionLogs = allLogs.filter(log => log.timestamp >= this.sessionStartTime!);
    
    // Return the most recent logs up to the limit
    return sessionLogs.slice(0, limit);
  }

  async getAllLogs(): Promise<LogEntry[]> {
    const allLogs = await databaseService.getAllLogs();
    
    // If no session start time is set, return all logs
    if (!this.sessionStartTime) {
      return allLogs;
    }
    
    // Filter logs from session start time onwards
    return allLogs.filter(log => log.timestamp >= this.sessionStartTime!);
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
      
      // Call the backend undo API endpoint
      const response = await fetch(`http://localhost:3001/api/logs/${logId}/undo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error(`❌ Backend undo failed:`, errorData);
        await this.logError(`Undo failed: ${errorData.error}`);
        return false;
      }
      
      const result = await response.json();
      
      if (result.success) {
        
        // Create the undo log entry locally with proper formatting
        const undoMessage = result.message;
        if (undoMessage) {
          // Extract the place name from the message using {{}} format
          const placeNameMatch = undoMessage.match(/^(.+?)\s+has been/);
          const placeName = placeNameMatch ? placeNameMatch[1] : '';
          
          // Format the message with {{placeName}}
          const formattedMessage = undoMessage.replace(placeName, `{{${placeName}}}`);
          
          await this.log(
            'undo' as EventType,
            formattedMessage,
            {
              originalLogId: logId,
              placeName: placeName
            }
          );
        }
        
        // Notify subscribers about the change
        this.notifySubscribers();
        
        return true;
      } else {
        console.error(`❌ Undo failed:`, result.message);
        await this.logError(`Undo failed: ${result.message || 'Unknown error'}`);
        return false;
      }
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

  // Configuration methods are no longer needed - user info is retrieved dynamically from localStorage

  // Place data management - deprecated methods kept for compatibility
  // These are no longer used since TableSettingsComp loads places dynamically
  private async loadPlacesFromDB(): Promise<void> {
    try {
      this.places = await placeService.getAllPlaces();
      console.log(`📍 Loaded ${this.places.length} places for ItemComp processing`);
    } catch (error) {
      console.error('❌ Failed to load places from database:', error);
      this.places = [];
    }
  }

  async refreshPlacesData(): Promise<void> {
    // This method is kept for compatibility with existing code
    // but places are now loaded dynamically where needed
    await this.loadPlacesFromDB();
  }

  getPlaceByName(placeName: string): PlaceData | undefined {
    return this.places.find(place => place.name === placeName);
  }

  getAllPlaceNames(): string[] {
    return this.places.map(place => place.name);
  }

  // Clear all local logs and session data
  async clearAllLocalData(): Promise<void> {
    try {
      // Ensure database is initialized before clearing
      if (!databaseService.isInitialized) {
        await databaseService.initialize();
      }
      await databaseService.clearAllLogs();
      this.sessionStartTime = null;
      localStorage.removeItem('sessionStartTime');
    } catch (error) {
      console.error('Failed to clear local data:', error);
    }
  }

  // Delete entire local database (more thorough than clearing)
  async deleteLocalDatabase(): Promise<void> {
    try {
      await databaseService.deleteDatabase();
      this.sessionStartTime = null;
      localStorage.removeItem('sessionStartTime');
    } catch (error) {
      console.error('Failed to delete local database:', error);
    }
  }

  // Clear and notify subscribers (for manual clearing)
  async clearAllLocalDataAndNotify(): Promise<void> {
    await this.clearAllLocalData();
    // Notify subscribers about the change
    this.notifySubscribers();
  }

  // Cleanup
  async destroy(): Promise<void> {
    syncService.destroy();
    await databaseService.close();
    this.logSubscribers.clear();
    this.isInitialized = false;
  }
}

export const loggingService = new LoggingService();

// Expose for debugging in development
if (import.meta.env.DEV) {
  (window as any).clearAllLocalData = () => loggingService.clearAllLocalDataAndNotify();
  (window as any).deleteLocalDatabase = () => loggingService.deleteLocalDatabase();
  (window as any).loggingService = loggingService;
}

// Auto-clear local data on initialization if backend is empty
(async () => {
  try {
    const response = await fetch('http://localhost:3001/api/logs?limit=1');
    const logs = await response.json();
    if (Array.isArray(logs) && logs.length === 0) {
      await loggingService.clearAllLocalDataAndNotify();
    }
  } catch (error) {
  }
})();