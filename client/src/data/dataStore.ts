// Client-side data store that provides the same API as the server
// Imports all seed data and manages in-memory state

import type {
  Signal,
  Regulation,
  Stakeholder,
  Competitor,
  OpportunityRisk,
  Milestone,
  AdvisoryItem,
  KPIs,
  ScanStatus,
} from "@/lib/types";

// Import signal data
import {
  signals as signalsData,
  regulations as regulationsData,
  stakeholders as stakeholdersData,
  competitors as competitorsData,
  opportunitiesRisks as opportunitiesRisksData,
  milestones as milestonesData,
  whatToTellClients,
  whatToPrepareFor,
  weeklyChanges,
} from "./signals";

// Transform raw seed data to API format (add numeric id, parse arrays)
const transformSignals = (data: any[]): Signal[] => {
  return data.map((item, idx) => ({
    id: idx + 1,
    signalId: item.id,
    title: item.title,
    summary: item.summary,
    whyItMatters: item.whyItMatters,
    clientImplication: item.clientImplication,
    suggestedAction: item.suggestedAction,
    type: item.type,
    impactLevel: item.impactLevel,
    suites: Array.isArray(item.suites) ? item.suites : [item.suites],
    timeHorizon: item.timeHorizon,
    geography: item.geography,
    confidence: item.confidence,
    status: item.status,
    date: item.date,
    source: item.source,
    sourceUrl: item.sourceUrl || null,
  }));
};

const transformRegulations = (data: any[]): Regulation[] => {
  return data.map((item, idx) => ({
    id: idx + 1,
    regId: item.id,
    name: item.name,
    shortName: item.shortName,
    status: item.status,
    nextMilestone: item.nextMilestone,
    nextMilestoneDate: item.nextMilestoneDate,
    impactLevel: item.impactLevel,
    suites: Array.isArray(item.suites) ? item.suites : [item.suites],
    geography: item.geography,
    description: item.description,
    keyRequirements: Array.isArray(item.keyRequirements)
      ? item.keyRequirements
      : [item.keyRequirements],
  }));
};

const transformStakeholders = (data: any[]): Stakeholder[] => {
  return data.map((item, idx) => ({
    id: idx + 1,
    stkId: item.id,
    name: item.name,
    organization: item.organization,
    category: item.category,
    geography: item.geography,
    importance: item.importance,
    role: item.role,
    relevance: item.relevance,
  }));
};

const transformCompetitors = (data: any[]): Competitor[] => {
  return data.map((item, idx) => ({
    id: idx + 1,
    compId: item.id,
    name: item.name,
    description: item.description,
    threatLevel: item.threatLevel,
    recentMoves: Array.isArray(item.recentMoves)
      ? item.recentMoves
      : [item.recentMoves],
    overlapAreas: Array.isArray(item.overlapAreas)
      ? item.overlapAreas
      : [item.overlapAreas],
    revenue: item.revenue || null,
    employees: item.employees || null,
    keyStrength: item.keyStrength,
  }));
};

const transformOpportunitiesRisks = (data: any[]): OpportunityRisk[] => {
  return data.map((item, idx) => ({
    id: idx + 1,
    orId: item.id,
    title: item.title,
    description: item.description,
    type: item.type,
    priority: item.priority,
    suites: Array.isArray(item.suites) ? item.suites : [item.suites],
    timeHorizon: item.timeHorizon,
    impactLevel: item.impactLevel,
  }));
};

const transformMilestones = (data: any[]): Milestone[] => {
  return data.map((item, idx) => ({
    id: idx + 1,
    msId: item.id,
    date: item.date,
    title: item.title,
    regulation: item.regulation,
    description: item.description,
    impactLevel: item.impactLevel,
    suites: Array.isArray(item.suites) ? item.suites : [item.suites],
  }));
};

// Create advisory items from the different sources
const createAdvisoryItems = (): AdvisoryItem[] => {
  const items: AdvisoryItem[] = [];
  let id = 1;

  // Add "tell clients" items
  whatToTellClients.forEach((item: any, idx: number) => {
    items.push({
      id: id++,
      itemId: item.id,
      category: "tell-clients",
      title: item.title,
      description: item.description,
      date: null,
      source: null,
      horizon: null,
      sortOrder: idx,
    });
  });

  // Add "prepare for" items
  whatToPrepareFor.forEach((item: any, idx: number) => {
    items.push({
      id: id++,
      itemId: item.id,
      category: "prepare-for",
      title: item.title,
      description: item.description,
      date: null,
      source: null,
      horizon: item.horizon || null,
      sortOrder: idx,
    });
  });

  // Add weekly changes
  weeklyChanges.forEach((item: any, idx: number) => {
    items.push({
      id: id++,
      itemId: item.id,
      category: "weekly-change",
      title: item.title,
      description: "",
      date: item.date || null,
      source: item.source || null,
      horizon: null,
      sortOrder: idx,
    });
  });

  return items;
};

// Initialize transformed data
let allSignals: Signal[] = transformSignals(signalsData);
let allRegulations: Regulation[] = transformRegulations(regulationsData);
let allStakeholders: Stakeholder[] = transformStakeholders(stakeholdersData);
let allCompetitors: Competitor[] = transformCompetitors(competitorsData);
let allOpportunitiesRisks: OpportunityRisk[] = transformOpportunitiesRisks(
  opportunitiesRisksData
);
let allMilestones: Milestone[] = transformMilestones(milestonesData);
let allAdvisoryItems: AdvisoryItem[] = createAdvisoryItems();

// Scan tracking
let scanStatus: ScanStatus = {
  status: "never",
  startedAt: undefined,
  completedAt: null,
  newSignals: 0,
  summary: null,
};

let lastScanAt: string | null = typeof localStorage !== 'undefined' ? localStorage.getItem("mainetti_lastScanAt") : null;
let nextSignalId = allSignals.length + 1;

// ==================== PUBLIC API ====================

export const dataStore = {
  // Signals
  getAllSignals(): Signal[] {
    return [...allSignals];
  },

  addSignal(signal: Omit<Signal, "id">): Signal {
    const newSignal: Signal = {
      ...signal,
      id: nextSignalId++,
    };
    allSignals = [newSignal, ...allSignals];
    return newSignal;
  },

  // Regulations
  getAllRegulations(): Regulation[] {
    return [...allRegulations];
  },

  // Stakeholders
  getAllStakeholders(): Stakeholder[] {
    return [...allStakeholders];
  },

  // Competitors
  getAllCompetitors(): Competitor[] {
    return [...allCompetitors];
  },

  // Opportunities & Risks
  getAllOpportunitiesRisks(): OpportunityRisk[] {
    return [...allOpportunitiesRisks];
  },

  // Milestones
  getAllMilestones(): Milestone[] {
    return [...allMilestones];
  },

  // Advisory Items
  getAllAdvisoryItems(): AdvisoryItem[] {
    return [...allAdvisoryItems];
  },

  // KPIs
  getKPIs(): KPIs {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalSignals = allSignals.length;
    const criticalAlerts = allSignals.filter(
      (s) => s.impactLevel === "critical"
    ).length;
    const highImpact = allSignals.filter(
      (s) => s.impactLevel === "critical" || s.impactLevel === "high"
    ).length;
    const thisWeek = allSignals.filter(
      (s) => new Date(s.date) >= weekAgo
    ).length;
    const actionRequired = allSignals.filter(
      (s) => s.status === "action-required"
    ).length;

    return {
      totalSignals,
      criticalAlerts,
      highImpact,
      thisWeek,
      actionRequired,
      lastScanAt,
    };
  },

  // Scan status
  getScanStatus(): ScanStatus {
    return { ...scanStatus };
  },

  // Trigger a live scan (fetches new news and adds signals)
  async triggerScan(): Promise<ScanStatus> {
    // Prevent concurrent scans
    if (scanStatus.status === "running") {
      throw new Error("Scan already in progress");
    }

    scanStatus = {
      status: "running",
      startedAt: new Date().toISOString(),
      completedAt: null,
      newSignals: 0,
      summary: null,
    };

    try {
      const result = await runLiveScan();
      scanStatus = {
        status: "completed",
        startedAt: scanStatus.startedAt,
        completedAt: new Date().toISOString(),
        newSignals: result.count,
        summary: result.summary,
      };
      lastScanAt = new Date().toISOString();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem("mainetti_lastScanAt", lastScanAt);
      }
    } catch (error: any) {
      scanStatus = {
        status: "failed",
        startedAt: scanStatus.startedAt,
        completedAt: new Date().toISOString(),
        newSignals: 0,
        summary: `Error: ${error.message}`,
      };
    }

    return { ...scanStatus };
  },
};

// ==================== LIVE SCAN LOGIC ====================

export async function runLiveScan(): Promise<{
  count: number;
  summary: string;
}> {
  try {
    const { fetchedSignals, count } = await fetchAndParseNews();

    // Deduplicate
    const existingTitles = new Set(allSignals.map((s) => s.title.toLowerCase()));
    let addedCount = 0;

    for (const signal of fetchedSignals) {
      if (!existingTitles.has(signal.title.toLowerCase())) {
        const newSignal = dataStore.addSignal(signal);
        existingTitles.add(newSignal.title.toLowerCase());
        addedCount++;
      }
    }

    return {
      count: addedCount,
      summary: `Scanned news feeds, found ${count} results, added ${addedCount} new signals.`,
    };
  } catch (error: any) {
    return {
      count: 0,
      summary: `Scan error: ${error.message}`,
    };
  }
}

// ==================== NEWS FETCHING & PARSING ====================

async function fetchAndParseNews(): Promise<{
  fetchedSignals: Omit<Signal, "id">[];
  count: number;
}> {
  const searchQueries = [
    "EU PPWR packaging regulation 2026",
    "EU Digital Product Passport textile 2026",
    "EU ESPR ecodesign sustainable products 2026",
    "EU greenwashing packaging 2026",
    "Avery Dennison RFID packaging",
    "fashion retail packaging sustainability",
    "EU EPR extended producer responsibility",
    "luxury fashion brand packaging circular",
  ];

  let allNewsItems: Array<{ title: string; snippet: string; url: string }> = [];

  // Fetch from Google News RSS via CORS proxy
  for (const query of searchQueries) {
    try {
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;

      const response = await fetch(proxyUrl);
      if (response.ok) {
        const xml = await response.text();
        const items = parseGoogleNewsRSS(xml);
        allNewsItems.push(...items);
      }
    } catch (error) {
      // Silently continue if one query fails
      console.error(`Failed to fetch news for query "${query}":`, error);
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = allNewsItems.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  // Classify and convert to signals
  const signals: Omit<Signal, "id">[] = [];
  for (const item of unique) {
    const classified = classifyNewsItem(item);
    if (classified) {
      signals.push(classified);
    }
  }

  return {
    fetchedSignals: signals,
    count: unique.length,
  };
}

function parseGoogleNewsRSS(
  xml: string
): Array<{ title: string; snippet: string; url: string }> {
  const items: Array<{ title: string; snippet: string; url: string }> = [];

  try {
    // Parse XML manually (simple regex-based approach)
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];

      // Extract title
      const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(itemXml);
      const title = titleMatch
        ? decodeHtml(titleMatch[1].replace(/<[^>]+>/g, ""))
        : "";

      // Extract description
      const descMatch = /<description>([\s\S]*?)<\/description>/.exec(itemXml);
      const snippet = descMatch
        ? decodeHtml(descMatch[1].replace(/<[^>]+>/g, ""))
        : "";

      // Extract link
      const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemXml);
      const url = linkMatch ? linkMatch[1].trim() : "";

      if (title && url) {
        items.push({ title, snippet, url });
      }
    }
  } catch (error) {
    console.error("Error parsing RSS:", error);
  }

  return items;
}

function decodeHtml(html: string): string {
  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
  };
  return html.replace(/&[a-z]+;/gi, (entity) => map[entity] || entity);
}

function classifyNewsItem(item: {
  title: string;
  snippet: string;
  url: string;
}): Omit<Signal, "id"> | null {
  const text = `${item.title} ${item.snippet}`.toLowerCase();

  // Determine type
  let type: "regulation" | "competitor" | "market-trend" | "client-signal" =
    "market-trend";
  if (
    text.includes("regulation") ||
    text.includes("directive") ||
    text.includes("ppwr") ||
    text.includes("espr") ||
    text.includes("legislation") ||
    text.includes("compliance")
  ) {
    type = "regulation";
  } else if (
    text.includes("avery") ||
    text.includes("sml") ||
    text.includes("checkpoint") ||
    text.includes("sealed air") ||
    text.includes("ds smith")
  ) {
    type = "competitor";
  } else if (
    text.includes("lvmh") ||
    text.includes("inditex") ||
    text.includes("h&m") ||
    text.includes("kering") ||
    text.includes("zara") ||
    text.includes("primark")
  ) {
    type = "client-signal";
  }

  // Determine suites
  const suites: string[] = [];
  if (
    text.includes("label") ||
    text.includes("tag") ||
    text.includes("brand") ||
    text.includes("patch") ||
    text.includes("trim") ||
    text.includes("dpp") ||
    text.includes("digital product passport")
  ) {
    suites.push("Product Branding");
  }
  if (
    text.includes("hanger") ||
    text.includes("retail") ||
    text.includes("store") ||
    text.includes("display") ||
    text.includes("merchandis")
  ) {
    suites.push("Retail Experience");
  }
  if (
    text.includes("packaging") ||
    text.includes("supply chain") ||
    text.includes("logistics") ||
    text.includes("transit") ||
    text.includes("fulfilment") ||
    text.includes("epr") ||
    text.includes("recycl") ||
    text.includes("waste")
  ) {
    suites.push("Supply Chain / Product Movement");
  }
  if (suites.length === 0) suites.push("Supply Chain / Product Movement");

  // Determine impact level
  let impactLevel: "critical" | "high" | "medium" | "low" = "medium";
  if (
    text.includes("mandatory") ||
    text.includes("ban") ||
    text.includes("enters force") ||
    text.includes("critical") ||
    text.includes("urgent")
  ) {
    impactLevel = "high";
  }
  if (
    text.includes("proposed") ||
    text.includes("consultation") ||
    text.includes("draft")
  ) {
    impactLevel = "medium";
  }

  // Determine geography
  let geography = "EU-wide";
  if (text.includes("uk") || text.includes("united kingdom") || text.includes("defra")) {
    geography = "UK";
  } else if (text.includes("france") || text.includes("french")) {
    geography = "France";
  } else if (text.includes("germany") || text.includes("german")) {
    geography = "Germany";
  } else if (text.includes("global") || text.includes("worldwide")) {
    geography = "Global";
  }

  // Determine time horizon
  let timeHorizon: "immediate" | "short-term" | "medium-term" | "long-term" =
    "short-term";
  if (
    text.includes("2026") ||
    text.includes("immediate") ||
    text.includes("now")
  ) {
    timeHorizon = "immediate";
  } else if (text.includes("2027") || text.includes("2028")) {
    timeHorizon = "medium-term";
  } else if (text.includes("2030") || text.includes("long-term")) {
    timeHorizon = "long-term";
  }

  // Skip irrelevant results
  if (
    !text.includes("packag") &&
    !text.includes("textile") &&
    !text.includes("fashion") &&
    !text.includes("retail") &&
    !text.includes("brand") &&
    !text.includes("sustainability") &&
    !text.includes("circular") &&
    !text.includes("label") &&
    !text.includes("hanger") &&
    !text.includes("epr") &&
    !text.includes("dpp")
  ) {
    return null;
  }

  return {
    signalId: `SIG-${String(nextSignalId).padStart(3, "0")}`,
    title: item.title.substring(0, 200),
    summary: item.snippet.substring(0, 500),
    whyItMatters: `New intelligence detected: ${item.title}. This development could affect Mainetti's positioning and client conversations.`,
    clientImplication: `Brands and retailers should monitor this development for potential impact on their packaging, branding, and supply chain operations.`,
    suggestedAction: `Review this signal and assess commercial relevance. Consider briefing affected client-facing teams.`,
    type,
    impactLevel,
    suites: suites as any,
    timeHorizon,
    geography: geography as any,
    confidence: "medium",
    status: "monitoring",
    date: new Date().toISOString().split("T")[0],
    source: new URL(item.url).hostname.replace("www.", ""),
    sourceUrl: item.url,
  };
}
