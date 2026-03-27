import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ==================== SIGNALS ====================
  app.get("/api/signals", (_req, res) => {
    const all = storage.getAllSignals();
    // Parse JSON fields for the client
    const parsed = all.map(s => ({
      ...s,
      suites: JSON.parse(s.suites),
    }));
    res.json(parsed);
  });

  // ==================== REGULATIONS ====================
  app.get("/api/regulations", (_req, res) => {
    const all = storage.getAllRegulations();
    const parsed = all.map(r => ({
      ...r,
      suites: JSON.parse(r.suites),
      keyRequirements: JSON.parse(r.keyRequirements),
    }));
    res.json(parsed);
  });

  // ==================== STAKEHOLDERS ====================
  app.get("/api/stakeholders", (_req, res) => {
    res.json(storage.getAllStakeholders());
  });

  // ==================== COMPETITORS ====================
  app.get("/api/competitors", (_req, res) => {
    const all = storage.getAllCompetitors();
    const parsed = all.map(c => ({
      ...c,
      recentMoves: JSON.parse(c.recentMoves),
      overlapAreas: JSON.parse(c.overlapAreas),
    }));
    res.json(parsed);
  });

  // ==================== OPPORTUNITIES & RISKS ====================
  app.get("/api/opportunities-risks", (_req, res) => {
    const all = storage.getAllOpportunitiesRisks();
    const parsed = all.map(or => ({
      ...or,
      suites: JSON.parse(or.suites),
    }));
    res.json(parsed);
  });

  // ==================== MILESTONES ====================
  app.get("/api/milestones", (_req, res) => {
    const all = storage.getAllMilestones();
    const parsed = all.map(m => ({
      ...m,
      suites: JSON.parse(m.suites),
    }));
    res.json(parsed);
  });

  // ==================== ADVISORY ITEMS ====================
  app.get("/api/advisory", (_req, res) => {
    res.json(storage.getAllAdvisoryItems());
  });

  // ==================== DASHBOARD META ====================
  app.get("/api/meta/:key", (req, res) => {
    const val = storage.getMeta(req.params.key);
    res.json({ key: req.params.key, value: val ?? null });
  });

  // ==================== SCAN STATUS ====================
  app.get("/api/scan/status", (_req, res) => {
    const latest = storage.getLatestScan();
    res.json(latest ?? { status: "never" });
  });

  // ==================== TRIGGER SCAN ====================
  app.post("/api/scan/trigger", async (_req, res) => {
    // Check if a scan is already running
    const latest = storage.getLatestScan();
    if (latest && latest.status === "running") {
      return res.status(409).json({ error: "Scan already in progress", scan: latest });
    }

    // Create a new scan log entry
    const scanLog = storage.createScanLog({
      startedAt: new Date().toISOString(),
      status: "running",
      newSignals: 0,
      summary: null,
      completedAt: null,
    });

    // Return immediately — the scan runs in the background
    res.json({ message: "Scan started", scanId: scanLog.id });

    // Run the scan asynchronously
    try {
      const result = await runIntelligenceScan();
      storage.updateScanLog(scanLog.id, {
        status: "completed",
        completedAt: new Date().toISOString(),
        newSignals: result.newSignalCount,
        summary: result.summary,
      });
      // Update last scan timestamp
      storage.setMeta("lastScanAt", new Date().toISOString());
    } catch (err: any) {
      storage.updateScanLog(scanLog.id, {
        status: "failed",
        completedAt: new Date().toISOString(),
        summary: `Error: ${err.message}`,
      });
    }
  });

  // ==================== KPIs ====================
  app.get("/api/kpis", (_req, res) => {
    const all = storage.getAllSignals();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalSignals = all.length;
    const criticalAlerts = all.filter(s => s.impactLevel === "critical").length;
    const highImpact = all.filter(s => s.impactLevel === "critical" || s.impactLevel === "high").length;
    const thisWeek = all.filter(s => new Date(s.date) >= weekAgo).length;
    const actionRequired = all.filter(s => s.status === "action-required").length;

    const lastScan = storage.getMeta("lastScanAt");

    res.json({ totalSignals, criticalAlerts, highImpact, thisWeek, actionRequired, lastScanAt: lastScan ?? null });
  });

  return httpServer;
}

// ==================== INTELLIGENCE SCAN LOGIC ====================
// This is the core scan function that searches for new signals
async function runIntelligenceScan(): Promise<{ newSignalCount: number; summary: string }> {
  const searchQueries = [
    "EU PPWR packaging regulation 2026 implementation",
    "EU Digital Product Passport textile fashion 2026",
    "EU ESPR ecodesign sustainable products 2026",
    "EU greenwashing Green Claims Directive packaging 2026",
    "Avery Dennison SML RFID packaging 2026",
    "fashion retail packaging sustainability trends 2026",
    "EU EPR packaging extended producer responsibility 2026",
    "luxury fashion brand packaging circular economy 2026",
  ];

  let allResults: Array<{ title: string; snippet: string; url: string }> = [];

  // Execute web searches
  for (const query of searchQueries) {
    try {
      const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`, {
        headers: {
          "Accept": "application/json",
          "Accept-Encoding": "gzip",
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.web?.results) {
          allResults.push(...data.web.results.map((r: any) => ({
            title: r.title || "",
            snippet: r.description || "",
            url: r.url || "",
          })));
        }
      }
    } catch {
      // If search fails, continue — we'll still process what we have
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = allResults.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });

  // Classify results and check for new signals
  let newSignalCount = 0;
  const existingSignals = storage.getAllSignals();
  const existingTitles = new Set(existingSignals.map(s => s.title.toLowerCase()));

  for (const result of unique) {
    // Skip if we already have a signal with very similar title
    const titleLower = result.title.toLowerCase();
    const isDuplicate = Array.from(existingTitles).some(existing => {
      const overlap = titleLower.split(" ").filter(w => w.length > 4 && existing.includes(w)).length;
      return overlap >= 3;
    });

    if (isDuplicate) continue;

    // Classify the result
    const classified = classifySearchResult(result);
    if (!classified) continue;

    // Generate a new signal ID
    const count = storage.getSignalCount();
    const newId = `SIG-${String(count + 1).padStart(3, "0")}`;

    try {
      storage.createSignal({
        signalId: newId,
        title: result.title.substring(0, 200),
        summary: result.snippet.substring(0, 500),
        whyItMatters: classified.whyItMatters,
        clientImplication: classified.clientImplication,
        suggestedAction: classified.suggestedAction,
        type: classified.type,
        impactLevel: classified.impactLevel,
        suites: JSON.stringify(classified.suites),
        timeHorizon: classified.timeHorizon,
        geography: classified.geography,
        confidence: "medium",
        status: "monitoring",
        date: new Date().toISOString().split("T")[0],
        source: new URL(result.url).hostname.replace("www.", ""),
        sourceUrl: result.url,
      });
      newSignalCount++;
      existingTitles.add(titleLower);
    } catch {
      // Skip on duplicate key or other insert errors
    }
  }

  return {
    newSignalCount,
    summary: `Scanned ${searchQueries.length} queries, found ${unique.length} results, added ${newSignalCount} new signals.`,
  };
}

function classifySearchResult(result: { title: string; snippet: string; url: string }) {
  const text = `${result.title} ${result.snippet}`.toLowerCase();

  // Determine type
  let type = "market-trend";
  if (text.includes("regulation") || text.includes("directive") || text.includes("ppwr") || text.includes("espr") || text.includes("legislation")) type = "regulation";
  else if (text.includes("avery") || text.includes("sml") || text.includes("checkpoint") || text.includes("sealed air") || text.includes("ds smith")) type = "competitor";
  else if (text.includes("lvmh") || text.includes("inditex") || text.includes("h&m") || text.includes("kering") || text.includes("zara") || text.includes("primark")) type = "client-signal";

  // Determine suites
  const suites: string[] = [];
  if (text.includes("label") || text.includes("tag") || text.includes("brand") || text.includes("patch") || text.includes("trim") || text.includes("dpp") || text.includes("digital product passport")) suites.push("Product Branding");
  if (text.includes("hanger") || text.includes("retail") || text.includes("store") || text.includes("display") || text.includes("merchandis")) suites.push("Retail Experience");
  if (text.includes("packaging") || text.includes("supply chain") || text.includes("logistics") || text.includes("transit") || text.includes("fulfilment") || text.includes("epr") || text.includes("recycl")) suites.push("Supply Chain / Product Movement");
  if (suites.length === 0) suites.push("Supply Chain / Product Movement"); // default

  // Determine impact
  let impactLevel = "medium";
  if (text.includes("mandatory") || text.includes("ban") || text.includes("enters force") || text.includes("critical")) impactLevel = "high";
  if (text.includes("proposed") || text.includes("consultation") || text.includes("draft")) impactLevel = "medium";

  // Determine geography
  let geography = "EU-wide";
  if (text.includes("uk") || text.includes("united kingdom") || text.includes("defra")) geography = "UK";
  else if (text.includes("france") || text.includes("french")) geography = "France";
  else if (text.includes("germany") || text.includes("german")) geography = "Germany";
  else if (text.includes("global") || text.includes("worldwide")) geography = "Global";

  // Determine time horizon
  let timeHorizon = "short-term";
  if (text.includes("2026") || text.includes("immediate") || text.includes("now")) timeHorizon = "immediate";
  else if (text.includes("2027") || text.includes("2028")) timeHorizon = "medium-term";
  else if (text.includes("2030") || text.includes("long-term")) timeHorizon = "long-term";

  // Skip irrelevant results
  if (!text.includes("packag") && !text.includes("textile") && !text.includes("fashion") && !text.includes("retail") && !text.includes("brand") && !text.includes("sustainability") && !text.includes("circular") && !text.includes("label") && !text.includes("hanger") && !text.includes("epr") && !text.includes("dpp")) {
    return null;
  }

  return {
    type,
    impactLevel,
    suites,
    timeHorizon,
    geography,
    whyItMatters: `New intelligence detected: ${result.title}. This development could affect Mainetti's positioning and client conversations.`,
    clientImplication: `Brands and retailers should monitor this development for potential impact on their packaging, branding, and supply chain operations.`,
    suggestedAction: `Review this signal and assess commercial relevance. Consider briefing affected client-facing teams.`,
  };
}
