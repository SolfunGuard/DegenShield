/**
 * Basic Usage Example
 * 
 * This example shows how to use SolanaGuard to protect a transaction
 * before sending it to the blockchain.
 */

import { SolanaGuard } from '../src/guard';
import { Connection, Transaction, PublicKey } from '@solana/web3.js';

async function basicExample() {
  // Initialize SolanaGuard
  const guard = new SolanaGuard({
    apiKey: process.env.SOLGUARD_API_KEY, // Optional: for API-based simulation
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    network: 'mainnet-beta'
  });

  // Create a transaction (example)
  const transaction = new Transaction();
  // ... add instructions to transaction

  const userWallet = new PublicKey('YOUR_WALLET_ADDRESS');

  // Simulate the transaction
  const result = await guard.simulateTx(transaction, {
    signerPublicKey: userWallet,
    detectAllThreats: true
  });

  // Check risk score
  console.log(`Risk Score: ${result.riskScore}/100`);
  console.log(`Risk Level: ${result.riskLevel}`);

  // Check for threats
  if (result.threats.length > 0) {
    console.warn('Threats detected:');
    result.threats.forEach(threat => {
      console.log(`- ${threat.title} (${threat.severity})`);
      console.log(`  ${threat.description}`);
    });
  }

  // Make decision based on risk
  if (result.riskScore > 70) {
    console.error('Transaction blocked - risk too high');
    return;
  }

  // Safe to proceed
  const connection = guard.getConnection();
  const signature = await connection.sendTransaction(transaction);
  console.log('Transaction sent:', signature);
}
