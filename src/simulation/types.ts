/**
 * Simulation Types - Type Definitions
 * 
 * Core type definitions for transaction simulation and analysis.
 * Defines interfaces for simulation options, results, threats, and rules.
 * 
 * Future plans:
 * - Add more detailed type definitions as needed
 * - Add type validation utilities
 */

import { PublicKey, Transaction } from '@solana/web3.js';

/**
 * Options for transaction simulation
 * 
 * Configuration for how simulation should be performed.
 * 
 * Future plans:
 * - Add more granular control options
 * - Support for simulation presets
 */
export interface SimulationOptions {
  signerPublicKey?: PublicKey; // Wallet address that will sign transaction
  includeFullLogs?: boolean; // Whether to include all simulation logs
  detectAllThreats?: boolean; // Whether to run all threat detection algorithms
  customRules?: RiskRule[]; // Custom rules to evaluate for this simulation
  skipCache?: boolean; // Skip cached simulation results
  commitment?: 'processed' | 'confirmed' | 'finalized'; // RPC commitment level
  historicalTransactions?: Transaction[]; // Historical transactions for context
}

/**
 * Result of transaction simulation
 * 
 * Contains comprehensive analysis of transaction including:
 * - Risk assessment (score and level)
 * - Detected threats and warnings
 * - Simulation execution details
 * - Financial analysis
 * - Program analysis
 * 
 * Future plans:
 * - Add more detailed analysis fields
 * - Support for partial results
 */
export interface SimulationResult {
  riskScore: number; // Risk score 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; // Risk level category
  threats: Threat[]; // Detected security threats
  warnings: Warning[]; // Non-critical warnings
  simulation: {
    success: boolean; // Whether simulation succeeded
    err: string | null; // Error message if simulation failed
    logs: string[]; // Simulation execution logs
    unitsConsumed: number; // Compute units consumed
    accountsRead: PublicKey[]; // Accounts read during simulation
    accountsWritten: PublicKey[]; // Accounts written during simulation
    returnData: {
      programId: PublicKey;
      data: Buffer;
    } | null; // Program return data
  };
  financial: {
    gasEstimate: number; // Estimated transaction fee
    solTransfers: SolTransfer[]; // SOL movements
    tokenTransfers: TokenTransfer[]; // SPL token movements
    nftTransfers: NFTTransfer[]; // NFT ownership changes
    totalValueAtRisk: number; // Total USD value at risk
  };
  programs: {
    invoked: ProgramInvocation[]; // Programs involved in transaction
    cpiCalls: CPICall[]; // Cross-program invocations
    suspiciousCalls: SuspiciousCall[]; // Suspicious program calls
  };
  authorityChanges: AuthorityChange[]; // Authority modifications
  timestamp: Date; // When simulation was performed
  simulationDuration: number; // Simulation duration in milliseconds
  cacheHit: boolean; // Whether result was from cache
}

/**
 * Threat types that can be detected
 * 
 * Comprehensive list of security threats.
 * 
 * Future plans:
 * - Add more threat types as new attack vectors emerge
 * - Support for custom threat types
 */
export type ThreatType =
  | 'WALLET_DRAIN'
  | 'DELEGATE_HIJACK'
  | 'FREEZE_AUTHORITY'
  | 'MINT_AUTHORITY_CHANGE'
  | 'SUSPICIOUS_CPI'
  | 'UNKNOWN_PROGRAM'
  | 'EXCESSIVE_SOL_TRANSFER'
  | 'ACCOUNT_CLOSURE'
  | 'UPGRADE_AUTHORITY_CHANGE'
  | 'METADATA_MANIPULATION'
  | 'SLIPPAGE_EXPLOIT'
  | 'PHISHING_SIGNATURE'
  | 'CUSTOM_RULE_VIOLATION';

/**
 * Detected security threat
 * 
 * Represents a security issue found in transaction.
 * 
 * Future plans:
 * - Add threat confidence scoring
 * - Support for threat correlation
 */
export interface Threat {
  type: ThreatType; // Type of threat
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; // Threat severity
  title: string; // Human-readable threat title
  description: string; // Detailed threat description
  affectedAccounts: PublicKey[]; // Accounts affected by threat
  evidence: {
    programId?: PublicKey; // Program ID if applicable
    instruction?: string; // Instruction that caused threat
    data?: any; // Additional evidence data
  };
  recommendation: string; // Recommended action for user
  blockedByDefault: boolean; // Whether threat blocks transaction by default
}

/**
 * Non-critical warning
 * 
 * Represents a potential issue that doesn't block transaction.
 * 
 * Future plans:
 * - Add warning categories
 * - Support for dismissible warnings
 */
export interface Warning {
  message: string; // Warning message
  severity: 'LOW' | 'MEDIUM' | 'HIGH'; // Warning severity
}

/**
 * SOL transfer information
 * 
 * Represents a SOL movement in transaction.
 */
export interface SolTransfer {
  from: PublicKey; // Sender address
  to: PublicKey; // Receiver address
  amount: number; // Amount in lamports
}

/**
 * Token transfer information
 * 
 * Represents an SPL token movement in transaction.
 * 
 * Future plans:
 * - Add USD value calculation
 */
export interface TokenTransfer {
  mint: PublicKey; // Token mint address
  from: PublicKey; // Sender address
  to: PublicKey; // Receiver address
  amount: number; // Token amount
  decimals: number; // Token decimals
}

/**
 * NFT transfer information
 * 
 * Represents an NFT ownership change in transaction.
 */
export interface NFTTransfer {
  mint: PublicKey; // NFT mint address
  from: PublicKey; // Previous owner
  to: PublicKey; // New owner
  tokenAccount: PublicKey; // Token account address
}

/**
 * Program invocation information
 * 
 * Represents a program called in transaction.
 * 
 * Future plans:
 * - Add program version information
 */
export interface ProgramInvocation {
  programId: PublicKey; // Program address
  name: string; // Program name
  verified: boolean; // Whether program is verified
  reputation?: number; // Program reputation score (0-100)
}

/**
 * Cross-program invocation (CPI) information
 * 
 * Represents a program calling another program.
 * 
 * Future plans:
 * - Add CPI chain analysis
 */
export interface CPICall {
  from: PublicKey; // Calling program
  to: PublicKey; // Called program
  instructionIndex: number; // Instruction index
  suspicious: boolean; // Whether CPI is suspicious
  reason?: string; // Reason if suspicious
}

/**
 * Suspicious program call information
 * 
 * Represents a suspicious interaction with a program.
 */
export interface SuspiciousCall {
  programId: PublicKey; // Program address
  reason: string; // Reason for suspicion
}

/**
 * Authority change information
 * 
 * Represents a change in account authority (mint, freeze, etc.).
 */
export interface AuthorityChange {
  account: PublicKey; // Account affected
  authorityType: 'Mint' | 'Freeze' | 'Owner' | 'Close' | 'Upgrade' | 'Delegate'; // Authority type
  oldAuthority: PublicKey | null; // Previous authority
  newAuthority: PublicKey | null; // New authority
  requiresAttention: boolean; // Whether change requires user attention
}

/**
 * Custom security rule
 * 
 * User-defined security policy that can block or warn about transactions.
 * 
 * Future plans:
 * - Add rule versioning
 * - Support for rule templates
 */
export interface RiskRule {
  name: string; // Unique rule name
  description?: string; // Rule description
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; // Rule severity
  condition: (simulation: SimulationResult, context: RuleContext) => boolean | Promise<boolean>; // Rule condition
  message: string | ((simulation: SimulationResult) => string); // Rule message (static or dynamic)
  blocking?: boolean; // Whether rule blocks transaction
  applicableTo?: string[]; // Program IDs this rule applies to (optional)
  metadata?: Record<string, any>; // Additional rule metadata
}

/**
 * Context for rule evaluation
 * 
 * Provides context to rules for better decision making.
 * 
 * Future plans:
 * - Add more context fields
 * - Support for user-specific context
 */
export interface RuleContext {
  userWallet: PublicKey; // User's wallet address
  currentTimestamp: Date; // Current timestamp
  historicalTransactions?: Transaction[]; // Historical transactions for analysis
  customData?: any; // Custom context data
}
