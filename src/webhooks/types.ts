/**
 * Webhook Types - Type Definitions
 * 
 * Type definitions for webhook configuration and payloads.
 * 
 * Future plans:
 * - Add more webhook event types
 * - Support for custom webhook payload formats
 */

import { SimulationResult } from '../simulation/types';
import { PublicKey } from '@solana/web3.js';

/**
 * Webhook configuration
 * 
 * Defines webhook endpoints, authentication, retry logic, filtering, and rate limiting.
 * 
 * Future plans:
 * - Add webhook signature configuration
 * - Support for multiple webhook endpoints per event type
 */
export interface WebhookConfig {
  endpoints: {
    onLowRisk?: string; // Webhook URL for low-risk transactions
    onMediumRisk?: string; // Webhook URL for medium-risk transactions
    onHighRisk?: string; // Webhook URL for high-risk transactions
    onCritical?: string; // Webhook URL for critical-risk transactions
    onBlocked?: string; // Webhook URL for blocked transactions
    onSuccess?: string; // Webhook URL for successful transactions
  };
  auth?: {
    type: 'bearer' | 'basic' | 'custom'; // Authentication type
    token?: string; // Bearer token
    username?: string; // Basic auth username
    password?: string; // Basic auth password
    headers?: Record<string, string>; // Custom headers
  };
  retry?: {
    maxAttempts: number; // Maximum retry attempts
    backoffMs: number; // Backoff delay in milliseconds
    timeout: number; // Request timeout in milliseconds
  };
  filters?: {
    minRiskScore?: number; // Minimum risk score to trigger webhook
    threatTypes?: string[]; // Only send for specific threat types
    onlyBlocked?: boolean; // Only send for blocked transactions
  };
  rateLimit?: {
    maxPerMinute: number; // Maximum webhooks per minute
    maxPerHour: number; // Maximum webhooks per hour
  };
}

/**
 * Webhook payload structure
 * 
 * Standard payload format sent to webhook endpoints.
 * Contains event information, transaction details, analysis results, and action taken.
 * 
 * Future plans:
 * - Add payload versioning
 * - Support for custom payload formats
 */
export interface WebhookPayload {
  event: {
    id: string; // Unique event ID
    type: 'TRANSACTION_ANALYZED' | 'TRANSACTION_BLOCKED' | 'THREAT_DETECTED'; // Event type
    timestamp: string; // ISO timestamp
    version: string; // Payload version
  };
  context: {
    apiKey: string; // API key (last 4 chars only for security)
    appId?: string; // Application ID (optional)
    userId?: string; // User ID (optional)
    walletAddress: string; // User's wallet address
  };
  transaction: {
    signature?: string; // Transaction signature (if available)
    slot?: number; // Transaction slot (if available)
    recentBlockhash: string; // Transaction blockhash
    numInstructions: number; // Number of instructions
    feePayer: string; // Fee payer address
    signers: string[]; // Signer addresses
  };
  analysis: {
    riskScore: number; // Risk score (0-100)
    riskLevel: string; // Risk level (LOW, MEDIUM, HIGH, CRITICAL)
    threats: Array<{
      type: string; // Threat type
      severity: string; // Threat severity
      title: string; // Threat title
      description: string; // Threat description
      affectedAccounts: string[]; // Affected account addresses
    }>;
    warnings: Array<{
      message: string; // Warning message
      severity: string; // Warning severity
    }>;
  };
  financial: {
    totalValueAtRisk: number; // Total USD value at risk
    solTransferred: number; // Total SOL transferred (in lamports)
    tokensTransferred: Array<{
      mint: string; // Token mint address
      amount: number; // Token amount
      symbol?: string; // Token symbol (optional)
      usdValue?: number; // USD value (optional)
    }>;
  };
  action: {
    blocked: boolean; // Whether transaction was blocked
    reason?: string; // Block reason (if blocked)
    userNotified: boolean; // Whether user was notified
  };
}
