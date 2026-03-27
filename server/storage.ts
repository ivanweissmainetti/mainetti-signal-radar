import {
  signals, regulations, stakeholders, competitors,
  opportunitiesRisks, milestones, scanLogs, dashboardMeta, advisoryItems,
  type Signal, type InsertSignal,
  type Regulation, type InsertRegulation,
  type Stakeholder, type InsertStakeholder,
  type Competitor, type InsertCompetitor,
  type OpportunityRisk, type InsertOpportunityRisk,
  type Milestone, type InsertMilestone,
  type ScanLog, type InsertScanLog,
  type AdvisoryItem, type InsertAdvisoryItem,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, desc, sql } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

export interface IStorage {
  // Signals
  getAllSignals(): Signal[];
  getSignalById(signalId: string): Signal | undefined;
  createSignal(signal: InsertSignal): Signal;
  getSignalCount(): number;

  // Regulations
  getAllRegulations(): Regulation[];
  createRegulation(reg: InsertRegulation): Regulation;

  // Stakeholders
  getAllStakeholders(): Stakeholder[];
  createStakeholder(stk: InsertStakeholder): Stakeholder;

  // Competitors
  getAllCompetitors(): Competitor[];
  createCompetitor(comp: InsertCompetitor): Competitor;

  // Opportunities & Risks
  getAllOpportunitiesRisks(): OpportunityRisk[];
  createOpportunityRisk(or: InsertOpportunityRisk): OpportunityRisk;

  // Milestones
  getAllMilestones(): Milestone[];
  createMilestone(ms: InsertMilestone): Milestone;

  // Scan logs
  createScanLog(log: InsertScanLog): ScanLog;
  updateScanLog(id: number, updates: Partial<ScanLog>): void;
  getLatestScan(): ScanLog | undefined;

  // Advisory items
  getAllAdvisoryItems(): AdvisoryItem[];
  createAdvisoryItem(item: InsertAdvisoryItem): AdvisoryItem;

  // Meta
  getMeta(key: string): string | undefined;
  setMeta(key: string, value: string): void;
}

export class DatabaseStorage implements IStorage {
  // Signals
  getAllSignals(): Signal[] {
    return db.select().from(signals).all();
  }
  getSignalById(signalId: string): Signal | undefined {
    return db.select().from(signals).where(eq(signals.signalId, signalId)).get();
  }
  createSignal(signal: InsertSignal): Signal {
    return db.insert(signals).values(signal).returning().get();
  }
  getSignalCount(): number {
    const result = db.select({ count: sql<number>`count(*)` }).from(signals).get();
    return result?.count ?? 0;
  }

  // Regulations
  getAllRegulations(): Regulation[] {
    return db.select().from(regulations).all();
  }
  createRegulation(reg: InsertRegulation): Regulation {
    return db.insert(regulations).values(reg).returning().get();
  }

  // Stakeholders
  getAllStakeholders(): Stakeholder[] {
    return db.select().from(stakeholders).all();
  }
  createStakeholder(stk: InsertStakeholder): Stakeholder {
    return db.insert(stakeholders).values(stk).returning().get();
  }

  // Competitors
  getAllCompetitors(): Competitor[] {
    return db.select().from(competitors).all();
  }
  createCompetitor(comp: InsertCompetitor): Competitor {
    return db.insert(competitors).values(comp).returning().get();
  }

  // Opportunities & Risks
  getAllOpportunitiesRisks(): OpportunityRisk[] {
    return db.select().from(opportunitiesRisks).all();
  }
  createOpportunityRisk(or: InsertOpportunityRisk): OpportunityRisk {
    return db.insert(opportunitiesRisks).values(or).returning().get();
  }

  // Milestones
  getAllMilestones(): Milestone[] {
    return db.select().from(milestones).all();
  }
  createMilestone(ms: InsertMilestone): Milestone {
    return db.insert(milestones).values(ms).returning().get();
  }

  // Scan logs
  createScanLog(log: InsertScanLog): ScanLog {
    return db.insert(scanLogs).values(log).returning().get();
  }
  updateScanLog(id: number, updates: Partial<ScanLog>): void {
    db.update(scanLogs).set(updates).where(eq(scanLogs.id, id)).run();
  }
  getLatestScan(): ScanLog | undefined {
    return db.select().from(scanLogs).orderBy(desc(scanLogs.id)).limit(1).get();
  }

  // Advisory items
  getAllAdvisoryItems(): AdvisoryItem[] {
    return db.select().from(advisoryItems).all();
  }
  createAdvisoryItem(item: InsertAdvisoryItem): AdvisoryItem {
    return db.insert(advisoryItems).values(item).returning().get();
  }

  // Meta
  getMeta(key: string): string | undefined {
    const row = db.select().from(dashboardMeta).where(eq(dashboardMeta.key, key)).get();
    return row?.value;
  }
  setMeta(key: string, value: string): void {
    const existing = db.select().from(dashboardMeta).where(eq(dashboardMeta.key, key)).get();
    if (existing) {
      db.update(dashboardMeta).set({ value }).where(eq(dashboardMeta.key, key)).run();
    } else {
      db.insert(dashboardMeta).values({ key, value }).run();
    }
  }
}

export const storage = new DatabaseStorage();
