/**
 * Utility Helper Functions
 * 
 * Common utility functions used throughout the SDK:
 * - Program verification
 * - Risk score calculation
 * - Event ID generation
 * 
 * Future plans:
 * - Add more utility functions as needed
 * - Optimize for performance
 */

import { PublicKey } from '@solana/web3.js';
import { VERIFIED_PROGRAMS } from './constants';

/**
 * Check if a program is verified in our database
 * 
 * Verified programs are known safe programs (SPL Token, Jupiter, etc.).
 * 
 * Future plans:
 * - Add on-chain verification support
 * - Implement dynamic verification updates
 * 
 * @param programId - Program public key to check
 * @returns True if program is verified
 */
export function isVerifiedProgram(programId: PublicKey): boolean {
  const program = VERIFIED_PROGRAMS[programId.toString()];
  return program?.verified === true;
}

/**
 * Get program reputation score (0-100)
 * 
 * Higher reputation = more trusted program.
 * 
 * Future plans:
 * - Implement dynamic reputation calculation
 * - Add community-based reputation
 * 
 * @param programId - Program public key
 * @returns Reputation score (0-100)
 */
export function getProgramReputation(programId: PublicKey): number {
  const program = VERIFIED_PROGRAMS[programId.toString()];
  return program?.reputation ?? 0;
}

/**
 * Get human-readable program name
 * 
 * Returns program name if available, otherwise "Unknown Program".
 * 
 * Future plans:
 * - Fetch program names from on-chain metadata
 * - Support for program aliases
 * 
 * @param programId - Program public key
 * @returns Program name
 */
export function getProgramName(programId: PublicKey): string {
  const program = VERIFIED_PROGRAMS[programId.toString()];
  return program?.name ?? 'Unknown Program';
}

/**
 * Calculate risk score from threats
 * 
 * Risk score is calculated based on threat severity:
 * - CRITICAL: +30 points
 * - HIGH: +20 points
 * - MEDIUM: +10 points
 * - LOW: +5 points
 * 
 * Future plans:
 * - Add weighted scoring based on threat type
 * - Implement context-aware scoring
 * - Add machine learning-based scoring
 * 
 * @param threats - Array of threats
 * @returns Risk score (0-100)
 */
export function calculateRiskScore(threats: Array<{ severity: string }>): number {
  let score = 0;
  
  for (const threat of threats) {
    switch (threat.severity) {
      case 'CRITICAL':
        score += 30;
        break;
      case 'HIGH':
        score += 20;
        break;
      case 'MEDIUM':
        score += 10;
        break;
      case 'LOW':
        score += 5;
        break;
    }
  }
  
  // Cap at 100
  return Math.min(100, score);
}

/**
 * Get risk level from risk score
 * 
 * Converts numeric risk score to risk level category.
 * 
 * Future plans:
 * - Make thresholds configurable
 * - Add fuzzy logic for risk level determination
 * 
 * @param score - Risk score (0-100)
 * @returns Risk level category
 */
export function getRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (score >= 80) return 'CRITICAL';
  if (score >= 50) return 'HIGH';
  if (score >= 20) return 'MEDIUM';
  return 'LOW';
}

/**
 * Generate unique event ID
 * 
 * Creates unique ID for webhook events and logging.
 * Format: timestamp-randomString
 * 
 * Future plans:
 * - Use UUID library for better uniqueness
 * - Add event ID format versioning
 * 
 * @returns Unique event ID string
 */
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
