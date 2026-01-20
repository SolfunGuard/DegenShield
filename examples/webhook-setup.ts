/**
 * Webhook Setup Example
 * 
 * This example shows how to configure and use webhooks
 * with SolanaGuard for real-time security alerts.
 */

import { SolanaGuard, WebhookConfig } from '../src/guard';
import { Transaction, PublicKey } from '@solana/web3.js';

async function webhookExample() {
  // Configure webhooks
  const webhookConfig: WebhookConfig = {
    endpoints: {
      onHighRisk: 'https://api.yourapp.com/webhooks/high-risk',
      onCritical: 'https://api.yourapp.com/webhooks/critical',
      onBlocked: 'https://api.yourapp.com/webhooks/blocked'
    },
    auth: {
      type: 'bearer',
      token: process.env.WEBHOOK_SECRET
    },
    retry: {
      maxAttempts: 3,
      backoffMs: 1000,
      timeout: 5000
    },
    filters: {
      minRiskScore: 50,
      threatTypes: ['WALLET_DRAIN', 'DELEGATE_HIJACK']
    },
    rateLimit: {
      maxPerMinute: 10,
      maxPerHour: 100
    }
  };

  // Initialize SolanaGuard with webhooks enabled
  const guard = new SolanaGuard({
    apiKey: process.env.SOLGUARD_API_KEY,
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    options: {
      enableWebhooks: true
    },
    webhooks: webhookConfig
  });

  // Use guard - webhooks will be sent automatically
  const transaction = new Transaction();
  const userWallet = new PublicKey('YOUR_WALLET_ADDRESS');

  const result = await guard.simulateTx(transaction, {
    signerPublicKey: userWallet
  });

  // Webhook will be sent automatically if:
  // - Risk score >= 50 (based on filters)
  // - Threat types match (WALLET_DRAIN, DELEGATE_HIJACK)
  // - Transaction is blocked
}
