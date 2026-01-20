/**
 * Program Analysis
 * 
 * Analyzes programs involved in transactions.
 * Verifies programs against known verified program database.
 * 
 * Future plans:
 * - Add program category detection (DEX, NFT, Lending, etc.)
 * - Implement on-chain program metadata verification
 * - Add community reputation system
 */

import { PublicKey, Transaction } from '@solana/web3.js';
import { ProgramInvocation, CPICall, SuspiciousCall } from '../simulation/types';
import { isVerifiedProgram, getProgramReputation, getProgramName } from '../utils/helpers';

/**
 * Analyze all programs involved in a transaction
 * 
 * Extracts program IDs from instructions and verifies them against
 * verified program database. Also detects suspicious CPI patterns.
 * 
 * Future plans:
 * - Parse instruction data to find actual CPI calls
 * - Add program category classification
 * - Implement program audit trail checking
 * 
 * @param transaction - Transaction to analyze
 * @returns Program analysis with invoked programs, CPI calls, and suspicious patterns
 */
export function analyzePrograms(transaction: Transaction): {
  invoked: ProgramInvocation[];
  cpiCalls: CPICall[];
  suspiciousCalls: SuspiciousCall[];
} {
  const invoked: ProgramInvocation[] = [];
  const cpiCalls: CPICall[] = [];
  const suspiciousCalls: SuspiciousCall[] = [];

  // Extract all program IDs from instructions
  // Future: Add support for versioned transactions
  const programIds = new Set<string>();
  
  for (const instruction of transaction.instructions) {
    const programId = instruction.programId.toString();
    programIds.add(programId);
  }

  // Create program invocations with verification status
  // Future: Add program metadata fetching from on-chain
  for (const programIdStr of programIds) {
    const programId = new PublicKey(programIdStr);
    const verified = isVerifiedProgram(programId);
    const reputation = getProgramReputation(programId);
    const name = getProgramName(programId);

    invoked.push({
      programId,
      name,
      verified,
      reputation
    });

    // Check for suspicious patterns
    // Future: Add ML-based suspicious pattern detection
    if (!verified && reputation < 50) {
      suspiciousCalls.push({
        programId,
        reason: `Unverified program with low reputation (${reputation}/100)`
      });
    }
  }

  // Analyze CPI calls (would need to parse instruction data)
  // Future: Decode instruction data to find actual CPI calls
  // Future: Add CPI chain analysis for deeper inspection
  // For now, we create placeholder CPI analysis
  // In real implementation, this would parse instruction data to find CPI calls

  return {
    invoked,
    cpiCalls,
    suspiciousCalls
  };
}
