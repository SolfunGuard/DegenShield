/**
 * DegenShield SDK - Main Entry Point
 * 
 * This file exports all public APIs of the DegenShield SDK.
 * Import from '@degenshield/sdk' or from this file for full SDK access.
 * 
 * Future plans:
 * - Add version export
 * - Support for tree-shaking optimizations
 */

// Main exports
export { DegenShield, DegenShieldConfig } from './guard';

// Types
export type {
  SimulationOptions,
  SimulationResult,
  Threat,
  ThreatType,
  RiskRule,
  RuleContext,
  Warning
} from './simulation/types';

export type {
  AnalysisReport,
  AnalysisOptions
} from './analysis/analyzer';

export type {
  WebhookConfig,
  WebhookPayload
} from './webhooks/types';

// Utilities
export { RulesEngine } from './rules/engine';
export { ThreatDetector } from './threats/detector';
export { WebhookManager } from './webhooks/manager';

// Constants
export { VERIFIED_PROGRAMS, THRESHOLDS } from './utils/constants';
