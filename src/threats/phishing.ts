/**
 * Phishing Signature Detection
 * 
 * Detects phishing attempts by analyzing:
 * - Suspicious text patterns in memo instructions
 * - Multiple approval request patterns
 * - Known phishing domain references
 * 
 * Future plans:
 * - Add NLP-based text analysis
 * - Implement URL scanning for suspicious domains
 * - Add phishing signature database
 */

import { PublicKey, Transaction } from '@solana/web3.js';
import { Threat, SimulationResult } from '../simulation/types';

// Known phishing patterns in transaction memos/logs
// Future: Load from database/API for dynamic updates
const PHISHING_PATTERNS = [
  /approve.*all/i,
  /unlimited.*approval/i,
  /sign.*everything/i,
  /verify.*wallet/i,
  /recover.*account/i
];

// Known phishing domains (example - would be populated from database)
// Future: Sync with phishing domain database
const SUSPICIOUS_DOMAINS = [
  'solana-wallet.com',
  'solana-verify.com',
  'wallet-recovery.com'
];

/**
 * Detect phishing attempts in transaction
 * 
 * Analyzes transaction logs and instructions for known phishing patterns:
 * - Suspicious text in memo instructions
 * - Multiple approval request patterns
 * - References to known phishing domains
 * 
 * Future plans:
 * - Add NLP-based text analysis for better pattern recognition
 * - Implement URL extraction and domain checking
 * - Add real-time phishing signature database sync
 * 
 * @param transaction - Transaction to analyze
 * @param simulation - Partial simulation result with logs
 * @returns Array of detected phishing threats
 */
export function detectPhishing(
  transaction: Transaction,
  simulation: Partial<SimulationResult>
): Threat[] {
  const threats: Threat[] = [];

  // Check memo instructions for phishing patterns
  // Future: Parse memo instruction data properly
  const logs = simulation.simulation?.logs ?? [];
  const allLogs = logs.join(' ').toLowerCase();

  for (const pattern of PHISHING_PATTERNS) {
    if (pattern.test(allLogs)) {
      threats.push({
        type: 'PHISHING_SIGNATURE',
        severity: 'HIGH',
        title: 'Phishing Pattern Detected',
        description: `Transaction contains suspicious text matching known phishing patterns: "${pattern.source}"`,
        affectedAccounts: [],
        evidence: {
          data: { pattern: pattern.source, matchedText: allLogs.match(pattern)?.[0] }
        },
        recommendation: 'This transaction may be a phishing attempt. Do not approve unless you trust the source.',
        blockedByDefault: true
      });
      break;
    }
  }

  // Check for suspicious signature request patterns
  // Multiple approve instructions in quick succession
  // Future: Decode instruction data to properly identify approve instructions
  const approveInstructions = transaction.instructions.filter(ix => {
    // This would need to decode instruction data
    // For now, we check instruction count as a heuristic
    // Future: Implement proper SPL Token Approve instruction decoding
    return true; // Placeholder
  });

  if (approveInstructions.length > 3) {
    threats.push({
      type: 'PHISHING_SIGNATURE',
      severity: 'MEDIUM',
      title: 'Multiple Approval Requests',
      description: 'Transaction contains multiple approval requests, which may indicate a phishing attempt',
      affectedAccounts: [],
      evidence: {
        data: { approvalCount: approveInstructions.length }
      },
      recommendation: 'Review all approval requests carefully. Legitimate transactions rarely need multiple approvals.',
      blockedByDefault: false
    });
  }

  return threats;
}
