/**
 * Wallet Drainer Detection
 * 
 * Detects wallet drain attempts by analyzing:
 * - Excessive SOL transfers
 * - Batch token transfer patterns
 * - Account closure attempts
 * 
 * Future plans:
 * - Add ML-based pattern recognition
 * - Implement historical behavior analysis
 * - Add wallet drain signature database
 */

import { PublicKey, Transaction } from '@solana/web3.js';
import { Threat, SimulationResult } from '../simulation/types';
import { THRESHOLDS } from '../utils/constants';

/**
 * Detect wallet drain attempts
 * 
 * Analyzes transaction for patterns that indicate wallet draining:
 * - Large SOL transfers exceeding threshold
 * - Multiple token transfers in single transaction (batch drain)
 * - Account closure instructions
 * 
 * Future plans:
 * - Add ML-based pattern recognition for sophisticated drains
 * - Implement behavioral analysis (unusual transfer patterns)
 * - Add signature database for known drainer addresses
 * 
 * @param transaction - Transaction to analyze
 * @param simulation - Partial simulation result with financial data
 * @param userWallet - User's wallet public key
 * @returns Array of detected wallet drain threats
 */
export function detectWalletDrain(
  transaction: Transaction,
  simulation: Partial<SimulationResult>,
  userWallet: PublicKey
): Threat[] {
  const threats: Threat[] = [];

  // Check for excessive SOL transfers
  // Future: Make threshold configurable per user
  const totalSolTransferred = simulation.financial?.solTransfers?.reduce(
    (sum, transfer) => sum + transfer.amount,
    0
  ) ?? 0;

  if (totalSolTransferred > THRESHOLDS.EXCESSIVE_SOL_TRANSFER) {
    threats.push({
      type: 'WALLET_DRAIN',
      severity: 'CRITICAL',
      title: 'Excessive SOL Transfer Detected',
      description: `Transaction attempts to transfer ${totalSolTransferred / 1e9} SOL, which exceeds safe threshold`,
      affectedAccounts: [userWallet],
      evidence: {
        data: { totalSolTransferred }
      },
      recommendation: 'Review all transfers carefully before approving',
      blockedByDefault: true
    });
  }

  // Check for multiple token transfers (batch drain pattern)
  // Future: Add ML model for pattern recognition
  const tokenTransfers = simulation.financial?.tokenTransfers ?? [];
  const outgoingTransfers = tokenTransfers.filter(
    t => t.from.equals(userWallet)
  );

  if (outgoingTransfers.length > 5) {
    threats.push({
      type: 'WALLET_DRAIN',
      severity: 'HIGH',
      title: 'Batch Token Transfer Pattern',
      description: `Transaction attempts to transfer ${outgoingTransfers.length} different tokens, which matches wallet drain patterns`,
      affectedAccounts: [userWallet, ...outgoingTransfers.map(t => t.to)],
      evidence: {
        data: { transferCount: outgoingTransfers.length }
      },
      recommendation: 'This looks like a batch drain attempt. Do not approve unless you initiated all transfers.',
      blockedByDefault: true
    });
  }

  // Check for account closures (common in drain attacks)
  // Future: Add analysis of which accounts are being closed
  const closedAccounts = simulation.authorityChanges?.filter(
    change => change.authorityType === 'Close'
  ) ?? [];

  if (closedAccounts.length > 0) {
    threats.push({
      type: 'ACCOUNT_CLOSURE',
      severity: 'CRITICAL',
      title: 'Account Closure Detected',
      description: `Transaction will close ${closedAccounts.length} account(s). This is usually irreversible.`,
      affectedAccounts: closedAccounts.map(change => change.account),
      evidence: {
        data: { closedAccounts: closedAccounts.length }
      },
      recommendation: 'Account closures are permanent. Verify this is intentional.',
      blockedByDefault: true
    });
  }

  return threats;
}
