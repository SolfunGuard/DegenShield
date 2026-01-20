/**
 * ThreatDetector - Main threat detection coordinator
 * 
 * This class coordinates all threat detection algorithms.
 * It runs multiple detectors in parallel and deduplicates results.
 * 
 * Future plans:
 * - Add parallel execution for better performance
 * - Implement threat confidence scoring
 * - Add threat correlation (linking related threats)
 * - Implement ML-based threat detection
 */

import { PublicKey, Transaction } from '@solana/web3.js';
import { Threat, SimulationResult } from '../simulation/types';
import { detectWalletDrain } from './wallet-drainer';
import { detectPhishing } from './phishing';
import { detectDelegateHijack } from './delegate-hijack';
import { detectUnknownPrograms } from './unknown-program';

/**
 * Main threat detection engine that coordinates all detection algorithms
 * 
 * Future plans:
 * - Add configurable detection pipelines
 * - Implement threat prioritization
 * - Add detection result caching
 */
export class ThreatDetector {
  /**
   * Run all threat detection algorithms on a transaction
   * 
   * Executes all detectors (wallet drain, phishing, delegate hijack, unknown programs).
   * Returns deduplicated list of threats.
   * 
   * Future plans:
   * - Add parallel execution for better performance
   * - Implement threat confidence scoring
   * - Add threat correlation analysis
   * 
   * @param transaction - Transaction to analyze
   * @param simulation - Partial simulation result with logs and financial data
   * @param userWallet - User's wallet public key
   * @returns Array of detected threats
   */
  async detectAllThreats(
    transaction: Transaction,
    simulation: Partial<SimulationResult>,
    userWallet: PublicKey
  ): Promise<Threat[]> {
    const allThreats: Threat[] = [];

    // Run all detection algorithms
    // Future: Execute detectors in parallel for better performance
    allThreats.push(...detectWalletDrain(transaction, simulation, userWallet));
    allThreats.push(...detectPhishing(transaction, simulation));
    allThreats.push(...detectDelegateHijack(transaction, simulation, userWallet));
    allThreats.push(...detectUnknownPrograms(transaction, simulation));

    // Remove duplicates (same type and affected account)
    // Future: Add threat merging for similar threats
    const uniqueThreats = this.deduplicateThreats(allThreats);

    return uniqueThreats;
  }

  /**
   * Remove duplicate threats based on type and affected accounts
   * 
   * Prevents the same threat from being reported multiple times.
   * 
   * Future plans:
   * - Add threat similarity scoring
   * - Implement threat merging for related threats
   * 
   * @param threats - Array of threats to deduplicate
   * @returns Array of unique threats
   */
  private deduplicateThreats(threats: Threat[]): Threat[] {
    const seen = new Set<string>();
    const unique: Threat[] = [];

    for (const threat of threats) {
      const key = `${threat.type}-${threat.affectedAccounts.map(a => a.toString()).join(',')}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(threat);
      }
    }

    return unique;
  }
}
