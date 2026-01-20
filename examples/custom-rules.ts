/**
 * Custom Rules Example
 * 
 * This example shows how to define and use custom security rules
 * with SolanaGuard.
 */

import { SolanaGuard, RiskRule } from '../src/guard';
import { SimulationResult, RuleContext } from '../src/simulation/types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Transaction, PublicKey } from '@solana/web3.js';

async function customRulesExample() {
  // Define custom rules
  const customRules: RiskRule[] = [
    {
      name: 'prevent-large-sol-transfers',
      description: 'Blocks transactions that transfer more than 5 SOL',
      severity: 'HIGH',
      blocking: true,
      condition: (sim: SimulationResult) => {
        const totalSol = sim.financial.solTransfers.reduce(
          (sum, transfer) => sum + transfer.amount,
          0
        );
        return totalSol > 5 * LAMPORTS_PER_SOL;
      },
      message: (sim: SimulationResult) => {
        const totalSol = sim.financial.solTransfers.reduce(
          (sum, t) => sum + t.amount,
          0
        ) / LAMPORTS_PER_SOL;
        return `Transaction attempts to transfer ${totalSol.toFixed(2)} SOL, which exceeds your 5 SOL limit`;
      }
    },
    {
      name: 'whitelist-programs-only',
      description: 'Only allow interactions with approved programs',
      severity: 'CRITICAL',
      blocking: true,
      condition: (sim: SimulationResult) => {
        const whitelist = [
          'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // SPL Token
          'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4'  // Jupiter
        ];
        
        return sim.programs.invoked.some(program =>
          !whitelist.includes(program.programId.toString())
        );
      },
      message: 'Transaction interacts with non-whitelisted program'
    }
  ];

  // Initialize SolanaGuard with custom rules
  const guard = new SolanaGuard({
    apiKey: process.env.SOLGUARD_API_KEY,
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    customRules
  });

  // Use guard as normal
  const transaction = new Transaction();
  const userWallet = new PublicKey('YOUR_WALLET_ADDRESS');

  const result = await guard.simulateTx(transaction, {
    signerPublicKey: userWallet
  });

  // Check which custom rules were triggered
  const triggeredRules = result.threats.filter(t =>
    t.type === 'CUSTOM_RULE_VIOLATION'
  );

  if (triggeredRules.length > 0) {
    console.warn('Custom rules triggered:');
    triggeredRules.forEach(rule => {
      console.log(`- ${rule.title}`);
      console.log(`  ${rule.description}`);
    });
  }
}
