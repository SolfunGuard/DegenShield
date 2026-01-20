# 🛡️ DegenShield SDK

> **Transaction Security Reimagined** - Protect your Solana users from wallet drainers, phishing attacks, and malicious smart contracts with advanced transaction simulation and threat detection.

[![Version](https://img.shields.io/badge/version-0.0.1-purple.svg)](https://github.com/lkristof55/solanaguard)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-1.87-purple.svg)](https://solana.com/)
[![Twitter](https://img.shields.io/twitter/follow/SolanaGuardOnX?style=social)](https://x.com/SolanaGuardOnX)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Configuration](#-configuration)
- [Threat Detection](#-threat-detection)
- [Use Cases](#-use-cases)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Performance](#-performance)
- [Security](#-security)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)
- [Support](#-support)
- [License](#-license)

## 🚀 Overview

DegenShield is a comprehensive transaction security SDK for Solana that simulates and analyzes transactions before they execute on-chain. It provides real-time threat detection, custom security rules, and financial analysis to protect users from malicious transactions.

The SDK works by simulating transactions through Solana's RPC or our backend API, analyzing the execution results, and detecting potential security threats. It then provides a risk assessment score, detailed threat information, and recommendations for users.

### Key Benefits

- **Prevent Wallet Drains** - Detect sophisticated drain attacks before execution by analyzing transaction patterns, excessive transfers, and batch operations
- **Phishing Protection** - Identify phishing signature patterns in transaction memos and instructions
- **Program Verification** - Verify program interactions against a trusted database of verified Solana programs
- **Custom Rules** - Define your own security policies that match your application's requirements
- **Financial Analysis** - Calculate value at risk and analyze all SOL and token transfers in a transaction
- **Webhook Alerts** - Receive real-time notifications for security events via configurable webhooks

### How It Works

SolanaGuard follows a four-step process to analyze and protect transactions:

1. **Transaction Simulation** - The transaction is simulated using Solana RPC or our backend API to get execution results without actually executing on-chain
2. **Threat Detection** - Multiple detection algorithms analyze the simulation results for known attack patterns including wallet drains, phishing attempts, and suspicious program interactions
3. **Custom Rules Evaluation** - User-defined security rules are evaluated against the simulation results to enforce custom security policies
4. **Risk Assessment** - All threats and rule violations are aggregated into a risk score (0-100) and risk level (LOW, MEDIUM, HIGH, CRITICAL)

The final result includes detailed threat information, financial analysis, program verification status, and recommendations. Based on this assessment, the application can automatically block high-risk transactions or present warnings to users for manual review.

## ✨ Features

### Core Security Features

**Wallet Drainer Protection** - DegenShield detects sophisticated wallet drain attempts by analyzing transaction patterns. It identifies excessive SOL transfers, batch token transfer operations (where multiple tokens are transferred in a single transaction), and account closure attempts that are common in drain attacks.

**Phishing Signature Detection** - The SDK scans transaction logs and memo instructions for known phishing patterns. It detects suspicious text patterns like "approve all", "unlimited approval", or "verify wallet" that are commonly used in phishing attacks.

**Delegate Hijacking Detection** - DegenShield monitors for unauthorized changes to token account delegates. Delegates can transfer tokens on behalf of the owner, making unauthorized delegate changes a critical security issue.

**Unknown Program Detection** - All programs involved in a transaction are checked against a database of verified programs. Unknown or unverified programs are flagged, allowing users to make informed decisions about interacting with unfamiliar code.

**Account Closure Detection** - The SDK identifies when transactions attempt to close accounts, which is an irreversible operation. Users are warned about these permanent changes before approval.

**Excessive Transfer Detection** - Large SOL or token transfers are detected and can trigger alerts or blocks based on configurable thresholds. This helps prevent both accidental large transfers and malicious drain attempts.

### Advanced Capabilities

**Transaction Simulation** - DegenShield can simulate transactions through Solana RPC or our backend API. RPC simulation provides detailed execution logs, account changes, and program invocations. API simulation offers enhanced threat detection algorithms and better performance.

**Financial Analysis** - All SOL and token transfers are analyzed and categorized. The SDK calculates total value at risk in USD (with price oracle integration), identifies NFT transfers, and provides detailed financial movement reports.

**Program Verification** - Programs are checked against our verified program database which includes well-known programs like SPL Token, Jupiter, Orca, Magic Eden, and Tensor. Programs are categorized by reputation score and verification status.

**CPI Analysis** - Cross-program invocations (CPIs) are analyzed to detect suspicious program interactions. The SDK identifies unexpected program calls that may indicate malicious behavior.

**Authority Change Tracking** - The SDK monitors for changes to various authorities including mint authority, freeze authority, and upgrade authority. These changes can significantly impact token behavior and security.

### Customization

**Custom Security Rules** - Users can define their own security rules using a flexible rule engine. Rules can evaluate simulation results, financial data, program information, and custom context. Rules can block or warn about transactions based on any criteria.

**Built-in Rules** - The SDK includes pre-configured security rules for common scenarios like preventing large SOL transfers or enforcing program whitelists. These can be enabled or disabled based on needs.

**Rule Engine** - The rule engine supports complex conditions, async rule evaluation, and rule metadata. Rules can be scoped to specific programs or applied globally.

**Webhook Integration** - Real-time webhook notifications can be configured for different risk levels and threat types. Webhooks support authentication, retry logic, rate limiting, and filtering.

### Analytics & Monitoring

**Risk Scoring** - Transactions receive a risk score from 0-100 based on detected threats and rule violations. The score is converted to a risk level (LOW, MEDIUM, HIGH, CRITICAL) for easy interpretation.

**Threat Reporting** - Each detected threat includes detailed information: threat type, severity, description, affected accounts, evidence, and recommended actions.

**Webhook Alerts** - Configurable webhooks send notifications when specific risk levels or threat types are detected. Webhooks include complete transaction and analysis data for integration with monitoring systems.

**Performance Metrics** - Simulation duration and caching information are provided to help monitor and optimize performance.

## 📦 Installation

### Prerequisites

Before installing DegenShield SDK, ensure you have:

- **Node.js 18+** or **Bun** runtime environment
- **TypeScript 5.8+** (recommended for type safety, though JavaScript is also supported)
- **Solana Web3.js 1.87+** for Solana blockchain interaction

### Installation Methods

DegenShield SDK can be installed using any Node.js package manager:

**npm** - The standard Node.js package manager. Run the installation command in your project directory.

**yarn** - Fast and reliable package manager with improved dependency resolution.

**pnpm** - Efficient package manager with disk space savings through content-addressable storage.

**bun** - Modern JavaScript runtime and package manager with built-in bundler and test runner.

After installation, ensure you also have `@solana/web3.js` installed as it's required for Solana blockchain interaction.

## 🚀 Quick Start

To get started with DegenShield, first install the package using your preferred package manager. Then import the SDK into your project.

Initialize DegenShield with your RPC endpoint. You can use the public Solana RPC for testing, but for production we recommend using a dedicated RPC provider like QuickNode, Alchemy, or Helius.

You can optionally provide an API key for enhanced threat detection through our backend service. The API key enables faster simulation and more advanced threat detection algorithms.

Create your Solana transaction as usual, then call the `simulateTx` method with your transaction and user wallet address. The method returns a comprehensive analysis result including risk score, risk level, detected threats, warnings, financial analysis, and program information.

Check the risk score and risk level to determine if the transaction should proceed. Risk scores above 70 typically indicate high-risk transactions that should be reviewed carefully or blocked. You can also check individual threats to see if any have `blockedByDefault: true`.

If the transaction is safe to proceed, you can send it using the Solana connection instance obtained from `getConnection()`.

For production deployments, always use an API key with DegenShield. The API backend provides enhanced security features, better performance, and access to the latest threat detection algorithms.

## 📚 Documentation

Complete documentation is available on our website. The documentation includes:

- **Detailed API Reference** - Complete documentation of all classes, methods, and types
- **Comprehensive Examples** - Real-world examples for common use cases
- **Configuration Guide** - Detailed explanation of all configuration options
- **Best Practices** - Security and performance best practices
- **Troubleshooting Guide** - Solutions for common issues and problems
- **Integration Guides** - Step-by-step guides for integrating with popular wallets and platforms

Visit the documentation at [https://degenshield.com/docs](https://degenshield.com/docs) for the most up-to-date information.

## 📖 API Reference

### DegenShield Class

The main class for interacting with DegenShield SDK. Provides methods for transaction simulation, analysis, and rule management.

#### Configuration

The DegenShield constructor accepts a configuration object with the following options:

- **apiKey** (optional) - API key for backend service access. Enables enhanced threat detection and better performance. Recommended for production use.

- **rpcUrl** (required) - Solana RPC endpoint URL. Can be a public endpoint or dedicated provider like QuickNode, Alchemy, or Helius.

- **network** (optional) - Solana network identifier. Accepts 'mainnet-beta', 'testnet', or 'devnet'. Defaults to 'mainnet-beta'.

- **options** (optional) - Additional configuration options:
  - `enableWebhooks` - Enable webhook notifications for security events
  - `strictMode` - Use stricter security checks with lower thresholds
  - `customRules` - Enable or disable built-in security rules

- **customRules** (optional) - Array of user-defined security rules to evaluate during simulation.

- **webhooks** (optional) - Webhook configuration for real-time notifications including endpoints, authentication, retry logic, filters, and rate limits.

#### Methods

**simulateTx(transaction, options?)** - The core method for analyzing transactions. Simulates the transaction and runs threat detection algorithms. Returns a SimulationResult object containing risk assessment, threats, warnings, financial analysis, and program information.

Options include:
- `signerPublicKey` - User's wallet address for context-aware analysis
- `detectAllThreats` - Enable all threat detection algorithms (default: true)
- `includeFullLogs` - Include all simulation logs in the result
- `customRules` - Additional rules to evaluate for this specific simulation
- `commitment` - RPC commitment level ('processed', 'confirmed', or 'finalized')

**analyzeTx(transaction, options?)** - Performs static analysis without full simulation. Faster than `simulateTx` and useful for quick pre-flight checks. Analyzes transaction structure, programs, and instructions without execution.

**addRule(rule)** - Adds a custom security rule to the rules engine. Rules are evaluated during simulation and can block or warn about transactions based on custom criteria.

**removeRule(name)** - Removes a custom rule by name. Returns true if the rule was found and removed.

**updateRule(name, updates)** - Updates an existing rule with new configuration. Returns true if the rule was found and updated.

**exportRules()** - Exports all rules as an array for backup or sharing.

**importRules(rules)** - Imports rules from an array, replacing all current rules.

**getConnection()** - Returns the Solana RPC connection instance for direct blockchain interaction.

### Result Types

**SimulationResult** - Complete simulation analysis result containing:
- Risk score (0-100) and risk level (LOW, MEDIUM, HIGH, CRITICAL)
- Array of detected threats with detailed information
- Array of non-critical warnings
- Simulation execution details (logs, errors, compute units)
- Financial analysis (SOL/token transfers, value at risk)
- Program analysis (invoked programs, CPI calls, suspicious patterns)
- Authority changes detected in the transaction
- Timestamp and simulation duration

**AnalysisReport** - Static analysis result without simulation execution:
- Transaction structure (instruction count, signers, accounts)
- Program information and verification status
- CPI calls and suspicious patterns
- Authority changes
- Token movements
- Scam indicators
- Recommendations and estimated risk level

**Threat** - Detailed threat information including:
- Threat type (WALLET_DRAIN, PHISHING_SIGNATURE, etc.)
- Severity level (LOW, MEDIUM, HIGH, CRITICAL)
- Human-readable title and description
- Affected account addresses
- Evidence data (program IDs, instruction data)
- Recommended actions
- Whether threat blocks transaction by default

**RiskRule** - Custom security rule definition with:
- Rule name and description
- Severity level
- Condition function that evaluates simulation results
- Message (static or dynamic based on simulation)
- Blocking behavior
- Optional program scope (rules that apply only to specific programs)

## 💻 Examples

The SDK includes comprehensive examples in the `examples` directory:

**Basic Usage** - Shows how to initialize SolanaGuard, simulate a transaction, and handle the results. Demonstrates basic risk assessment and transaction blocking.

**Custom Rules** - Example of defining custom security rules including rules that block large SOL transfers and enforce program whitelists. Shows how rules are evaluated and integrated into the simulation process.

**Webhook Setup** - Complete webhook configuration example including endpoint setup, authentication, retry logic, filtering, and rate limiting. Demonstrates how to receive real-time security event notifications.

**DEX Swap Protection** - Example of protecting DEX swap transactions with custom rules for slippage protection and scam token detection. Shows integration with Jupiter and other DEX aggregators.

All examples include detailed comments explaining each step and can be used as templates for your own integration.

## ⚙️ Configuration

### Environment Variables

For production deployments, store configuration in environment variables:

**RPC_URL** - Required. Your Solana RPC endpoint URL. Use a dedicated provider for production to avoid rate limits.

**DEGENSHIELD_API_KEY** - Optional but recommended for production. API key for backend service access. Obtain from DegenShield dashboard.

**WEBHOOK_SECRET** - Optional. Secret token for webhook authentication if using webhook notifications.

### RPC Endpoints

We recommend using a reliable RPC provider for production:

**QuickNode** - High-performance RPC with dedicated endpoints. Provides consistent performance and rate limits.

**Alchemy** - Enterprise-grade RPC infrastructure with analytics and monitoring tools.

**Helius** - Solana-native RPC provider with enhanced features for Solana development.

**Public RPC** - The default Solana public RPC endpoint is available but rate-limited. Suitable only for testing and development.

### Network Configuration

Choose the appropriate network for your use case:

**mainnet-beta** - Production Solana network. Use for real applications with real funds.

**testnet** - Test network with free tokens. Use for development and testing.

**devnet** - Development network with reset capability. Use for testing and experimentation.

## 🔍 Threat Detection

DegenShield detects a comprehensive range of security threats:

**WALLET_DRAIN** - Critical threat indicating attempts to drain wallet funds. Detected through excessive transfer patterns, batch operations, and account closure attempts. Always blocked by default.

**DELEGATE_HIJACK** - Critical threat for unauthorized token account delegate changes. Delegates can transfer tokens without owner approval, making this a severe security issue. Always blocked by default.

**PHISHING_SIGNATURE** - High-severity threat for phishing attack patterns in transaction memos or instructions. Detects suspicious text patterns commonly used in phishing. Always blocked by default.

**UNKNOWN_PROGRAM** - Medium-to-high severity threat for interactions with unverified programs. Severity depends on program reputation score. Blocked by default for programs with reputation below 50.

**EXCESSIVE_SOL_TRANSFER** - Critical threat for large SOL transfers exceeding configured threshold (default: 10 SOL). Always blocked by default.

**ACCOUNT_CLOSURE** - Critical threat for irreversible account closure operations. Always blocked by default to prevent accidental permanent data loss.

**SUSPICIOUS_CPI** - High-severity threat for suspicious cross-program invocations. Indicates unexpected program interactions. Not blocked by default but warrants user attention.

**FREEZE_AUTHORITY** - High-severity threat for freeze authority modifications. Can prevent token transfers. Blocked conditionally based on context.

**MINT_AUTHORITY_CHANGE** - High-severity threat for mint authority changes. Can affect token supply control. Blocked conditionally.

**UPGRADE_AUTHORITY_CHANGE** - Critical threat for program upgrade authority changes. Can allow malicious code updates. Always blocked by default.

**METADATA_MANIPULATION** - Medium-severity threat for NFT metadata modifications. May indicate tampering. Not blocked by default.

**SLIPPAGE_EXPLOIT** - Medium-severity threat for excessive slippage in DEX swaps. May indicate price manipulation. Not blocked by default.

**CUSTOM_RULE_VIOLATION** - Variable severity based on custom rule configuration. Blocking behavior is configurable per rule.

## 🎯 Use Cases

### Wallet Applications

Protect users in wallet applications like Phantom, Solflare, or custom wallets by analyzing transactions before signing. Display risk warnings and require additional confirmation for high-risk transactions. Integrate seamlessly into the transaction approval flow.

### DEX Platforms

Verify swaps and detect scam tokens before execution. Check token reputation, verify swap parameters, and warn users about high slippage. Integrate with Jupiter, Orca, and other DEX aggregators.

### DeFi Protocols

Secure lending, staking, and yield farming operations. Detect unlimited approvals, verify protocol interactions, and prevent delegate hijacking. Customize rules for protocol-specific security requirements.

### NFT Marketplaces

Protect NFT trades and prevent metadata manipulation. Verify NFT program interactions, detect suspicious listings, and warn about account closures. Integrate with Magic Eden, Tensor, and other marketplaces.

### Gaming Platforms

Secure in-game transactions and asset transfers. Verify game program interactions, detect suspicious transfers, and protect user assets. Customize rules for game-specific mechanics.

### Enterprise Applications

Implement custom security policies and compliance requirements. Define enterprise-specific rules, configure webhooks for monitoring, and integrate with existing security infrastructure.

## 🎯 Best Practices

### Use API Key in Production

Always use an API key in production environments. The API backend provides enhanced threat detection, better performance, and access to the latest security algorithms. Store the API key securely in environment variables, never hardcode it in your application.

### Handle Simulation Results Properly

Always check both the risk score and individual threats when making blocking decisions. Some threats may have `blockedByDefault: true` even if the overall risk score is moderate. Review all threats to provide users with comprehensive information.

### Provide User Feedback

Display threat information to users in a clear and understandable format. Show threat titles, descriptions, and recommendations. Allow users to review and make informed decisions rather than silently blocking transactions.

### Use Custom Rules Wisely

Define specific, well-documented custom rules that match your application's security requirements. Avoid overly broad rules that may cause false positives. Test rules thoroughly before deploying to production.

### Configure Webhooks for Monitoring

Set up webhooks to monitor security events in production. Configure separate endpoints for different risk levels and threat types. Implement proper authentication and rate limiting. Use webhooks to integrate with your monitoring and alerting systems.

### Regular Updates

Keep the SDK updated to receive the latest threat detection algorithms and security improvements. Review and update custom rules regularly based on new attack patterns and security requirements.

### Test Thoroughly

Test DegenShield integration thoroughly in development and testnet environments before deploying to mainnet. Test various transaction types, threat scenarios, and edge cases to ensure proper behavior.

## 🔧 Troubleshooting

### Simulation Fails

If transaction simulation fails, check that your RPC endpoint is accessible and responding. Verify that the transaction structure is valid and includes a valid recent blockhash. Ensure you're using the correct network (mainnet/testnet/devnet) for your RPC endpoint.

### High False Positive Rate

If you're experiencing too many false positives, adjust risk score thresholds to match your tolerance level. Review and customize built-in rules, or disable rules that don't match your use case. Add trusted programs to a whitelist to reduce warnings for known-good programs.

### Slow Performance

For better performance, use the API backend instead of RPC-only simulation. Enable caching for repeated identical transactions. Use `analyzeTx()` for quick pre-flight checks before running full simulation for medium/high-risk transactions.

### Webhook Delivery Issues

If webhooks aren't being delivered, check your webhook endpoint accessibility and authentication configuration. Verify rate limits aren't being exceeded. Check retry configuration - webhooks use exponential backoff on failure.

### Integration Issues

For integration problems, check that all required dependencies are installed. Verify TypeScript types are correct if using TypeScript. Review the examples directory for working integration patterns. Check the documentation for detailed API usage.

## ⚡ Performance

### Simulation Speed

Performance varies based on configuration:

- **Static Analysis** (`analyzeTx`) - Typically 50-100ms. Very fast for quick pre-flight checks.
- **RPC Simulation** (`simulateTx` with RPC) - Typically 200-500ms depending on RPC provider and network conditions.
- **API Simulation** (`simulateTx` with API key) - Typically 100-300ms with better performance and enhanced detection.

### Optimization Tips

**Use API Backend** - API simulation is faster than RPC and includes enhanced threat detection. Always use API key in production.

**Cache Results** - Cache simulation results for identical transactions to avoid redundant simulations. Use `skipCache` option to force fresh simulation when needed.

**Quick Pre-check** - Use `analyzeTx()` for quick static analysis before running full simulation. Skip full simulation for low-risk transactions.

**Parallel Processing** - Run multiple simulations in parallel using Promise.all() for better throughput when analyzing multiple transactions.

**Dedicated RPC** - Use a dedicated RPC provider rather than public endpoints for better performance and reliability.

### Performance Monitoring

Monitor simulation duration through the `simulationDuration` field in results. Track cache hit rates if implementing caching. Monitor API rate limits when using API backend. Use webhooks to track performance metrics in production.

## 🔒 Security

### Security Best Practices

**Never Trust Client-Side Only** - Always validate transactions on the backend in addition to client-side checks. Client-side checks can be bypassed by determined attackers.

**Use API Key** - The API backend includes enhanced threat detection algorithms not available in RPC-only mode. Always use API key in production environments.

**Keep SDK Updated** - Regular updates include new threat signatures and security improvements. Stay updated to maintain protection against latest attack vectors.

**Monitor Webhooks** - Set up webhook monitoring to track security events in real-time. Integrate with your security monitoring and alerting systems.

**Review Rules Regularly** - Regularly review and update custom security rules based on new threats and changing requirements. Remove or update rules that are no longer relevant.

**Secure API Keys** - Store API keys securely in environment variables or secure key management systems. Never commit API keys to version control or expose them in client-side code.

**User Education** - Combine SolanaGuard with user education about Solana security. Teach users to recognize common attack patterns and always verify transaction details.

### API Key Security

Store API keys securely using environment variables or secure configuration management. Never hardcode API keys in your source code. Use different API keys for development, staging, and production environments. Rotate API keys regularly as part of your security procedures.

### Transaction Validation

Always validate transaction structure before simulation. Verify transaction signatures match expected signers. Check that transactions haven't been tampered with between creation and analysis. Implement additional validation layers beyond SolanaGuard for critical operations.

## 🤝 Contributing

We welcome contributions from the community! Contributing helps make SolanaGuard better for everyone.

### How to Contribute

1. Fork the repository on GitHub
2. Create a feature branch for your changes
3. Make your changes with clear, documented code
4. Add tests if applicable
5. Commit with descriptive commit messages
6. Push to your fork and open a Pull Request

### Development Setup

Clone the repository and install dependencies. The project uses TypeScript for type safety. Run the build script to compile TypeScript to JavaScript. Run tests when available to ensure changes don't break existing functionality.

### Contribution Guidelines

Follow existing code style and conventions. Add comments for complex logic. Update documentation for API changes. Include examples for new features. Test changes thoroughly before submitting.

See the Contributing Guide for detailed information about development workflow, coding standards, and contribution process.

## 🗺️ Roadmap

### Current Version (v0.0.1)

The current release includes core functionality:

- Transaction simulation via Solana RPC
- Basic threat detection algorithms (wallet drain, phishing, unknown programs)
- Custom rules engine for user-defined security policies
- Webhook support for real-time notifications
- Financial analysis and program verification

### Upcoming Version (v0.1.0)

Planned improvements include:

- Full API backend integration with enhanced threat detection
- Improved threat detection algorithms with better accuracy
- Comprehensive program verification database with reputation scores
- Performance optimizations and caching improvements
- Enhanced documentation and examples

### Future Version (v1.0.0)

Long-term goals include:

- Machine learning-based threat detection for adaptive security
- On-chain program verification through Solana program metadata
- Community-driven program reputation system
- Advanced analytics dashboard for monitoring and insights
- Multi-chain support for other blockchain networks

See our GitHub issues and discussions for detailed roadmap information and to contribute ideas for future development.

## ❓ FAQ

### Is DegenShield free to use?

The SDK is open source and free to use. The API backend service (optional) may have usage limits depending on your plan. Check our website for current pricing and limits.

### Does DegenShield block transactions automatically?

No, DegenShield analyzes transactions and provides risk assessment, but doesn't automatically block transactions. Your application code decides whether to block based on the results. However, threats with `blockedByDefault: true` are typically blocked automatically by most integrations.

### Can I use DegenShield without an API key?

Yes, you can use DegenShield in RPC-only mode without an API key. However, the API backend provides enhanced threat detection, better performance, and access to the latest security algorithms. API key is recommended for production use.

### How accurate is threat detection?

Threat detection is highly accurate but not 100% perfect. The algorithms are continuously improved based on real-world attack patterns. Combine SolanaGuard with user education and additional security measures for best protection.

### Does DegenShield work with Phantom/Solflare wallets?

Yes, DegenShield can be integrated into any Solana wallet or application, including Phantom, Solflare, and custom wallets. The SDK provides the analysis, and you integrate it into your wallet's transaction approval flow.

### Can I customize threat detection?

Yes, you can customize threat detection through custom rules, risk score thresholds, and webhook filters. You can disable built-in rules, add your own rules, and configure what gets blocked or warned.

### What RPC endpoint should I use?

For production, use a dedicated RPC provider like QuickNode, Alchemy, or Helius for better performance and reliability. The public Solana RPC is suitable only for testing and development due to rate limits.

### How do I report a false positive?

If you encounter a false positive, please open an issue on GitHub with details about the transaction and detected threat. We continuously improve our detection algorithms based on feedback.

### Is DegenShield audited?

Security auditing is planned for future releases. The SDK is open source, allowing community review. Always implement additional security measures beyond DegenShield for critical applications.

### Can I use DegenShield in production?

Yes, DegenShield is designed for production use. However, always test thoroughly in development and testnet environments first. Use API keys for production deployments to get enhanced features and better performance.

## 💬 Support

### Get Help

- **Documentation** - Complete documentation is available at [https://degenshield.com/docs](https://degenshield.com/docs)
- **Twitter** - Follow [@DegenShield](https://x.com/DegenShield) for updates and announcements
- **GitHub Issues** - Report bugs and request features at [GitHub Issues](https://github.com/DegenShield/degenshield/issues)
- **Email Support** - Contact us at support@degenshield.com for direct support

### Community

Join our community for discussions, updates, and help:

- **Discord** - Community Discord server (coming soon)
- **Twitter** - Follow for updates and security news
- **GitHub Discussions** - Discuss features and ask questions

Star the repository on GitHub if you find SolanaGuard useful!

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for full license details.

The MIT License is a permissive open source license that allows commercial use, modification, distribution, and private use. You must include the license and copyright notice when distributing the code.

## 🙏 Acknowledgments

DegenShield is built for the Solana ecosystem with the goal of improving security for all users. We're grateful for:

- The Solana community for feedback and support
- All contributors who help improve the project
- Open source projects that inspired DegenShield
- Security researchers who help identify new threats

---

<div align="center">

**Made with ❤️ for the Solana ecosystem**

[Website](https://degenshield.com) • [Documentation](https://degenshield.com/docs) • [Twitter](https://x.com/DegenShield) • [GitHub](https://github.com/DegenShield/degenshield)

</div>
