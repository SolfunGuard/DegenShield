/**
 * Rules Engine - Custom Security Rules Evaluator
 * 
 * Evaluates custom security rules against simulation results.
 * Allows users to define their own security policies.
 * 
 * Future plans:
 * - Add rule prioritization and conflict resolution
 * - Implement rule dependency management
 * - Add rule performance metrics
 */

import { RiskRule, RuleContext, SimulationResult } from '../simulation/types';
import { Threat } from '../simulation/types';

/**
 * Rules engine for evaluating custom security rules
 * 
 * Manages a collection of security rules and evaluates them
 * against simulation results. Rules can block or warn about transactions.
 * 
 * Future plans:
 * - Add rule execution order optimization
 * - Implement rule dependency management
 * - Add rule caching for better performance
 */
export class RulesEngine {
  private rules: Map<string, RiskRule> = new Map(); // Rule storage by name

  /**
   * Initialize rules engine with initial rules
   * 
   * Future plans:
   * - Add rule validation on initialization
   * - Support for rule loading from file/database
   */
  constructor(rules: RiskRule[] = []) {
    for (const rule of rules) {
      this.addRule(rule);
    }
  }

  /**
   * Add a new custom rule
   * 
   * Rules are evaluated during transaction simulation.
   * 
   * Future plans:
   * - Add rule validation before adding
   * - Support for rule versioning
   * 
   * @param rule - Custom risk rule to add
   */
  addRule(rule: RiskRule): void {
    this.rules.set(rule.name, rule);
  }

  /**
   * Remove a rule by name
   * 
   * Future plans:
   * - Add rule archiving instead of deletion
   * - Support for rule soft deletion
   * 
   * @param name - Name of the rule to remove
   * @returns True if rule was removed, false if not found
   */
  removeRule(name: string): boolean {
    return this.rules.delete(name);
  }

  /**
   * Update an existing rule
   * 
   * Future plans:
   * - Add rule diff tracking for audit trail
   * - Support for atomic rule updates
   * 
   * @param name - Name of the rule to update
   * @param updates - Partial rule updates
   * @returns True if rule was updated, false if not found
   */
  updateRule(name: string, updates: Partial<RiskRule>): boolean {
    const existing = this.rules.get(name);
    if (!existing) return false;

    this.rules.set(name, { ...existing, ...updates });
    return true;
  }

  /**
   * Evaluate all rules against a simulation result
   * 
   * Runs all rules and returns threats for violated rules.
   * Rules can be applicable only to specific programs.
   * 
   * Future plans:
   * - Add parallel rule execution for better performance
   * - Implement rule execution order optimization
   * - Add rule performance monitoring
   * 
   * @param simulation - Simulation result to evaluate against
   * @param context - Rule context (user wallet, timestamp, history)
   * @returns Array of threats from violated rules
   */
  async evaluateRules(
    simulation: SimulationResult,
    context: RuleContext
  ): Promise<Threat[]> {
    const threats: Threat[] = [];

    for (const rule of this.rules.values()) {
      // Check if rule is applicable to this transaction
      // Future: Add rule condition pre-checking for better performance
      if (rule.applicableTo && rule.applicableTo.length > 0) {
        const invokedPrograms = simulation.programs.invoked.map(p => p.programId.toString());
        const isApplicable = rule.applicableTo.some(pid => invokedPrograms.includes(pid));
        if (!isApplicable) continue;
      }

      // Evaluate rule condition
      // Future: Add rule execution timeout
      try {
        const conditionResult = await rule.condition(simulation, context);
        
        if (conditionResult) {
          // Rule was violated - create threat
          const message = typeof rule.message === 'function'
            ? rule.message(simulation)
            : rule.message;

          threats.push({
            type: 'CUSTOM_RULE_VIOLATION',
            severity: rule.severity,
            title: `Custom Rule Violation: ${rule.name}`,
            description: message,
            affectedAccounts: [context.userWallet],
            evidence: {
              data: {
                ruleName: rule.name,
                metadata: rule.metadata
              }
            },
            recommendation: `Custom security rule "${rule.name}" was violated. ${message}`,
            blockedByDefault: rule.blocking ?? false
          });
        }
      } catch (error: any) {
        // Rule evaluation failed - log but don't block
        // Future: Add error reporting system
        console.warn(`Rule evaluation failed for ${rule.name}:`, error);
      }
    }

    return threats;
  }

  /**
   * Export all rules as JSON
   * 
   * Useful for backing up rules or sharing rule sets.
   * 
   * Future plans:
   * - Add rule format versioning
   * - Support for encrypted rule exports
   * 
   * @returns Array of all rules
   */
  exportRules(): RiskRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Import rules from array
   * 
   * Useful for restoring rules from backup or loading shared rule sets.
   * 
   * Future plans:
   * - Add rule validation on import
   * - Support for rule merging strategies
   * 
   * @param rules - Array of rules to import
   */
  importRules(rules: RiskRule[]): void {
    this.rules.clear();
    for (const rule of rules) {
      this.addRule(rule);
    }
  }

  /**
   * Get a specific rule by name
   * 
   * @param name - Name of the rule
   * @returns Rule if found, undefined otherwise
   */
  getRule(name: string): RiskRule | undefined {
    return this.rules.get(name);
  }

  /**
   * Get all rules
   * 
   * @returns Array of all rules
   */
  getAllRules(): RiskRule[] {
    return Array.from(this.rules.values());
  }
}
