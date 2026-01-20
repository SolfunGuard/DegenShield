/**
 * DegenShield - Main SDK Class
 * 
 * This is the primary entry point for the DegenShield SDK.
 * It coordinates transaction simulation, threat detection, custom rules, and webhooks.
 * 
 * Future plans:
 * - Add caching layer for simulation results
 * - Implement batch transaction analysis
 * - Add metrics and analytics tracking
 * - Support for versioned API endpoints
 */

import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { SimulationOptions, SimulationResult, RiskRule, RuleContext } from './simulation/types';
import { TransactionSimulator } from './simulation/simulator';
import { RulesEngine } from './rules/engine';
import { WebhookManager } from './webhooks/manager';
import { analyzeTx, AnalysisReport, AnalysisOptions } from './analysis/analyzer';
import { BUILT_IN_RULES } from './rules/built-in';
import { DEFAULT_API_URL } from './utils/constants';
import { WebhookConfig } from './webhooks/types';

/**
 * Configuration interface for DegenShield initialization
 * 
 * Future plans:
 * - Add support for custom RPC providers
 * - Add retry configuration
 * - Add timeout settings
 */
export interface DegenShieldConfig {
  apiKey?: string; // Optional API key for backend service
  rpcUrl: string; // Solana RPC endpoint
  network?: 'mainnet-beta' | 'testnet' | 'devnet';
  options?: {
    enableWebhooks?: boolean; // Enable webhook notifications
    strictMode?: boolean; // Use stricter security checks
    customRules?: boolean; // Enable built-in custom rules
  };
  customRules?: RiskRule[]; // User-defined security rules
  webhooks?: WebhookConfig; // Webhook configuration
}

/**
 * Main DegenShield class that provides transaction security analysis
 * 
 * Usage:
 * const guard = new DegenShield({ rpcUrl: '...', apiKey: '...' });
 * const result = await guard.simulateTx(transaction);
 * 
 * Future plans:
 * - Add connection pooling for better performance
 * - Implement request batching
 * - Add circuit breaker pattern for API calls
 * - Support for multiple API endpoints with failover
 */
export class DegenShield {
  private connection: Connection; // Solana RPC connection
  private apiKey?: string; // API key for backend service (optional)
  private apiUrl: string; // Backend API URL
  private simulator: TransactionSimulator; // Handles transaction simulation
  private rulesEngine: RulesEngine; // Evaluates custom security rules
  private webhookManager?: WebhookManager; // Manages webhook notifications

  /**
   * Initialize DegenShield with configuration
   * 
   * Sets up RPC connection, simulation engine, rules engine, and webhook manager.
   * 
   * Future plans:
   * - Add validation for configuration
   * - Add connection health checks
   * - Support for custom connection providers
   */
  constructor(config: DegenShieldConfig) {
    // Initialize Solana RPC connection
    // Future: Add connection pooling and retry logic
    this.connection = new Connection(config.rpcUrl, 'confirmed');
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiKey ? DEFAULT_API_URL : '';
    
    // Initialize transaction simulator
    // Future: Add support for multiple simulation strategies
    this.simulator = new TransactionSimulator(
      this.connection,
      this.apiKey,
      this.apiUrl
    );

    // Initialize rules engine with built-in and custom rules
    // Future: Add rule prioritization and conflict resolution
    const rules: RiskRule[] = [];
    if (config.options?.customRules !== false) {
      rules.push(...BUILT_IN_RULES);
    }
    if (config.customRules) {
      rules.push(...config.customRules);
    }
    this.rulesEngine = new RulesEngine(rules);

    // Initialize webhook manager if enabled
    // Future: Add webhook signature verification
    if (config.options?.enableWebhooks && config.webhooks) {
      this.webhookManager = new WebhookManager(config.webhooks);
    }
  }

  /**
   * Simulate a transaction and get comprehensive risk analysis
   * 
   * This is the core method that:
   * 1. Simulates the transaction on Solana
   * 2. Runs threat detection algorithms
   * 3. Evaluates custom security rules
   * 4. Calculates risk score
   * 5. Sends webhook notifications (if enabled)
   * 
   * Future plans:
   * - Add simulation result caching
   * - Implement incremental simulation updates
   * - Add support for partial simulation results
   * - Add performance metrics tracking
   * 
   * @param transaction - Solana transaction to simulate
   * @param options - Simulation configuration options
   * @returns Comprehensive simulation result with threat analysis
   */
  async simulateTx(
    transaction: Transaction,
    options: SimulationOptions = {}
  ): Promise<SimulationResult> {
    const startTime = Date.now();

    // Run simulation using RPC or API backend
    // Future: Add intelligent routing (RPC vs API) based on transaction complexity
    let result = await this.simulator.simulate(transaction, {
      ...options,
      detectAllThreats: options.detectAllThreats ?? true
    });

    // Evaluate custom rules if provided in options
    // Future: Add rule execution order optimization
    if (options.customRules && options.customRules.length > 0) {
      const tempEngine = new RulesEngine(options.customRules);
      const ruleContext: RuleContext = {
        userWallet: options.signerPublicKey || PublicKey.default,
        currentTimestamp: new Date(),
        historicalTransactions: options.historicalTransactions
      };

      const ruleThreats = await tempEngine.evaluateRules(result, ruleContext);
      result.threats.push(...ruleThreats);
    }

    // Evaluate built-in rules
    // Future: Add rule dependency management
    if (options.signerPublicKey) {
      const ruleContext: RuleContext = {
        userWallet: options.signerPublicKey,
        currentTimestamp: new Date()
      };

      const ruleThreats = await this.rulesEngine.evaluateRules(result, ruleContext);
      result.threats.push(...ruleThreats);
    }

    // Recalculate risk score with all threats (both detected and rule-based)
    // Future: Add weighted threat scoring based on severity
    const { calculateRiskScore, getRiskLevel } = await import('./utils/helpers');
    result.riskScore = calculateRiskScore(result.threats);
    result.riskLevel = getRiskLevel(result.riskScore);

    // Send webhook if enabled
    // Future: Add webhook queue for reliable delivery
    if (this.webhookManager && options.signerPublicKey) {
      const blocked = result.riskScore > 70 || result.threats.some(t => t.blockedByDefault);
      try {
        await this.webhookManager.sendWebhook(
          result,
          transaction,
          options.signerPublicKey,
          this.apiKey || '',
          blocked
        );
      } catch (error) {
        console.warn('Webhook failed:', error);
      }
    }

    return result;
  }

  /**
   * Perform static analysis on transaction without running full simulation
   * 
   * This is faster than simulateTx() and good for quick pre-flight checks.
   * It analyzes transaction structure, programs, and instructions without execution.
   * 
   * Future plans:
   * - Add pattern matching for known attack signatures
   * - Implement machine learning-based anomaly detection
   * - Add cross-transaction analysis
   * 
   * @param transaction - Transaction to analyze
   * @param options - Analysis options (scam checking, program verification, etc.)
   * @returns Static analysis report
   */
  async analyzeTx(
    transaction: Transaction,
    options: AnalysisOptions = {}
  ): Promise<AnalysisReport> {
    return analyzeTx(transaction, options);
  }

  /**
   * Add a custom security rule
   * 
   * Rules are evaluated during simulation and can block or warn about transactions.
   * 
   * Future plans:
   * - Add rule validation
   * - Support for async rule conditions
   * - Rule priority system
   * 
   * @param rule - Custom risk rule to add
   */
  addRule(rule: RiskRule): void {
    this.rulesEngine.addRule(rule);
  }

  /**
   * Remove a custom rule by name
   * 
   * Future plans:
   * - Add rule versioning
   * - Support for rule archiving instead of deletion
   * 
   * @param name - Name of the rule to remove
   * @returns True if rule was removed, false if not found
   */
  removeRule(name: string): boolean {
    return this.rulesEngine.removeRule(name);
  }

  /**
   * Update an existing custom rule
   * 
   * Future plans:
   * - Add rule diff tracking
   * - Support for atomic rule updates
   * 
   * @param name - Name of the rule to update
   * @param updates - Partial rule updates
   * @returns True if rule was updated, false if not found
   */
  updateRule(name: string, updates: Partial<RiskRule>): boolean {
    return this.rulesEngine.updateRule(name, updates);
  }

  /**
   * Export all rules as JSON
   * 
   * Useful for backing up rules or sharing rule sets.
   * 
   * Future plans:
   * - Add rule format versioning
   * - Support for encrypted rule exports
   * 
   * @returns Array of all rules
   */
  exportRules(): RiskRule[] {
    return this.rulesEngine.exportRules();
  }

  /**
   * Import rules from array
   * 
   * Useful for restoring rules from backup or loading shared rule sets.
   * 
   * Future plans:
   * - Add rule validation on import
   * - Support for rule merging strategies
   * 
   * @param rules - Array of rules to import
   */
  importRules(rules: RiskRule[]): void {
    this.rulesEngine.importRules(rules);
  }

  /**
   * Get the Solana RPC connection instance
   * 
   * Useful for direct RPC operations outside of simulation.
   * 
   * Future plans:
   * - Add connection health monitoring
   * - Support for connection pooling
   * 
   * @returns Solana Connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }
}
