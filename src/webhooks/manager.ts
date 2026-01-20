/**
 * Webhook Manager - Real-time Security Event Notifications
 * 
 * Manages webhook delivery for security events.
 * Handles authentication, retries, rate limiting, and filtering.
 * 
 * Future plans:
 * - Add webhook signature verification
 * - Implement webhook queue for reliable delivery
 * - Add webhook delivery analytics
 */

import { WebhookConfig, WebhookPayload } from './types';
import { SimulationResult } from '../simulation/types';
import { generateEventId } from '../utils/helpers';
import { PublicKey, Transaction } from '@solana/web3.js';

/**
 * Manages webhook delivery for security events
 * 
 * Handles:
 * - Webhook payload creation
 * - Endpoint selection based on risk level
 * - Rate limiting
 * - Retry logic with exponential backoff
 * - Filtering based on configuration
 * 
 * Future plans:
 * - Add webhook signature generation for verification
 * - Implement webhook queue for reliable delivery
 * - Add delivery analytics and monitoring
 */
export class WebhookManager {
  private config?: WebhookConfig; // Webhook configuration
  private rateLimitCount: Map<string, number> = new Map(); // Rate limit counters
  private rateLimitReset: Map<string, number> = new Map(); // Rate limit reset timers

  /**
   * Initialize webhook manager with configuration
   * 
   * Future plans:
   * - Add webhook health checking
   * - Support for webhook endpoint discovery
   */
  constructor(config?: WebhookConfig) {
    this.config = config;
  }

  /**
   * Send webhook notification for security event
   * 
   * Creates payload, selects endpoint, checks filters and rate limits,
   * then sends webhook with retry logic.
   * 
   * Future plans:
   * - Add webhook queue for reliable delivery
   * - Implement delivery status tracking
   * - Add webhook batching for multiple events
   * 
   * @param simulation - Simulation result to report
   * @param transaction - Transaction that was analyzed
   * @param userWallet - User's wallet address
   * @param apiKey - API key (last 4 chars only for security)
   * @param blocked - Whether transaction was blocked
   */
  async sendWebhook(
    simulation: SimulationResult,
    transaction: Transaction,
    userWallet: PublicKey,
    apiKey: string,
    blocked: boolean
  ): Promise<void> {
    if (!this.config) return;

    // Create webhook payload
    // Future: Add payload compression for large simulations
    const payload = this.createPayload(
      simulation,
      transaction,
      userWallet,
      apiKey,
      blocked
    );

    // Determine which endpoint to use based on risk level
    // Future: Support for multiple endpoints per risk level
    const endpoint = this.getEndpoint(simulation, blocked);
    if (!endpoint) return;

    // Check rate limits
    // Future: Add distributed rate limiting for multiple instances
    if (!this.checkRateLimit(endpoint)) {
      console.warn(`Rate limit exceeded for webhook: ${endpoint}`);
      return;
    }

    // Check filters (min risk score, threat types, etc.)
    // Future: Add more sophisticated filtering logic
    if (!this.passesFilters(simulation, blocked)) {
      return;
    }

    // Send webhook with retry logic
    // Future: Add webhook queue for offline scenarios
    await this.sendRequest(endpoint, payload);
  }

  /**
   * Create webhook payload from simulation result
   * 
   * Formats simulation data into webhook payload structure.
   * 
   * Future plans:
   * - Add payload compression
   * - Implement payload versioning
   * - Add optional data fields based on configuration
   * 
   * @param simulation - Simulation result
   * @param transaction - Transaction
   * @param userWallet - User wallet
   * @param apiKey - API key
   * @param blocked - Blocked status
   * @returns Formatted webhook payload
   */
  private createPayload(
    simulation: SimulationResult,
    transaction: Transaction,
    userWallet: PublicKey,
    apiKey: string,
    blocked: boolean
  ): WebhookPayload {
    return {
      event: {
        id: generateEventId(), // Unique event ID for tracking
        type: blocked ? 'TRANSACTION_BLOCKED' : 'TRANSACTION_ANALYZED',
        timestamp: new Date().toISOString(),
        version: '1.0' // Payload version for compatibility
      },
      context: {
        apiKey: apiKey.slice(-4), // Last 4 chars only for security
        walletAddress: userWallet.toString()
      },
      transaction: {
        recentBlockhash: transaction.recentBlockhash || '',
        numInstructions: transaction.instructions.length,
        feePayer: transaction.feePayer?.toString() || '',
        signers: transaction.signatures.map(sig => sig.toString())
      },
      analysis: {
        riskScore: simulation.riskScore,
        riskLevel: simulation.riskLevel,
        threats: simulation.threats.map(t => ({
          type: t.type,
          severity: t.severity,
          title: t.title,
          description: t.description,
          affectedAccounts: t.affectedAccounts.map(a => a.toString())
        })),
        warnings: simulation.warnings.map(w => ({
          message: w.message,
          severity: w.severity
        }))
      },
      financial: {
        totalValueAtRisk: simulation.financial.totalValueAtRisk,
        solTransferred: simulation.financial.solTransfers.reduce(
          (sum, t) => sum + t.amount,
          0
        ),
        tokensTransferred: simulation.financial.tokenTransfers.map(t => ({
          mint: t.mint.toString(),
          amount: t.amount,
          usdValue: undefined // Future: Fetch from price oracle
        }))
      },
      action: {
        blocked,
        reason: blocked ? simulation.threats[0]?.description : undefined,
        userNotified: false
      }
    };
  }

  /**
   * Select webhook endpoint based on risk level
   * 
   * Routes to appropriate endpoint based on risk level or blocked status.
   * 
   * Future plans:
   * - Support for multiple endpoints per risk level
   * - Add endpoint health checking
   * 
   * @param simulation - Simulation result
   * @param blocked - Blocked status
   * @returns Webhook endpoint URL or undefined
   */
  private getEndpoint(simulation: SimulationResult, blocked: boolean): string | undefined {
    if (!this.config) return undefined;

    if (blocked && this.config.endpoints.onBlocked) {
      return this.config.endpoints.onBlocked;
    }

    switch (simulation.riskLevel) {
      case 'CRITICAL':
        return this.config.endpoints.onCritical;
      case 'HIGH':
        return this.config.endpoints.onHighRisk;
      case 'MEDIUM':
        return this.config.endpoints.onMediumRisk;
      case 'LOW':
        return this.config.endpoints.onLowRisk;
      default:
        return this.config.endpoints.onSuccess;
    }
  }

  /**
   * Check if webhook request passes rate limits
   * 
   * Enforces per-minute and per-hour rate limits per endpoint.
   * 
   * Future plans:
   * - Add distributed rate limiting for multiple instances
   * - Implement sliding window rate limiting
   * 
   * @param endpoint - Webhook endpoint URL
   * @returns True if within rate limits, false otherwise
   */
  private checkRateLimit(endpoint: string): boolean {
    if (!this.config?.rateLimit) return true;

    const now = Date.now();
    const minuteKey = `${endpoint}:minute:${Math.floor(now / 60000)}`;
    const hourKey = `${endpoint}:hour:${Math.floor(now / 3600000)}`;

    // Check per-minute limit
    // Future: Use sliding window instead of fixed windows
    const minuteCount = this.rateLimitCount.get(minuteKey) || 0;
    if (minuteCount >= this.config.rateLimit.maxPerMinute) {
      return false;
    }

    // Check per-hour limit
    const hourCount = this.rateLimitCount.get(hourKey) || 0;
    if (hourCount >= this.config.rateLimit.maxPerHour) {
      return false;
    }

    // Increment counters
    this.rateLimitCount.set(minuteKey, minuteCount + 1);
    this.rateLimitCount.set(hourKey, hourCount + 1);

    return true;
  }

  /**
   * Check if webhook passes configured filters
   * 
   * Filters based on risk score, threat types, and blocked status.
   * 
   * Future plans:
   * - Add more sophisticated filtering logic
   * - Support for regex-based threat filtering
   * 
   * @param simulation - Simulation result
   * @param blocked - Blocked status
   * @returns True if passes filters, false otherwise
   */
  private passesFilters(simulation: SimulationResult, blocked: boolean): boolean {
    if (!this.config?.filters) return true;

    const filters = this.config.filters;

    // Check if only blocked transactions should be sent
    if (filters.onlyBlocked && !blocked) {
      return false;
    }

    // Check minimum risk score
    if (filters.minRiskScore && simulation.riskScore < filters.minRiskScore) {
      return false;
    }

    // Check threat types filter
    if (filters.threatTypes && filters.threatTypes.length > 0) {
      const hasMatchingThreat = simulation.threats.some(t =>
        filters.threatTypes!.includes(t.type)
      );
      if (!hasMatchingThreat) {
        return false;
      }
    }

    return true;
  }

  /**
   * Send webhook HTTP request with retry logic
   * 
   * Sends POST request with authentication, handles retries with
   * exponential backoff, and implements timeout.
   * 
   * Future plans:
   * - Add webhook signature for verification
   * - Implement request batching
   * - Add delivery status tracking
   * 
   * @param endpoint - Webhook endpoint URL
   * @param payload - Webhook payload to send
   */
  private async sendRequest(endpoint: string, payload: WebhookPayload): Promise<void> {
    // Prepare headers with authentication
    // Future: Add webhook signature generation
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config?.auth?.headers
    };

    // Add authentication based on config
    // Future: Support for custom auth schemes
    if (this.config?.auth) {
      switch (this.config.auth.type) {
        case 'bearer':
          if (this.config.auth.token) {
            headers['Authorization'] = `Bearer ${this.config.auth.token}`;
          }
          break;
        case 'basic':
          if (this.config.auth.username && this.config.auth.password) {
            const credentials = Buffer.from(
              `${this.config.auth.username}:${this.config.auth.password}`
            ).toString('base64');
            headers['Authorization'] = `Basic ${credentials}`;
          }
          break;
      }
    }

    // Retry configuration
    const maxAttempts = this.config?.retry?.maxAttempts || 1;
    const backoffMs = this.config?.retry?.backoffMs || 1000;
    const timeout = this.config?.retry?.timeout || 5000;

    // Retry loop with exponential backoff
    // Future: Add circuit breaker pattern
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          return; // Success
        }

        // If not last attempt, wait before retry with exponential backoff
        // Future: Add jitter to backoff for distributed systems
        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, backoffMs * (attempt + 1)));
        }
      } catch (error: any) {
        // Last attempt failed - log and throw
        // Future: Add error tracking and alerting
        if (attempt === maxAttempts - 1) {
          console.error(`Webhook failed after ${maxAttempts} attempts:`, error);
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, backoffMs * (attempt + 1)));
      }
    }
  }
}
