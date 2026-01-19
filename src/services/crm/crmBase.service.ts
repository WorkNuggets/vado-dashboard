/**
 * CRM Integration Base Service
 * Defines the abstract interface for all CRM provider integrations
 */

/**
 * Result of a sync operation
 */
export interface SyncResult {
  success: boolean;
  recordsSynced: number;
  errors?: string[];
  timestamp: Date;
}

/**
 * CRM connection status
 */
export interface CRMStatus {
  isConnected: boolean;
  provider: string;
  lastSync?: Date;
  nextScheduledSync?: Date;
  syncStatus?: "idle" | "syncing" | "error";
  errorMessage?: string;
}

/**
 * Credentials for CRM authentication
 * Specific structure will vary by provider
 */
export interface CRMCredentials {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  domain?: string;
  userId?: string;
  [key: string]: any; // Allow provider-specific fields
}

/**
 * Abstract CRM Provider Interface
 * All CRM integrations must implement this interface
 */
export interface CRMProvider {
  /**
   * Provider name (e.g., "Chime", "Follow Up Boss", "Custom")
   */
  name: string;

  /**
   * Connect to the CRM using provided credentials
   * @param credentials - Provider-specific authentication credentials
   * @returns Promise resolving to true if connection successful
   */
  connect(credentials: CRMCredentials): Promise<boolean>;

  /**
   * Disconnect from the CRM and clear credentials
   * @returns Promise resolving when disconnected
   */
  disconnect(): Promise<void>;

  /**
   * Sync properties from CRM to local database
   * @returns Promise resolving to sync result
   */
  syncProperties(): Promise<SyncResult>;

  /**
   * Sync contacts from CRM to local database
   * @returns Promise resolving to sync result
   */
  syncContacts(): Promise<SyncResult>;

  /**
   * Get current connection and sync status
   * @returns Promise resolving to current CRM status
   */
  getStatus(): Promise<CRMStatus>;
}

/**
 * Base CRM Provider class with common functionality
 * Concrete providers can extend this class
 */
export abstract class BaseCRMProvider implements CRMProvider {
  abstract name: string;
  protected credentials: CRMCredentials | null = null;
  protected isConnectedFlag = false;

  /**
   * Connect to the CRM
   * Override this method to implement provider-specific authentication
   */
  async connect(credentials: CRMCredentials): Promise<boolean> {
    this.credentials = credentials;
    this.isConnectedFlag = true;
    return true;
  }

  /**
   * Disconnect from the CRM
   */
  async disconnect(): Promise<void> {
    this.credentials = null;
    this.isConnectedFlag = false;
  }

  /**
   * Check if provider is connected
   */
  isConnected(): boolean {
    return this.isConnectedFlag && this.credentials !== null;
  }

  /**
   * Get connection status
   * Override to include provider-specific status details
   */
  async getStatus(): Promise<CRMStatus> {
    return {
      isConnected: this.isConnected(),
      provider: this.name,
      syncStatus: "idle",
    };
  }

  /**
   * Abstract methods to be implemented by concrete providers
   */
  abstract syncProperties(): Promise<SyncResult>;
  abstract syncContacts(): Promise<SyncResult>;
}

/**
 * CRM Provider Factory
 * Creates CRM provider instances based on provider ID
 */
export class CRMProviderFactory {
  private static providers = new Map<string, () => CRMProvider>();

  /**
   * Register a CRM provider
   * @param providerId - Unique identifier for the provider
   * @param factory - Factory function that creates provider instance
   */
  static register(providerId: string, factory: () => CRMProvider): void {
    this.providers.set(providerId, factory);
  }

  /**
   * Create a CRM provider instance
   * @param providerId - Provider identifier
   * @returns CRM provider instance or null if not found
   */
  static create(providerId: string): CRMProvider | null {
    const factory = this.providers.get(providerId);
    return factory ? factory() : null;
  }

  /**
   * Get list of registered provider IDs
   */
  static getRegisteredProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

/**
 * Example: Custom CRM Provider Implementation
 * This demonstrates how to create a concrete provider
 */
export class CustomCRMProvider extends BaseCRMProvider {
  name = "Custom CRM";

  /**
   * Sync properties from custom CRM
   */
  async syncProperties(): Promise<SyncResult> {
    if (!this.isConnected()) {
      return {
        success: false,
        recordsSynced: 0,
        errors: ["Not connected to CRM"],
        timestamp: new Date(),
      };
    }

    // TODO: Implement actual sync logic
    // This is a placeholder for demonstration
    return {
      success: true,
      recordsSynced: 0,
      timestamp: new Date(),
    };
  }

  /**
   * Sync contacts from custom CRM
   */
  async syncContacts(): Promise<SyncResult> {
    if (!this.isConnected()) {
      return {
        success: false,
        recordsSynced: 0,
        errors: ["Not connected to CRM"],
        timestamp: new Date(),
      };
    }

    // TODO: Implement actual sync logic
    // This is a placeholder for demonstration
    return {
      success: true,
      recordsSynced: 0,
      timestamp: new Date(),
    };
  }
}

// Register the custom provider
CRMProviderFactory.register("custom", () => new CustomCRMProvider());
