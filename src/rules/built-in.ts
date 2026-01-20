/**
 * Built-in Security Rules
 * 
 * Pre-configured security rules that are enabled by default.
 * These rules provide common security checks out of the box.
 * 
 * Future plans:
 * - Add more built-in rules (rate limiting, multi-sig, etc.)
 * - Make built-in rules configurable
 * - Add rule templates for common use cases
 */

import { RiskRule } from '../simulation/types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

/**
 * Built-in security rules enabled by default
 * 
 * These rules provide common security checks:
 * - Large SOL transfer blocking
 * - Program whitelist enforcement
 * 
 * Future plans:
 * - Add rate limiting rule
 * - Add multi-sig requirement rule
 * - Add NFT-specific protection rules
 */
export const BUILT_IN_RULES: RiskRule[] = [
  {
    name: 'prevent-large-sol-transfers',
    description: 'Blocks transactions that transfer more than 10 SOL',
    severity: 'HIGH',
    blocking: true,
    // Check if total SOL transfer exceeds threshold
    // Future: Make threshold configurable per user
    condition: (sim) => {
      const totalSol = sim.financial.solTransfers.reduce(
        (sum, transfer) => sum + transfer.amount,
        0
      );
      const threshold = 10 * LAMPORTS_PER_SOL;
      return totalSol > threshold;
    },
    // Generate dynamic message with actual transfer amount
    // Future: Add token symbol support in message
    message: (sim) => {
      const totalSol = sim.financial.solTransfers.reduce(
        (sum, t) => sum + t.amount,
        0
      ) / LAMPORTS_PER_SOL;
      return `Transaction attempts to transfer ${totalSol.toFixed(2)} SOL, which exceeds the 10 SOL limit`;
    }
  },
  {
    name: 'whitelist-programs-only',
    description: 'Only allow interactions with approved programs',
    severity: 'CRITICAL',
    blocking: true,
    // Check if transaction uses non-whitelisted programs
    // Future: Make whitelist configurable per user
    condition: (sim) => {
      const whitelist = [
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
      ];
      
      return sim.programs.invoked.some(program =>
        !whitelist.includes(program.programId.toString())
      );
    },
    message: 'Transaction interacts with non-whitelisted program'
  }
];
