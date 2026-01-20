/**
 * Delegate Hijacking Detection
 * 
 * Detects unauthorized delegate changes in token accounts.
 * Delegates can transfer tokens on behalf of the owner, making this a critical security issue.
 * 
 * Future plans:
 * - Add delegate approval amount analysis
 * - Implement delegate expiration checking
 * - Add known malicious delegate address database
 */

import { PublicKey, Transaction } from '@solana/web3.js';
import { Threat, SimulationResult } from '../simulation/types';

/**
 * Detect delegate hijacking attempts
 * 
 * Analyzes authority changes to detect unauthorized delegate modifications:
 * - Delegate being set to unknown addresses
 * - Unlimited approval amounts
 * - Delegates set to non-user addresses
 * 
 * Future plans:
 * - Parse SPL Token Approve instruction to get exact approval amount
 * - Add delegate expiration date checking
 * - Implement delegate whitelist/blacklist
 * 
 * @param transaction - Transaction to analyze
 * @param simulation - Partial simulation result with authority changes
 * @param userWallet - User's wallet public key
 * @returns Array of detected delegate hijack threats
 */
export function detectDelegateHijack(
  transaction: Transaction,
  simulation: Partial<SimulationResult>,
  userWallet: PublicKey
): Threat[] {
  const threats: Threat[] = [];

  // Check for delegate changes in authority changes
  // Future: Parse SPL Token Approve instruction directly
  const delegateChanges = simulation.authorityChanges?.filter(
    change => change.authorityType === 'Delegate'
  ) ?? [];

  for (const change of delegateChanges) {
    // Check if delegate is being set to an unknown address
    // Future: Check against whitelist of trusted delegates
    if (change.newAuthority && !change.newAuthority.equals(userWallet)) {
      threats.push({
        type: 'DELEGATE_HIJACK',
        severity: 'CRITICAL',
        title: 'Unauthorized Delegate Change',
        description: `Transaction attempts to change token account delegate to ${change.newAuthority.toString()}, allowing unauthorized transfers`,
        affectedAccounts: [change.account, change.newAuthority],
        evidence: {
          programId: change.account,
          data: {
            oldDelegate: change.oldAuthority?.toString(),
            newDelegate: change.newAuthority.toString()
          }
        },
        recommendation: 'Delegate changes allow others to transfer your tokens. Only approve if you trust the new delegate.',
        blockedByDefault: true
      });
    }

    // Check for unlimited approval amounts
    // Future: Parse instruction data to get exact approval amount
    // Future: Add configurable approval limits
    if (change.requiresAttention) {
      threats.push({
        type: 'DELEGATE_HIJACK',
        severity: 'HIGH',
        title: 'Suspicious Delegate Change',
        description: 'Transaction changes token account delegate with potentially unlimited approval',
        affectedAccounts: [change.account],
        evidence: {
          programId: change.account
        },
        recommendation: 'Verify the delegate address and approval amount before proceeding.',
        blockedByDefault: false
      });
    }
  }

  return threats;
}
