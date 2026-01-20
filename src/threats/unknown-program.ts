/**
 * Unknown Program Detection
 * 
 * Detects interactions with unverified programs.
 * Unknown programs may be legitimate but unverified, or malicious contracts.
 * 
 * Future plans:
 * - Add program reputation scoring system
 * - Implement program verification via on-chain metadata
 * - Add community-based program verification
 */

import { PublicKey, Transaction } from '@solana/web3.js';
import { Threat, SimulationResult } from '../simulation/types';
import { isVerifiedProgram, getProgramReputation, getProgramName } from '../utils/helpers';

/**
 * Detect interactions with unknown/unverified programs
 * 
 * Checks all invoked programs against verified program database.
 * Flags programs with low reputation or unverified status.
 * 
 * Future plans:
 * - Implement dynamic program verification via on-chain metadata
 * - Add program audit trail checking
 * - Implement community reputation system
 * 
 * @param transaction - Transaction to analyze
 * @param simulation - Partial simulation result with program information
 * @returns Array of detected unknown program threats
 */
export function detectUnknownPrograms(
  transaction: Transaction,
  simulation: Partial<SimulationResult>
): Threat[] {
  const threats: Threat[] = [];

  const invokedPrograms = simulation.programs?.invoked ?? [];

  for (const program of invokedPrograms) {
    if (!program.verified) {
      const reputation = program.reputation ?? 0;
      
      // Determine severity based on reputation score
      // Future: Make severity thresholds configurable
      let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
      if (reputation < 30) severity = 'HIGH';
      if (reputation === 0) severity = 'CRITICAL';

      threats.push({
        type: 'UNKNOWN_PROGRAM',
        severity,
        title: 'Unverified Program Interaction',
        description: `Transaction interacts with program ${program.programId.toString()} that is not in our verified database`,
        affectedAccounts: [program.programId],
        evidence: {
          programId: program.programId,
          data: {
            programName: program.name,
            reputation: program.reputation
          }
        },
        recommendation: `Program "${program.name || 'Unknown'}" is not verified. Only proceed if you trust this program.`,
        blockedByDefault: reputation < 50
      });
    }

    // Check for suspicious CPI calls
    // Future: Add CPI chain analysis for deeper inspection
    const suspiciousCalls = simulation.programs?.suspiciousCalls?.filter(
      call => call.programId.equals(program.programId)
    ) ?? [];

    for (const call of suspiciousCalls) {
      threats.push({
        type: 'SUSPICIOUS_CPI',
        severity: 'HIGH',
        title: 'Suspicious Cross-Program Invocation',
        description: call.reason || 'Unexpected cross-program invocation detected',
        affectedAccounts: [program.programId],
        evidence: {
          programId: program.programId,
          data: { reason: call.reason }
        },
        recommendation: 'This program is making unexpected calls to other programs. Review carefully.',
        blockedByDefault: false
      });
    }
  }

  return threats;
}
