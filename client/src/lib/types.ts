// Frontend types — mirrors API response shapes

export type ProductSuite = "Product Branding" | "Retail Experience" | "Supply Chain / Product Movement";
export type ImpactLevel = "critical" | "high" | "medium" | "low";
export type SignalType = "regulation" | "competitor" | "market-trend" | "client-signal" | "opportunity" | "risk";
export type TimeHorizon = "immediate" | "short-term" | "medium-term" | "long-term";
export type Geography = "EU-wide" | "France" | "Germany" | "UK" | "Global" | "Asia-Pacific" | "North America";
export type ConfidenceLevel = "confirmed" | "high" | "medium" | "speculative";
export type SignalStatus = "active" | "monitoring" | "action-required" | "resolved";

export interface Signal {
  id: number;
  signalId: string;
  title: string;
  summary: string;
  whyItMatters: string;
  clientImplication: string;
  suggestedAction: string;
  type: string;
  impactLevel: string;
  suites: string[];
  timeHorizon: string;
  geography: string;
  confidence: string;
  status: string;
  date: string;
  source: string;
  sourceUrl?: string | null;
}

export interface Regulation {
  id: number;
  regId: string;
  name: string;
  shortName: string;
  status: string;
  nextMilestone: string;
  nextMilestoneDate: string;
  impactLevel: string;
  suites: string[];
  geography: string;
  description: string;
  keyRequirements: string[];
}

export interface Stakeholder {
  id: number;
  stkId: string;
  name: string;
  organization: string;
  category: string;
  geography: string;
  importance: string;
  role: string;
  relevance: string;
}

export interface Competitor {
  id: number;
  compId: string;
  name: string;
  description: string;
  threatLevel: string;
  recentMoves: string[];
  overlapAreas: string[];
  revenue?: string | null;
  employees?: string | null;
  keyStrength: string;
}

export interface OpportunityRisk {
  id: number;
  orId: string;
  title: string;
  description: string;
  type: string;
  priority: number;
  suites: string[];
  timeHorizon: string;
  impactLevel: string;
}

export interface Milestone {
  id: number;
  msId: string;
  date: string;
  title: string;
  regulation: string;
  description: string;
  impactLevel: string;
  suites: string[];
}

export interface AdvisoryItem {
  id: number;
  itemId: string;
  category: string;
  title: string;
  description: string;
  date?: string | null;
  source?: string | null;
  horizon?: string | null;
  sortOrder: number;
}

export interface KPIs {
  totalSignals: number;
  criticalAlerts: number;
  highImpact: number;
  thisWeek: number;
  actionRequired: number;
  lastScanAt: string | null;
}

export interface ScanStatus {
  id?: number;
  startedAt?: string;
  completedAt?: string | null;
  status: string;
  newSignals?: number;
  summary?: string | null;
}
