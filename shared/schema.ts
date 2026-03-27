import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ==================== SIGNALS ====================
export const signals = sqliteTable("signals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  signalId: text("signal_id").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  whyItMatters: text("why_it_matters").notNull(),
  clientImplication: text("client_implication").notNull(),
  suggestedAction: text("suggested_action").notNull(),
  type: text("type").notNull(),
  impactLevel: text("impact_level").notNull(),
  suites: text("suites").notNull(), // JSON array
  timeHorizon: text("time_horizon").notNull(),
  geography: text("geography").notNull(),
  confidence: text("confidence").notNull(),
  status: text("status").notNull(),
  date: text("date").notNull(),
  source: text("source").notNull(),
  sourceUrl: text("source_url"),
});

export const insertSignalSchema = createInsertSchema(signals).omit({ id: true });
export type InsertSignal = z.infer<typeof insertSignalSchema>;
export type Signal = typeof signals.$inferSelect;

// ==================== REGULATIONS ====================
export const regulations = sqliteTable("regulations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  regId: text("reg_id").notNull().unique(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  status: text("status").notNull(),
  nextMilestone: text("next_milestone").notNull(),
  nextMilestoneDate: text("next_milestone_date").notNull(),
  impactLevel: text("impact_level").notNull(),
  suites: text("suites").notNull(),
  geography: text("geography").notNull(),
  description: text("description").notNull(),
  keyRequirements: text("key_requirements").notNull(), // JSON array
});

export const insertRegulationSchema = createInsertSchema(regulations).omit({ id: true });
export type InsertRegulation = z.infer<typeof insertRegulationSchema>;
export type Regulation = typeof regulations.$inferSelect;

// ==================== STAKEHOLDERS ====================
export const stakeholders = sqliteTable("stakeholders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stkId: text("stk_id").notNull().unique(),
  name: text("name").notNull(),
  organization: text("organization").notNull(),
  category: text("category").notNull(),
  geography: text("geography").notNull(),
  importance: text("importance").notNull(),
  role: text("role").notNull(),
  relevance: text("relevance").notNull(),
});

export const insertStakeholderSchema = createInsertSchema(stakeholders).omit({ id: true });
export type InsertStakeholder = z.infer<typeof insertStakeholderSchema>;
export type Stakeholder = typeof stakeholders.$inferSelect;

// ==================== COMPETITORS ====================
export const competitors = sqliteTable("competitors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  compId: text("comp_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  threatLevel: text("threat_level").notNull(),
  recentMoves: text("recent_moves").notNull(), // JSON array
  overlapAreas: text("overlap_areas").notNull(), // JSON array
  revenue: text("revenue"),
  employees: text("employees"),
  keyStrength: text("key_strength").notNull(),
});

export const insertCompetitorSchema = createInsertSchema(competitors).omit({ id: true });
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Competitor = typeof competitors.$inferSelect;

// ==================== OPPORTUNITIES & RISKS ====================
export const opportunitiesRisks = sqliteTable("opportunities_risks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orId: text("or_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  priority: integer("priority").notNull(),
  suites: text("suites").notNull(),
  timeHorizon: text("time_horizon").notNull(),
  impactLevel: text("impact_level").notNull(),
});

export const insertOpportunityRiskSchema = createInsertSchema(opportunitiesRisks).omit({ id: true });
export type InsertOpportunityRisk = z.infer<typeof insertOpportunityRiskSchema>;
export type OpportunityRisk = typeof opportunitiesRisks.$inferSelect;

// ==================== MILESTONES ====================
export const milestones = sqliteTable("milestones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  msId: text("ms_id").notNull().unique(),
  date: text("date").notNull(),
  title: text("title").notNull(),
  regulation: text("regulation").notNull(),
  description: text("description").notNull(),
  impactLevel: text("impact_level").notNull(),
  suites: text("suites").notNull(),
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({ id: true });
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = typeof milestones.$inferSelect;

// ==================== SCAN LOG ====================
export const scanLogs = sqliteTable("scan_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  startedAt: text("started_at").notNull(),
  completedAt: text("completed_at"),
  status: text("status").notNull(), // running, completed, failed
  newSignals: integer("new_signals").default(0),
  summary: text("summary"),
});

export const insertScanLogSchema = createInsertSchema(scanLogs).omit({ id: true });
export type InsertScanLog = z.infer<typeof insertScanLogSchema>;
export type ScanLog = typeof scanLogs.$inferSelect;

// ==================== DASHBOARD META ====================
export const dashboardMeta = sqliteTable("dashboard_meta", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

// Weekly changes, tell-clients, prepare-for
export const advisoryItems = sqliteTable("advisory_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemId: text("item_id").notNull().unique(),
  category: text("category").notNull(), // weekly-change, tell-clients, prepare-for
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date"),
  source: text("source"),
  horizon: text("horizon"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertAdvisoryItemSchema = createInsertSchema(advisoryItems).omit({ id: true });
export type InsertAdvisoryItem = z.infer<typeof insertAdvisoryItemSchema>;
export type AdvisoryItem = typeof advisoryItems.$inferSelect;
