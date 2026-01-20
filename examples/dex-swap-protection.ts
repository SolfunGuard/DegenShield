/**
 * DEX Swap Protection Example
 * 
 * This example shows how to protect a DEX swap transaction
 * using SolanaGuard with custom rules for slippage protection.
 */

import { SolanaGuard, RiskRule } from '../src/guard';
import { Transaction, PublicKey } from '@solana/web3.js';

async function dexSwapProtectionExample() {
  // Custom rules for DEX swaps
  const swapRules: RiskRule[] = [
    {
      name: 'slippage-protection',
      severity: 'HIGH',
      blocking: false,
      condition: (sim) => {
        // Check if slippage > 5%
        // This would parse swap instruction data
        // For now, placeholder
        return false;
      },
      message: 'Swap has slippage > 5%, you might get a bad price',
      applicableTo: ['JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4'] // Jupiter
    },
    {
      name: 'suspicious-token-check',
      severity: 'CRITICAL',
      blocking: true,
      condition: async (sim) => {
        // Check if token is known scam
        // Would check against scam database
        return false;
      },
      message: 'One of the tokens is flagged as a scam'
    }
  ];

  const guard = new SolanaGuard({
    apiKey: process.env.SOLGUARD_API_KEY,
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    customRules: swapRules
  });

  // Simulate swap transaction
  const swapTransaction = new Transaction();
  // ... build swap transaction with Jupiter/Orca

  const userWallet = new PublicKey('YOUR_WALLET_ADDRESS');

  const result = await guard.simulateTx(swapTransaction, {
    signerPublicKey: userWallet,
    detectAllThreats: true
  });

  // Check for swap-specific threats
  const hasSlippageWarning = result.threats.some(t =>
    t.type === 'SLIPPAGE_EXPLOIT'
  );

  if (hasSlippageWarning) {
    console.warn('⚠️ Slippage warning detected');
  }

  // Check for scam tokens
  const hasScamToken = result.threats.some(t =>
    t.title.includes('scam')
  );

  if (hasScamToken) {
    console.error('🚨 Scam token detected - transaction blocked');
    return;
  }

  // Proceed with swap if safe
  if (result.riskScore < 50) {
    console.log('✅ Swap appears safe, proceeding...');
    // Execute swap
  }
}
