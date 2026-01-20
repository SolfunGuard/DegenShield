/**
 * Constants - Known Programs and Configuration
 * 
 * Defines verified programs, known scam addresses, and thresholds.
 * 
 * Future plans:
 * - Load from API/database for dynamic updates
 * - Add program categorization
 * - Implement threshold configuration per user
 */

import { PublicKey } from '@solana/web3.js';

/**
 * Verified programs database
 * 
 * Contains known safe programs with their metadata:
 * - name: Human-readable program name
 * - verified: Whether program is verified
 * - reputation: Trust score (0-100)
 * 
 * Future plans:
 * - Load from API/database for dynamic updates
 * - Add program categorization (DEX, NFT, Lending, etc.)
 * - Implement program audit trail
 */
export const VERIFIED_PROGRAMS: Record<string, { name: string; verified: boolean; reputation: number }> = {
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': {
    name: 'SPL Token',
    verified: true,
    reputation: 100
  },
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': {
    name: 'Associated Token Program',
    verified: true,
    reputation: 100
  },
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': {
    name: 'Jupiter Aggregator',
    verified: true,
    reputation: 95
  },
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc': {
    name: 'Orca Whirlpool',
    verified: true,
    reputation: 95
  },
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP': {
    name: 'Orca Token Swap',
    verified: true,
    reputation: 95
  },
  'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K': {
    name: 'Magic Eden',
    verified: true,
    reputation: 90
  },
  'CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz': {
    name: 'Tensor',
    verified: true,
    reputation: 90
  }
};

/**
 * Known scam addresses database
 * 
 * Contains addresses flagged as scams.
 * Would be populated from scam database API.
 * 
 * Future plans:
 * - Load from API/database for real-time updates
 * - Add scam type classification
 * - Implement scam address reporting system
 */
export const KNOWN_SCAM_ADDRESSES: Set<string> = new Set();

/**
 * Security thresholds
 * 
 * Configuration values for threat detection:
 * - EXCESSIVE_SOL_TRANSFER: Threshold for large SOL transfers (10 SOL)
 * - HIGH_RISK_SCORE: Score above which transaction is high risk (70)
 * - CRITICAL_RISK_SCORE: Score above which transaction is critical (80)
 * - MAX_SLIPPAGE_PERCENT: Maximum acceptable slippage (5%)
 * 
 * Future plans:
 * - Make thresholds configurable per user
 * - Add dynamic threshold adjustment
 * - Implement threshold learning from user behavior
 */
export const THRESHOLDS = {
  EXCESSIVE_SOL_TRANSFER: 10 * 1e9, // 10 SOL in lamports
  HIGH_RISK_SCORE: 70,
  CRITICAL_RISK_SCORE: 80,
  MAX_SLIPPAGE_PERCENT: 5.0
};

/**
 * Default API endpoint URL
 * 
 * Backend API URL for advanced simulation and threat detection.
 * 
 * Future plans:
 * - Support for multiple API endpoints
 * - Add endpoint failover
 * - Implement endpoint health checking
 */
export const DEFAULT_API_URL = 'https://api.solguard.io/v1';
