// Mainetti Signal Radar — Data File
// All data sourced from research: EU regulation, competitor/market, stakeholders/events

export type ProductSuite = "Product Branding" | "Retail Experience" | "Supply Chain / Product Movement";
export type ImpactLevel = "critical" | "high" | "medium" | "low";
export type SignalType = "regulation" | "competitor" | "market-trend" | "client-signal" | "opportunity" | "risk";
export type TimeHorizon = "immediate" | "short-term" | "medium-term" | "long-term";
export type Geography = "EU-wide" | "France" | "Germany" | "UK" | "Global" | "Asia-Pacific" | "North America";
export type ConfidenceLevel = "confirmed" | "high" | "medium" | "speculative";
export type SignalStatus = "active" | "monitoring" | "action-required" | "resolved";

export interface Signal {
  id: string;
  title: string;
  summary: string;
  whyItMatters: string;
  clientImplication: string;
  suggestedAction: string;
  type: SignalType;
  impactLevel: ImpactLevel;
  suites: ProductSuite[];
  timeHorizon: TimeHorizon;
  geography: Geography;
  confidence: ConfidenceLevel;
  status: SignalStatus;
  date: string;
  source: string;
}

export interface Regulation {
  id: string;
  name: string;
  shortName: string;
  status: string;
  nextMilestone: string;
  nextMilestoneDate: string;
  impactLevel: ImpactLevel;
  suites: ProductSuite[];
  geography: Geography;
  description: string;
  keyRequirements: string[];
}

export interface Stakeholder {
  id: string;
  name: string;
  organization: string;
  category: string;
  geography: Geography;
  importance: "high" | "medium" | "low";
  role: string;
  relevance: string;
}

export interface Competitor {
  id: string;
  name: string;
  description: string;
  threatLevel: "high" | "medium-high" | "medium" | "low-medium" | "low";
  recentMoves: string[];
  overlapAreas: ProductSuite[];
  revenue?: string;
  employees?: string;
  keyStrength: string;
}

export interface OpportunityRisk {
  id: string;
  title: string;
  description: string;
  type: "opportunity" | "risk";
  priority: number;
  suites: ProductSuite[];
  timeHorizon: TimeHorizon;
  impactLevel: ImpactLevel;
}

export interface Milestone {
  id: string;
  date: string;
  title: string;
  regulation: string;
  description: string;
  impactLevel: ImpactLevel;
  suites: ProductSuite[];
}

// ==================== SIGNALS ====================

export const signals: Signal[] = [
  {
    id: "SIG-001",
    title: "PPWR enters force 12 August 2026",
    summary: "The EU Packaging and Packaging Waste Regulation applies across all 27 Member States from August 12, imposing chemical restrictions, EPR registration, and traceability obligations.",
    whyItMatters: "This is a market-access prerequisite. All packaging placed on EU market must comply — no grace period after August 12.",
    clientImplication: "Brands need Declarations of Conformity for every packaging type. Labels must carry batch/serial numbers and manufacturer identification.",
    suggestedAction: "Complete full packaging audit; collect DoCs from suppliers; map EPR producer obligations by Member State.",
    type: "regulation",
    impactLevel: "critical",
    suites: ["Product Branding", "Retail Experience", "Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "action-required",
    date: "2026-03-20",
    source: "European Commission / EUR-Lex"
  },
  {
    id: "SIG-002",
    title: "ESPR unsold goods destruction ban — July 19, 2026",
    summary: "Large and medium enterprises cannot destroy unsold textiles and footwear from July 19, 2026. Direct ESPR provision, no further legislation needed.",
    whyItMatters: "Creates structural demand for recommerce, donation, and recycling infrastructure. Inventory management becomes critical.",
    clientImplication: "Brands need RFID-enabled inventory tracking to prove compliance. Hangers with embedded digital identity become essential.",
    suggestedAction: "Position RFID/traceability solutions for inventory management compliance with large retail customers.",
    type: "regulation",
    impactLevel: "critical",
    suites: ["Retail Experience", "Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "action-required",
    date: "2026-03-18",
    source: "Baker McKenzie / EC Green Forum"
  },
  {
    id: "SIG-003",
    title: "Greenwashing rules active September 27, 2026",
    summary: "ECGT bans generic environmental claims (eco-friendly, green, sustainable) without certification. Carbon offset-based neutrality claims flatly banned.",
    whyItMatters: "All sustainability claims on labels and packaging must be certifiable. Existing products in distribution must comply — no transitional stock period.",
    clientImplication: "Every hangtag, label, and package with sustainability language needs audit. Non-compliant claims are legal risk.",
    suggestedAction: "Audit all sustainability claims on Mainetti products and client materials. Remove or substantiate generic environmental claims.",
    type: "regulation",
    impactLevel: "critical",
    suites: ["Product Branding", "Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "action-required",
    date: "2026-03-15",
    source: "Hogan Lovells / Inside Energy & Environment"
  },
  {
    id: "SIG-004",
    title: "Avery Dennison Optica RFID suite gaining traction",
    summary: "Avery Dennison's Optica portfolio provides end-to-end RFID-enabled supply chain visibility. Demo partners include Amazon and Zebra Technologies.",
    whyItMatters: "Avery Dennison is positioning as 'materials science + digital identification' — directly competing in RFID labels, digital identity, and DPP solutions.",
    clientImplication: "Brands may default to Avery Dennison for bundled DPP + label solutions unless Mainetti offers comparable digital integration.",
    suggestedAction: "Develop RFID-integrated label + DPP-ready tag offering. Assess competitive positioning against atma.io platform.",
    type: "competitor",
    impactLevel: "high",
    suites: ["Product Branding"],
    timeHorizon: "immediate",
    geography: "Global",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-03-10",
    source: "Avery Dennison NRF 2025"
  },
  {
    id: "SIG-005",
    title: "SML Group secures $600M PE investment",
    summary: "FountainVest and CPE invested in SML, valuing the company at >$600M. Capital earmarked for digital innovation, geographic expansion, and R&D acceleration.",
    whyItMatters: "SML is Mainetti's closest direct competitor in brand identification. PE backing supercharges R&D, digital ID, and DPP capabilities.",
    clientImplication: "SML can now outspend on innovation. InfuseRFID + DPP represents direct challenge to any Mainetti move into digital identity.",
    suggestedAction: "Assess where SML is winning new mandates. Differentiate on end-to-end supply: branding + digital ID in one.",
    type: "competitor",
    impactLevel: "high",
    suites: ["Product Branding", "Retail Experience"],
    timeHorizon: "immediate",
    geography: "Global",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-03-05",
    source: "PR Newswire / SML Group"
  },
  {
    id: "SIG-006",
    title: "Digital Product Passport — textile delegated act 2027",
    summary: "EU DPP for textiles confirmed for 2027 delegated act adoption with mandatory compliance 2028–2029. Every garment needs QR/RFID data carrier.",
    whyItMatters: "This is the single biggest structural opportunity for Mainetti. Labels, hangtags, and packaging are the physical carrier for DPP data.",
    clientImplication: "Brands need QR-enabled label infrastructure in place by late 2026/early 2027. 62.5 billion DPPs projected by 2030.",
    suggestedAction: "Launch pilot capability for QR-code-integrated labels and hangtags. Begin supplier data audit for DPP data fields.",
    type: "regulation",
    impactLevel: "critical",
    suites: ["Product Branding", "Supply Chain / Product Movement"],
    timeHorizon: "short-term",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "action-required",
    date: "2026-03-12",
    source: "Caruma / Carbonfact"
  },
  {
    id: "SIG-007",
    title: "LVMH zero virgin fossil-based plastic by 2026",
    summary: "LVMH committed to eliminating virgin fossil-based plastic from customer packaging this year. Every dust bag, shopping bag, and protective item being replaced.",
    whyItMatters: "Immediate commercial trigger — LVMH is replacing all non-recycled/non-bio-based packaging now.",
    clientImplication: "Mainetti must have proactive plastic-free packaging offer for LVMH and other luxury brands immediately.",
    suggestedAction: "Proactively offer plastic-free boxes, dust bags, FSC labels to luxury client base. Accelerate Paperform range.",
    type: "client-signal",
    impactLevel: "high",
    suites: ["Product Branding", "Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    geography: "Global",
    confidence: "confirmed",
    status: "action-required",
    date: "2026-03-08",
    source: "LVMH LIFE 360"
  },
  {
    id: "SIG-008",
    title: "CBAM definitive regime now live — steel/aluminium imports",
    summary: "Carbon Border Adjustment Mechanism entered financial regime January 1, 2026. EU importers of steel/aluminium incur liability for embedded emissions.",
    whyItMatters: "Mainetti imports steel wire (hangers) and aluminium (structural packaging) from non-EU locations. Direct cost impact.",
    clientImplication: "Hanger and packaging costs may increase if embedded emissions are high. CBAM certificates must be purchased for 2026 imports.",
    suggestedAction: "Assess EU import volumes vs. 50-tonne threshold. Evaluate embedded emissions profile of non-EU suppliers. Register as ACD if needed by March 31.",
    type: "regulation",
    impactLevel: "high",
    suites: ["Retail Experience", "Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "action-required",
    date: "2026-01-14",
    source: "European Commission CBAM"
  },
  {
    id: "SIG-009",
    title: "PPWR PFAS ban on food-contact packaging — August 2026",
    summary: "PFAS restrictions apply from August 12: 25 ppb per individual PFAS, 250 ppb sum, 50 ppm total fluorine for food-contact packaging.",
    whyItMatters: "Any Mainetti packaging used in food-adjacent retail contexts needs immediate PFAS compliance verification.",
    clientImplication: "Brands using polybags or packaging with food-adjacent applications must verify PFAS compliance before August deadline.",
    suggestedAction: "Verify PFAS compliance for any food-contact packaging. Engage ECHA guidance. Test all flexible packaging materials.",
    type: "regulation",
    impactLevel: "high",
    suites: ["Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "action-required",
    date: "2026-03-01",
    source: "Gleiss Lutz / PPWR Regulation"
  },
  {
    id: "SIG-010",
    title: "EU de minimis customs exemption ending July 1, 2026",
    summary: "€3 customs duty per tariff heading on low-value B2C parcels from July 2026. France already added €2 handling fee from March 2026.",
    whyItMatters: "E-commerce packaging economics change fundamentally. Brands may shift to bulk EU importation — changing packaging format requirements.",
    clientImplication: "Fashion e-commerce brands will need different packaging formats for EU bulk distribution vs direct-to-consumer.",
    suggestedAction: "Assess e-commerce packaging product lines for impact. Advise brand clients on shift to EU warehouse distribution.",
    type: "regulation",
    impactLevel: "medium",
    suites: ["Supply Chain / Product Movement"],
    timeHorizon: "short-term",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-02-15",
    source: "Reuters / Maersk"
  },
  {
    id: "SIG-011",
    title: "Checkpoint Systems C&A RFID rollout — 1,300+ stores",
    summary: "C&A won 'Best Retail Implementation' at RFID Journal Awards 2025 for Checkpoint-powered RFID across 1,300+ stores in 17 countries.",
    whyItMatters: "Inventory accuracy improved from 70% to 95%, enabling 5%+ sales uplift. Sets the benchmark for fashion RFID adoption.",
    clientImplication: "Retailers increasingly expect factory-level RFID tagging. Mainetti labels must accommodate RFID inlays.",
    suggestedAction: "Ensure labels/hangtags can carry RFID inlays. Assess Checkpoint as potential partner or competitor in this space.",
    type: "competitor",
    impactLevel: "medium",
    suites: ["Product Branding", "Retail Experience"],
    timeHorizon: "immediate",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-02-20",
    source: "Checkpoint Systems / RFID Journal Awards"
  },
  {
    id: "SIG-012",
    title: "Braiform reuse programme reaches 300M hangers/year",
    summary: "Braiform's hanger reuse programme now saves 300 million hangers annually from landfills, with advanced soft mechanical recycling for damaged units.",
    whyItMatters: "Sets the standard for circular hanger economics. Retailers want single-partner closed-loop reuse programmes.",
    clientImplication: "Fast fashion retailers consolidating to fewer hanger suppliers who can operate closed-loop reuse. Braiform is the benchmark.",
    suggestedAction: "Strengthen Mainetti's reuse/return infrastructure. Quantify and publicize Hangerloop metrics to match Braiform's 300M claim.",
    type: "competitor",
    impactLevel: "high",
    suites: ["Retail Experience"],
    timeHorizon: "immediate",
    geography: "Global",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-01-20",
    source: "Future Market Insights"
  },
  {
    id: "SIG-013",
    title: "Ralph Lauren QR codes on 200M+ garments",
    summary: "Ralph Lauren has deployed QR codes on over 200 million garments globally, demonstrating scale DPP-ready label deployment.",
    whyItMatters: "Proves market readiness for QR-enabled labels at massive scale. Sets expectations for other brands.",
    clientImplication: "QR-enabled hangtags are no longer aspirational — they're operational at scale. Brands will expect similar capability from suppliers.",
    suggestedAction: "Use Ralph Lauren case as reference when pitching QR-integrated labels to other brand clients.",
    type: "market-trend",
    impactLevel: "high",
    suites: ["Product Branding"],
    timeHorizon: "immediate",
    geography: "Global",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-02-10",
    source: "Supercode / Delga Luxury"
  },
  {
    id: "SIG-014",
    title: "EUDR applies December 30, 2026 — paper/wood scope",
    summary: "EU Deforestation Regulation requires plot-level geolocation for wood/pulp sources. Paper packaging and FSC-certified products in scope.",
    whyItMatters: "Mainetti's paper hanger range and paper-based products fall within 'wood and wood-derived products' scope.",
    clientImplication: "FSC certification alone may not suffice — EUDR requires broader documentation including geolocation of source plots.",
    suggestedAction: "Ensure FSC documentation is EUDR-compliant. Monitor April 2026 Simplification Package for packaging exemptions.",
    type: "regulation",
    impactLevel: "high",
    suites: ["Product Branding", "Supply Chain / Product Movement"],
    timeHorizon: "short-term",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-02-25",
    source: "Mayer Brown / European Parliament"
  },
  {
    id: "SIG-015",
    title: "Germany VerpackDG replaces VerpackG on August 12",
    summary: "New German Packaging Law enters force same day as PPWR, expanding LUCID registry to cover B2B and transport packaging producers.",
    whyItMatters: "Dual compliance event — PPWR + VerpackDG simultaneously. Germany is a major market with fines up to €200,000 per violation.",
    clientImplication: "All packaging placed on German market needs LUCID registration under expanded scope. Transport packaging newly covered.",
    suggestedAction: "Ensure LUCID registration and compliance with expanded VerpackDG scope. Plan for August 12 simultaneous compliance.",
    type: "regulation",
    impactLevel: "high",
    suites: ["Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    geography: "Germany",
    confidence: "confirmed",
    status: "action-required",
    date: "2026-02-11",
    source: "SML / Gleiss Lutz"
  },
  {
    id: "SIG-016",
    title: "UK PackUK EPR fee modulation from October 2026",
    summary: "UK EPR for packaging introduces company-specific waste management fees based on recyclability and volume. Modulated green/amber/red fees enforced.",
    whyItMatters: "Fee modulation creates direct cost incentives to redesign packaging. October 2026 is a hard deadline.",
    clientImplication: "Recyclability of Mainetti packaging products directly affects EPR costs. Higher recyclability = lower fees.",
    suggestedAction: "Pre-certify all UK-market packaging materials for recyclability under RAM methodology. Target 'green' fee tier.",
    type: "regulation",
    impactLevel: "high",
    suites: ["Supply Chain / Product Movement", "Product Branding"],
    timeHorizon: "short-term",
    geography: "UK",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-03-10",
    source: "DWF / GOV.UK"
  },
  {
    id: "SIG-017",
    title: "France B2B packaging EPR starts July 2026",
    summary: "France's new professional packaging EPR scheme requires registration with eco-organisation. Green levy payments start July 1, 2026.",
    whyItMatters: "Mainetti supplies transport and retail packaging in France. B2B EPR means registration with Citeo Pro, Leko, or Twiice.",
    clientImplication: "Garment hangers, retail fixtures packaging, and transport packaging all fall under new B2B EPR scope in France.",
    suggestedAction: "Register with approved French eco-organisation for B2B packaging EPR before July 1 deadline.",
    type: "regulation",
    impactLevel: "high",
    suites: ["Retail Experience", "Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    geography: "France",
    confidence: "confirmed",
    status: "action-required",
    date: "2026-03-05",
    source: "Compliancr / S-GE"
  },
  {
    id: "SIG-018",
    title: "Textile EPR now mandatory EU-wide",
    summary: "Revised Waste Framework Directive makes EPR mandatory for textiles, footwear, and accessories. National implementation varies across 2026.",
    whyItMatters: "Structural new obligation for fashion brands — financially responsible for end-of-life textile management.",
    clientImplication: "Brands need supply chain partners who understand textile EPR labeling and traceability. Advisory opportunity for Mainetti.",
    suggestedAction: "Position as advisory partner for fashion clients navigating textile EPR for the first time. Bundle EPR-compliant labels.",
    type: "regulation",
    impactLevel: "medium",
    suites: ["Product Branding"],
    timeHorizon: "short-term",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "monitoring",
    date: "2025-10-01",
    source: "SGS / EU Parliament"
  },
  {
    id: "SIG-019",
    title: "Smurfit Westrock AI-powered packaging design tools",
    summary: "Smurfit Westrock deploying AI tools reducing time-to-market for packaging solutions 'from months to weeks.' Innovation hubs in Richmond and Chicago.",
    whyItMatters: "AI design acceleration in luxury packaging directly competes with Mainetti's custom packaging capabilities.",
    clientImplication: "Luxury brands (LVMH, Kering) may shift to faster AI-assisted packaging design from competitors.",
    suggestedAction: "Evaluate AI design tools for Mainetti's own packaging design workflow. Monitor Smurfit Westrock luxury client wins.",
    type: "competitor",
    impactLevel: "medium",
    suites: ["Product Branding"],
    timeHorizon: "short-term",
    geography: "Global",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-02-28",
    source: "Packaging Dive"
  },
  {
    id: "SIG-020",
    title: "Nexgen/Kiabi paper-free hanger for preloved segment",
    summary: "Nexgen Packaging collaborated with Kiabi's Kidkanai preloved concept store to produce the Ditto hanger — 100% plastic-free, recycled FSC paper fibreboard.",
    whyItMatters: "Signals new market segment (pre-loved fashion) requiring differentiated sustainable hanger solutions.",
    clientImplication: "Preloved/resale clothing is a growing segment. Sustainable hangers for this segment are a new product opportunity.",
    suggestedAction: "Expand Paperform Hanger range to preloved/resale segment. Approach secondhand retail chains.",
    type: "competitor",
    impactLevel: "medium",
    suites: ["Retail Experience"],
    timeHorizon: "short-term",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-02-15",
    source: "Nexgen Packaging"
  },
  {
    id: "SIG-021",
    title: "CEN Design for Recycling standards published for plastics",
    summary: "CEN published harmonized Design for Recycling standards for plastic packaging in early 2026, replacing 20+ national guidelines with single EU standard.",
    whyItMatters: "These standards directly determine whether Mainetti's packaging products meet PPWR recyclability grades.",
    clientImplication: "All plastic packaging must be assessed against new CEN DfR standards for PPWR recyclability grading.",
    suggestedAction: "Assess all plastic packaging products against new CEN DfR standards. Redesign non-compliant items.",
    type: "regulation",
    impactLevel: "high",
    suites: ["Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "action-required",
    date: "2026-03-15",
    source: "Amcor / CEN"
  },
  {
    id: "SIG-022",
    title: "46% of companies have no DPP plans yet",
    summary: "Survey of 201 companies shows 46% have no plans to adopt Digital Product Passport. Lack of education and unclear ROI cited.",
    whyItMatters: "Massive addressable market for DPP enablement services. Companies that haven't started will need to move fast.",
    clientImplication: "Mainetti can capture share by being the partner that makes DPP simple — bundling physical carrier with data infrastructure.",
    suggestedAction: "Develop DPP readiness assessment service for clients. Position as turnkey DPP label provider.",
    type: "market-trend",
    impactLevel: "high",
    suites: ["Product Branding"],
    timeHorizon: "short-term",
    geography: "EU-wide",
    confidence: "high",
    status: "monitoring",
    date: "2026-02-20",
    source: "LinkedIn DPP Survey / Gianluca Managò"
  },
  {
    id: "SIG-023",
    title: "Inditex Green to Pack — closed-loop packaging programme",
    summary: "Inditex collects and recycles all distribution packaging (FSC cardboard, recycled plastic, hangers) for reuse or recycling across all eight brands.",
    whyItMatters: "Inditex is the model for closed-loop hanger and packaging return schemes. Single partner managing supply + return logistics.",
    clientImplication: "Mainetti should position as single-partner for both supply and return/recycle logistics for Inditex and similar retailers.",
    suggestedAction: "Partner on closed-loop hanger/packaging return schemes. Leverage Hangerloop infrastructure.",
    type: "client-signal",
    impactLevel: "high",
    suites: ["Retail Experience", "Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    geography: "Global",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-03-01",
    source: "Inditex Sustainability Report 2026"
  },
  {
    id: "SIG-024",
    title: "Sealed Air CD&R acquisition ($10.3B) closing mid-2026",
    summary: "Sealed Air being taken private by CD&R for $10.3B. AUTOBAG 850HB Hybrid machine runs both poly and paper mailers.",
    whyItMatters: "Post-acquisition Sealed Air may increase investment in fashion e-commerce fulfillment packaging — competing with Mainetti's Product Movement suite.",
    clientImplication: "Sealed Air's hybrid bagging approach (poly + paper) competes in fashion e-commerce transit packaging.",
    suggestedAction: "Monitor post-acquisition strategy. Differentiate on fashion-specific expertise vs. Sealed Air's industrial focus.",
    type: "competitor",
    impactLevel: "medium",
    suites: ["Supply Chain / Product Movement"],
    timeHorizon: "short-term",
    geography: "Global",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-02-25",
    source: "Packaging Dive / MergerSight"
  },
  {
    id: "SIG-025",
    title: "SML InfuseRFID wins 2026 SEAL Sustainable Product Award",
    summary: "SML's InfuseRFID survives wet processing, enabling source tagging at raw material stage. Plastic-free inlays under EcoInspire portfolio.",
    whyItMatters: "InfuseRFID represents the frontier of embedded garment-level RFID — invisible, washable, sustainable.",
    clientImplication: "Sets new standard for RFID in garments. 10-16% lower product carbon footprint vs conventional PET RFID labels.",
    suggestedAction: "Evaluate comparable embedded RFID partnership or development capability. Assess technology gap.",
    type: "competitor",
    impactLevel: "high",
    suites: ["Product Branding"],
    timeHorizon: "immediate",
    geography: "Global",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-03-18",
    source: "Fibre2Fashion / SML"
  },
  {
    id: "SIG-026",
    title: "PPWR EPR digital labeling from February 2027",
    summary: "From February 2027, EU Member States may require packaging to carry QR code for EPR compliance. No proprietary national symbols permitted.",
    whyItMatters: "QR-code-enabled labels become the dominant format — mandatory for EPR, DPP, PPWR harmonized labels, and reusable packaging.",
    clientImplication: "QR integration in labels and hangtags accelerates from standard to mandatory across multiple regulatory requirements.",
    suggestedAction: "Accelerate QR-code label product development. Build modular QR label system that satisfies multiple regulatory needs.",
    type: "regulation",
    impactLevel: "high",
    suites: ["Product Branding"],
    timeHorizon: "short-term",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-03-12",
    source: "PPWR Regulation (EU) 2025/40"
  },
  {
    id: "SIG-027",
    title: "Global hanger market to exceed $10B by 2026",
    summary: "Global clothes hanger market valued at ~$7.8B in 2023, projected to exceed $10B by 2026 (CAGR ~5.2%). Smart hangers with RFID gaining traction.",
    whyItMatters: "Market expansion creates growth opportunity. Material transition from plastic to biodegradable/recycled/paper alternatives accelerating.",
    clientImplication: "Growth in smart hangers and sustainable materials. First movers in paper-based hangers capture premium segment.",
    suggestedAction: "Capitalize on Paperform Hanger first-mover advantage. Invest in RFID-enabled hanger development.",
    type: "market-trend",
    impactLevel: "medium",
    suites: ["Retail Experience"],
    timeHorizon: "immediate",
    geography: "Global",
    confidence: "high",
    status: "monitoring",
    date: "2026-03-01",
    source: "LinkedIn / Future Market Insights"
  },
  {
    id: "SIG-028",
    title: "CSRD Omnibus I narrows scope significantly",
    summary: "Directive (EU) 2026/470 raises CSRD threshold to >1,000 employees AND >€450M turnover. Sector-specific ESRS cancelled. Value chain cap at 1,000 employees.",
    whyItMatters: "Most consequential rollback of EU sustainability governance since Green Deal launched. Reduces reporting burden but large brands still in scope.",
    clientImplication: "Large fashion clients still need supplier sustainability data. Value chain cap protects smaller Mainetti suppliers from excessive requests.",
    suggestedAction: "Prepare standardized supplier sustainability data packages for brand clients. Monitor simplified ESRS due September 2026.",
    type: "regulation",
    impactLevel: "medium",
    suites: ["Product Branding", "Supply Chain / Product Movement"],
    timeHorizon: "short-term",
    geography: "EU-wide",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-03-19",
    source: "Gibson Dunn / White & Case"
  },
  {
    id: "SIG-029",
    title: "ECHA PFAS restriction — universal ban progressing",
    summary: "ECHA finalizing universal PFAS restriction covering ~10,000 substances across 14+ sectors. Final RAC/SEAC opinions expected 2027.",
    whyItMatters: "Broader PFAS REACH restriction could affect Mainetti's plastic/coating supply chain beyond food-contact applications.",
    clientImplication: "Any fluorinated coatings or treatments in packaging materials need proactive assessment ahead of broader PFAS ban.",
    suggestedAction: "Verify PFAS-free status of all product materials. Develop PFAS-free alternatives where applicable.",
    type: "regulation",
    impactLevel: "medium",
    suites: ["Supply Chain / Product Movement", "Product Branding"],
    timeHorizon: "medium-term",
    geography: "EU-wide",
    confidence: "high",
    status: "monitoring",
    date: "2026-03-10",
    source: "ECHA / Sustainability in Business"
  },
  {
    id: "SIG-030",
    title: "Walmart/Target expanding RFID mandates to general merchandise",
    summary: "Walmart and Target have extended RFID requirements from apparel to general merchandise categories. Brands investing in source-level RFID tagging.",
    whyItMatters: "RFID mandates are expanding — no longer apparel-only. Creates procurement demand for RFID-capable label and tag suppliers.",
    clientImplication: "Brands supplying these retailers need RFID-capable labels. Mainetti's label products must accommodate RFID inlays.",
    suggestedAction: "Ensure all label product lines support RFID inlay integration. Target Walmart/Target supplier brands as prospects.",
    type: "market-trend",
    impactLevel: "high",
    suites: ["Product Branding", "Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    geography: "North America",
    confidence: "confirmed",
    status: "monitoring",
    date: "2026-02-05",
    source: "Smurfit Westrock / Greenhouse Grower"
  },
  {
    id: "SIG-031",
    title: "Textile Labeling Regulation revision expected Q2 2026",
    summary: "European Commission expected to propose revised TLR in Q2 2026, introducing digital labeling, single EU ruleset, sustainability info, and harmonized sizing.",
    whyItMatters: "Triggers complete replacement cycle for care labels, woven labels, and hangtags across the industry.",
    clientImplication: "Every fashion brand's label specification will need updating. Digital + physical labels become the new standard.",
    suggestedAction: "Monitor Commission proposal. Prepare product development roadmap for digital-by-default label format.",
    type: "regulation",
    impactLevel: "high",
    suites: ["Product Branding"],
    timeHorizon: "short-term",
    geography: "EU-wide",
    confidence: "high",
    status: "monitoring",
    date: "2026-03-20",
    source: "BCLP / European Parliament"
  },
  {
    id: "SIG-032",
    title: "Zalando/Selfridges require valid DPP before brand listing",
    summary: "Major retailers already requiring valid Digital Product Passport before accepting brand listings on their platforms.",
    whyItMatters: "Market is moving faster than regulation. Retailers are making DPP a commercial requirement, not just a legal one.",
    clientImplication: "Brands without DPP-ready labels risk losing retail distribution channels. Creates urgency for DPP-enabled labels.",
    suggestedAction: "Contact Zalando/Selfridges for specific DPP label requirements. Develop compliant label templates.",
    type: "client-signal",
    impactLevel: "high",
    suites: ["Product Branding"],
    timeHorizon: "immediate",
    geography: "EU-wide",
    confidence: "high",
    status: "action-required",
    date: "2026-03-15",
    source: "LinkedIn DPP Survey"
  }
];

// ==================== REGULATIONS ====================

export const regulations: Regulation[] = [
  {
    id: "REG-001",
    name: "Packaging and Packaging Waste Regulation",
    shortName: "PPWR",
    status: "In force — application Aug 12, 2026",
    nextMilestone: "Full application across EU27",
    nextMilestoneDate: "2026-08-12",
    impactLevel: "critical",
    suites: ["Product Branding", "Retail Experience", "Supply Chain / Product Movement"],
    geography: "EU-wide",
    description: "Replaces Directive 94/62/EC. Imposes chemical restrictions, EPR registration, traceability, and recyclability requirements on all EU-market packaging.",
    keyRequirements: ["PFAS ban on food-contact packaging", "Declaration of Conformity required", "EPR registration in all Member States", "Batch/serial number on all packaging", "Manufacturer identification mandatory"]
  },
  {
    id: "REG-002",
    name: "Ecodesign for Sustainable Products Regulation",
    shortName: "ESPR",
    status: "In force — unsold goods ban Jul 19, 2026",
    nextMilestone: "Ban on destruction of unsold textiles",
    nextMilestoneDate: "2026-07-19",
    impactLevel: "critical",
    suites: ["Retail Experience", "Supply Chain / Product Movement"],
    geography: "EU-wide",
    description: "Framework for ecodesign requirements across physical products. Activates ban on unsold goods destruction and Digital Product Passport infrastructure.",
    keyRequirements: ["Ban on unsold textiles/footwear destruction", "Digital registry for unique identifiers", "DPP infrastructure foundation", "Unsold goods disclosure reporting from Feb 2027"]
  },
  {
    id: "REG-003",
    name: "Digital Product Passport — Textiles",
    shortName: "DPP",
    status: "Delegated act expected 2027",
    nextMilestone: "Textile delegated act adoption",
    nextMilestoneDate: "2027-06-30",
    impactLevel: "critical",
    suites: ["Product Branding", "Supply Chain / Product Movement"],
    geography: "EU-wide",
    description: "Mandates QR/RFID data carrier on every garment for lifecycle traceability. ~125 data points covering composition, origin, certifications.",
    keyRequirements: ["QR code or data carrier on product/packaging", "Material composition disclosure", "Supply chain traceability data", "Recyclability information", "18-month transition after adoption"]
  },
  {
    id: "REG-004",
    name: "Empowering Consumers for the Green Transition",
    shortName: "ECGT",
    status: "Transposition Mar 2026, applies Sep 27, 2026",
    nextMilestone: "Full application — greenwashing ban",
    nextMilestoneDate: "2026-09-27",
    impactLevel: "critical",
    suites: ["Product Branding"],
    geography: "EU-wide",
    description: "Bans generic environmental claims ('eco-friendly', 'green', 'sustainable') without certification. Kills carbon offset-based neutrality claims.",
    keyRequirements: ["No generic environmental claims without certification", "Carbon offset neutrality claims banned", "No unverified sustainability labels", "Existing products must comply — no transitional stock"]
  },
  {
    id: "REG-005",
    name: "EU Deforestation Regulation",
    shortName: "EUDR",
    status: "Delayed — applies Dec 30, 2026",
    nextMilestone: "Application for large/medium operators",
    nextMilestoneDate: "2026-12-30",
    impactLevel: "high",
    suites: ["Supply Chain / Product Movement", "Product Branding"],
    geography: "EU-wide",
    description: "Requires plot-level geolocation for deforestation-risk commodities including wood/paper. FSC certification alone insufficient.",
    keyRequirements: ["GPS geolocation of source plots", "Due Diligence Statement filing", "Legality documentation", "Applies to wood/paper products"]
  },
  {
    id: "REG-006",
    name: "Carbon Border Adjustment Mechanism",
    shortName: "CBAM",
    status: "Definitive regime — live Jan 1, 2026",
    nextMilestone: "ACD registration deadline",
    nextMilestoneDate: "2026-03-31",
    impactLevel: "high",
    suites: ["Retail Experience", "Supply Chain / Product Movement"],
    geography: "EU-wide",
    description: "Financial mechanism on imported steel, aluminium, and other carbon-intensive goods. Directly affects hanger and structural packaging inputs.",
    keyRequirements: ["Authorized CBAM Declarant status if >50 tonnes/yr", "Verified emissions data for imports", "Certificate purchase for 2026 imports by 2027", "Scope expansion to downstream products planned 2028"]
  },
  {
    id: "REG-007",
    name: "Textile Labeling Regulation (Revision)",
    shortName: "TLR",
    status: "Proposal expected Q2 2026",
    nextMilestone: "Commission legislative proposal",
    nextMilestoneDate: "2026-06-30",
    impactLevel: "high",
    suites: ["Product Branding"],
    geography: "EU-wide",
    description: "Revision of Regulation (EU) 1007/2011 introducing digital labeling, single EU ruleset, sustainability info, harmonized sizing.",
    keyRequirements: ["Digital labeling alongside physical", "Single uniform EU ruleset", "Sustainability and circularity information", "Mandatory care labeling standardization", "Scope expansion to leather, fur, household textiles"]
  },
  {
    id: "REG-008",
    name: "German Packaging Law (VerpackDG)",
    shortName: "VerpackDG",
    status: "Adopted Feb 11, 2026 — enters force Aug 12",
    nextMilestone: "Entry into force",
    nextMilestoneDate: "2026-08-12",
    impactLevel: "high",
    suites: ["Supply Chain / Product Movement"],
    geography: "Germany",
    description: "Replaces VerpackG. Expands LUCID registry to cover B2B and transport packaging. Simultaneous implementation with PPWR.",
    keyRequirements: ["LUCID registration expanded to B2B", "Transport packaging producers now covered", "Higher plastic recycling targets", "Mandatory waste-prevention and reuse funding"]
  },
  {
    id: "REG-009",
    name: "UK Extended Producer Responsibility",
    shortName: "UK EPR",
    status: "Year 2 fee modulation from October 2026",
    nextMilestone: "Fee enforcement with modulation",
    nextMilestoneDate: "2026-10-01",
    impactLevel: "high",
    suites: ["Supply Chain / Product Movement", "Product Branding"],
    geography: "UK",
    description: "UK packaging EPR with recyclability-based fee modulation. Green/amber/red tiers create cost incentives for recyclable packaging.",
    keyRequirements: ["Company-specific fees from October 2026", "Recycling Assessment Methodology (RAM) classification", "Data reporting by April 1, 2026", "Confirmed fee rates published June 2026"]
  },
  {
    id: "REG-010",
    name: "France B2B Professional Packaging EPR",
    shortName: "FR B2B EPR",
    status: "Active from Jan 2026 — levies from Jul 2026",
    nextMilestone: "Green levy payments start",
    nextMilestoneDate: "2026-07-01",
    impactLevel: "high",
    suites: ["Retail Experience", "Supply Chain / Product Movement"],
    geography: "France",
    description: "New EPR scheme for professional/B2B packaging in France. Registration with eco-organisation mandatory. Affects transport and retail packaging.",
    keyRequirements: ["Registration with Citeo Pro, Leko, or Twiice", "Green levy payments from July 1", "Covers garment hangers and transport packaging", "Eco-modulated fee rates"]
  },
  {
    id: "REG-011",
    name: "CSRD / Omnibus I",
    shortName: "CSRD",
    status: "Omnibus enacted Mar 19, 2026 — scope narrowed",
    nextMilestone: "Simplified ESRS adoption",
    nextMilestoneDate: "2026-09-30",
    impactLevel: "medium",
    suites: ["Product Branding", "Supply Chain / Product Movement"],
    geography: "EU-wide",
    description: "Corporate sustainability reporting with narrowed scope: >1,000 employees AND >€450M turnover. Sector standards cancelled. Value chain data cap.",
    keyRequirements: ["Reporting for FY starting Jan 1, 2027", "Simplified ESRS by Sept 2026", "Value chain cap at 1,000 employees", "Wave 2/3 postponed by 2 years"]
  },
  {
    id: "REG-012",
    name: "CSDDD Due Diligence",
    shortName: "CSDDD",
    status: "Application delayed to July 2029",
    nextMilestone: "Application date",
    nextMilestoneDate: "2029-07-26",
    impactLevel: "medium",
    suites: ["Supply Chain / Product Movement"],
    geography: "EU-wide",
    description: "Supply chain due diligence for human rights and environmental impacts. Scope raised to >€1.5B turnover and >5,000 employees. Tier 1 only.",
    keyRequirements: ["Due diligence on Tier 1 suppliers", "Climate transition plan adoption", "Monitoring every 5 years", "Civil liability removed"]
  },
  {
    id: "REG-013",
    name: "EU Textile Waste EPR",
    shortName: "Textile EPR",
    status: "Mandatory from October 2025",
    nextMilestone: "National implementation across Member States",
    nextMilestoneDate: "2026-12-31",
    impactLevel: "medium",
    suites: ["Product Branding"],
    geography: "EU-wide",
    description: "Producers financially responsible for end-of-life textile management. Covers textiles, footwear, accessories sold in EU.",
    keyRequirements: ["EPR scheme registration", "End-of-life cost coverage", "Applies to online/e-commerce sales", "Member State implementation within 30 months"]
  },
  {
    id: "REG-014",
    name: "France Environmental Cost Labeling",
    shortName: "FR Eco-Score",
    status: "Voluntary from Oct 2025 — third-party from Oct 2026",
    nextMilestone: "Third-party score publication allowed",
    nextMilestoneDate: "2026-10-01",
    impactLevel: "medium",
    suites: ["Product Branding"],
    geography: "France",
    description: "Environmental cost label for textiles in France. From October 2026, third parties may publish scores for brands that haven't done so themselves.",
    keyRequirements: ["Environmental Cost display if making environmental claims", "Third-party publication right from Oct 2026", "Applies to all textile brands marketing in France"]
  },
  {
    id: "REG-015",
    name: "PPWR Recyclability Requirements 2030",
    shortName: "PPWR 2030",
    status: "Enacted — applies January 1, 2030",
    nextMilestone: "All packaging must be recyclable (Grade C+)",
    nextMilestoneDate: "2030-01-01",
    impactLevel: "high",
    suites: ["Product Branding", "Retail Experience", "Supply Chain / Product Movement"],
    geography: "EU-wide",
    description: "All packaging must be recyclable and meet Design for Recycling standards. Minimum recycled plastic content: 35% for general packaging.",
    keyRequirements: ["Grade C or above recyclability", "30% rPET for contact-sensitive", "35% recycled content for general plastic", "50% max void ratio for e-commerce", "Banned single-use formats (Annex V)"]
  }
];

// ==================== STAKEHOLDERS ====================

export const stakeholders: Stakeholder[] = [
  { id: "STK-001", name: "Jessika Roswall", organization: "European Commission", category: "EU Executive", geography: "EU-wide", importance: "high", role: "Commissioner for Environment, Water Resilience and Circular Economy", relevance: "Directly responsible for PPWR, ESPR, and all packaging sustainability regulation." },
  { id: "STK-002", name: "Stéphane Séjourné", organization: "European Commission", category: "EU Executive", geography: "EU-wide", importance: "high", role: "EVP for Prosperity and Industrial Strategy", relevance: "Controls competitiveness/simplification agenda for PPWR and ESPR obligations." },
  { id: "STK-003", name: "Maroš Šefčovič", organization: "European Commission", category: "EU Executive", geography: "EU-wide", importance: "medium", role: "Commissioner for Trade and Economic Security", relevance: "Trade policy affects competitive landscape for packaging and retail supply chains." },
  { id: "STK-004", name: "Wopke Hoekstra", organization: "European Commission", category: "EU Executive", geography: "EU-wide", importance: "low", role: "Commissioner for Climate, Net Zero and Clean Growth", relevance: "Indirect via Green Deal framework underpinning PPWR/ESPR." },
  { id: "STK-005", name: "DG ENV", organization: "European Commission", category: "Regulatory Body", geography: "EU-wide", importance: "high", role: "Directorate-General for Environment", relevance: "Administers PPWR, ESPR, Waste Framework Directive, PFAS bans. Core drafter of implementing acts." },
  { id: "STK-006", name: "DG GROW", organization: "European Commission", category: "Regulatory Body", geography: "EU-wide", importance: "high", role: "DG Internal Market, Industry, Entrepreneurship and SMEs", relevance: "Controls product standards, market access, and Circular Economy Act." },
  { id: "STK-007", name: "Antonio Decaro", organization: "European Parliament", category: "Legislative Body", geography: "EU-wide", importance: "high", role: "ENVI Committee Chair (S&D, Italy)", relevance: "Leads scrutiny of PPWR and ESPR delegated/implementing acts." },
  { id: "STK-008", name: "Frédérique Ries", organization: "European Parliament", category: "Legislative Body", geography: "EU-wide", importance: "high", role: "PPWR Rapporteur (Renew, Belgium)", relevance: "Delivered the PPWR text that became Regulation (EU) 2025/40." },
  { id: "STK-009", name: "Pascal Canfin", organization: "European Parliament", category: "Legislative Body", geography: "EU-wide", importance: "medium", role: "Renew Group ENVI Coordinator (France)", relevance: "Coordinates Renew positions on all ENVI dossiers." },
  { id: "STK-010", name: "CEN/CENELEC", organization: "CEN/CENELEC", category: "Standards Body", geography: "EU-wide", importance: "high", role: "European Committee for Standardisation", relevance: "Developing DfR standards for PPWR and DPP technical standards via JTC 24." },
  { id: "STK-011", name: "ECHA", organization: "ECHA (Helsinki)", category: "Regulatory Agency", geography: "EU-wide", importance: "high", role: "European Chemicals Agency", relevance: "Implements PFAS restriction and REACH chemicals regulation affecting packaging materials." },
  { id: "STK-012", name: "CITEO / Citeo Pro", organization: "CITEO", category: "EPR Compliance Scheme", geography: "France", importance: "high", role: "Approved EPR eco-organisation (France)", relevance: "Manages B2B professional packaging EPR from July 2026 in France." },
  { id: "STK-013", name: "ZSVR / LUCID", organization: "ZSVR", category: "EPR Compliance Scheme", geography: "Germany", importance: "high", role: "National Packaging Register (Germany)", relevance: "Operates LUCID register. VerpackDG expands scope to B2B/transport packaging Aug 2026." },
  { id: "STK-014", name: "DEFRA / PackUK", organization: "DEFRA", category: "EPR Compliance Scheme", geography: "UK", importance: "high", role: "UK EPR Scheme Administrator", relevance: "Manages UK packaging EPR with recyclability-based fee modulation from October 2026." },
  { id: "STK-015", name: "Council ENVI (Cyprus Presidency)", organization: "Council of the EU", category: "Co-legislator", geography: "EU-wide", importance: "high", role: "Environment Configuration — H1 2026 Presidency", relevance: "Member States determine enforcement priorities and national EPR structures." },
  { id: "STK-016", name: "ENVI Committee", organization: "European Parliament", category: "Legislative Body", geography: "EU-wide", importance: "high", role: "Committee on Environment, Public Health and Food Safety", relevance: "Scrutinises all PPWR and ESPR delegated/implementing acts." },
  { id: "STK-017", name: "ITRE Committee", organization: "European Parliament", category: "Legislative Body", geography: "EU-wide", importance: "medium", role: "Committee on Industry, Research and Energy", relevance: "Shapes whether sustainability obligations are proportionate for manufacturers." },
  { id: "STK-018", name: "IMCO Committee", organization: "European Parliament", category: "Legislative Body", geography: "EU-wide", importance: "medium", role: "Committee on Internal Market and Consumer Protection", relevance: "Influences labelling requirements for packaging products." },
  { id: "STK-019", name: "Avery Dennison", organization: "Avery Dennison (NYSE: AVY)", category: "Competitor", geography: "Global", importance: "high", role: "Materials science & digital ID leader ($8.9B revenue)", relevance: "Most direct competitor in RFID labels, DPP solutions, luxury label collections." },
  { id: "STK-020", name: "SML Group", organization: "SML Group", category: "Competitor", geography: "Global", importance: "high", role: "RFID & brand identification leader ($600M+ valuation)", relevance: "Closest direct competitor in woven labels, hangtags, InfuseRFID, DPP." },
  { id: "STK-021", name: "Checkpoint Systems", organization: "CCL Industries", category: "Competitor", geography: "Global", importance: "medium", role: "RFID/RF loss prevention & inventory control", relevance: "Enterprise RFID deployment (C&A 1,300+ stores). Smart packaging with RFID." },
  { id: "STK-022", name: "Braiform", organization: "Spotless Group", category: "Competitor", geography: "Global", importance: "high", role: "Hanger reuse programme (300M/yr)", relevance: "Sets benchmark for circular hanger economics across 32 countries." },
  { id: "STK-023", name: "LVMH", organization: "LVMH", category: "Key Client", geography: "Global", importance: "high", role: "Luxury group — zero virgin plastic packaging by 2026", relevance: "Immediate commercial trigger for plastic-free packaging alternatives." },
  { id: "STK-024", name: "Inditex", organization: "Inditex Group", category: "Key Client", geography: "Global", importance: "high", role: "Fast fashion group — Green to Pack programme", relevance: "Model for closed-loop hanger/packaging return schemes." },
  { id: "STK-025", name: "Plastics Europe", organization: "Plastics Europe", category: "Industry Association", geography: "EU-wide", importance: "medium", role: "Plastics industry trade association", relevance: "Lobbying for EU-wide harmonized EPR registration system." }
];

// ==================== COMPETITORS ====================

export const competitors: Competitor[] = [
  {
    id: "COMP-001",
    name: "Avery Dennison",
    description: "Global materials science and digital identification leader. Core apparel solutions include Optica RFID, AD TexTrace embedded RFID, and atma.io Connected Product Cloud.",
    threatLevel: "high",
    recentMoves: [
      "Launched Optica RFID portfolio at NRF 2025 — end-to-end supply chain visibility",
      "Infinity Collection for luxury labels with complex die-cutting and finishes",
      "Sustainable Collection: Lin Fiber, Hemp Fiber, Cane Fiber alternatives",
      "RFID expansion into pharma/healthcare (BD iDFill partnership)",
      "atma.io platform as DPP data repository for fashion brands"
    ],
    overlapAreas: ["Product Branding"],
    revenue: "$8.9B (FY2025)",
    employees: "~35,000",
    keyStrength: "Bundled materials science + digital identification platform"
  },
  {
    id: "COMP-002",
    name: "SML Group",
    description: "Hong Kong-based global RFID and brand identification leader for apparel/retail. Serves 600+ brands worldwide with woven labels, hangtags, RFID solutions.",
    threatLevel: "high",
    recentMoves: [
      "FountainVest + CPE investment at >$600M valuation (Nov 2025)",
      "InfuseRFID wins 2026 SEAL Sustainable Product Award",
      "EcoInspire plastic-free RFID inlays with paper carriers",
      "Dynamic QR labels for smaller format, reduced raw consumption",
      "New production sites and major client partnerships in 2025"
    ],
    overlapAreas: ["Product Branding", "Retail Experience"],
    revenue: "$600M+ valuation",
    employees: "25+ locations, 20+ countries",
    keyStrength: "PE-backed investment for digital innovation acceleration"
  },
  {
    id: "COMP-003",
    name: "Checkpoint Systems",
    description: "Division of CCL Industries. Global leader in RFID/RF-driven loss prevention, inventory control, and supply chain management for retail.",
    threatLevel: "medium-high",
    recentMoves: [
      "C&A RFID deployment across 1,300+ stores in 17 countries",
      "Integrated RFID checkout solution (Feb 2026)",
      "Smart Packaging with ARC-Certified RFID Inlays",
      "IML Labels for Reusable Packaging"
    ],
    overlapAreas: ["Product Branding", "Retail Experience"],
    revenue: "Part of CCL Industries",
    employees: "50+ years experience",
    keyStrength: "Enterprise-scale RFID deployment track record (C&A reference)"
  },
  {
    id: "COMP-004",
    name: "Braiform",
    description: "Division of Spotless Group. Operates advanced hanger reuse programme saving 300 million hangers annually from landfills. Soft mechanical recycling for damaged units.",
    threatLevel: "high",
    recentMoves: [
      "300 million hangers saved annually from landfills (as of Jan 2026)",
      "Advanced soft mechanical recycling: 70% less pollution than virgin plastic",
      "Operating across 32 countries serving retailers and garment manufacturers"
    ],
    overlapAreas: ["Retail Experience"],
    employees: "32 countries",
    keyStrength: "Industry-leading hanger reuse scale at 300M units/year"
  },
  {
    id: "COMP-005",
    name: "Smurfit Westrock",
    description: "World's largest containerboard and paper-based packaging company. $31.2B revenue. AI-powered luxury packaging design and innovation hubs.",
    threatLevel: "medium",
    recentMoves: [
      "AI-powered packaging design tools — months to weeks",
      "Connected packaging for circularity tracking",
      "Luxury packaging design trend leadership",
      "Customer experience centers in Richmond VA and Chicago area"
    ],
    overlapAreas: ["Product Branding"],
    revenue: "$31.2B (2025)",
    employees: "40+ countries",
    keyStrength: "AI-accelerated luxury packaging design capability"
  },
  {
    id: "COMP-006",
    name: "Sealed Air",
    description: "Global protective packaging leader ($5.36B revenue). Being acquired by CD&R for $10.3B. BUBBLE WRAP, Cryovac, AUTOBAG brands.",
    threatLevel: "low-medium",
    recentMoves: [
      "CD&R acquisition ($10.3B) closing mid-2026",
      "AUTOBAG 850HB Hybrid — runs both poly and paper mailers",
      "BUBBLE WRAP 90% recycled content",
      "Jiffy Embossed Mailer for curbside recyclability"
    ],
    overlapAreas: ["Supply Chain / Product Movement"],
    revenue: "$5.36B (FY2025)",
    keyStrength: "Automated fulfillment packaging (AUTOBAG) for e-commerce"
  },
  {
    id: "COMP-007",
    name: "DS Smith / International Paper",
    description: "UK-originated sustainable fibre-based packaging. Acquired by International Paper Jan 2025. Being split into two independent companies (NA/EMEA).",
    threatLevel: "low-medium",
    recentMoves: [
      "International Paper acquisition completed Jan 2025",
      "1.7B+ pieces of plastic replaced with recyclable alternatives since 2020",
      "58,000+ packaging decisions influenced by Circular Design Metrics",
      "21% GHG reduction vs. 2019/20 baseline"
    ],
    overlapAreas: ["Supply Chain / Product Movement"],
    revenue: "Part of International Paper",
    keyStrength: "Scale fibre packaging with strong sustainability credentials"
  },
  {
    id: "COMP-008",
    name: "Nexgen Packaging / (re)x",
    description: "Emerging competitors in sustainable hangers. Nexgen: 100% plastic-free paper hanger for preloved segment. (re)x: 100% ocean-bound plastic premium hangers.",
    threatLevel: "medium",
    recentMoves: [
      "Nexgen: Ditto hanger collaboration with Kiabi Kidkanai (Feb 2026)",
      "(re)x: Reinforced hanger from 100% ocean-bound plastic (May 2025)",
      "Targeting luxury and heavy-outerwear segments with ocean-plastic"
    ],
    overlapAreas: ["Retail Experience"],
    keyStrength: "Niche sustainable material innovation in hanger segment"
  }
];

// ==================== OPPORTUNITIES & RISKS ====================

export const opportunitiesRisks: OpportunityRisk[] = [
  {
    id: "OPP-001",
    title: "DPP-ready label as platform play",
    description: "The EU DPP for textiles (2027–2029) requires a physical data carrier on every garment. Labels, hangtags, and packaging are the natural vehicle. Mainetti can bundle DPP infrastructure with its existing product lines to create competitive lock-in.",
    type: "opportunity",
    priority: 1,
    suites: ["Product Branding"],
    timeHorizon: "short-term",
    impactLevel: "critical"
  },
  {
    id: "OPP-002",
    title: "PPWR-driven packaging redesign cycle",
    description: "PPWR compliance from August 2026 triggers industry-wide packaging redesign. Every label, hangtag, polybag, and box needs compliance verification — creating a massive replacement and advisory opportunity.",
    type: "opportunity",
    priority: 2,
    suites: ["Product Branding", "Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    impactLevel: "critical"
  },
  {
    id: "OPP-003",
    title: "Greenwashing compliance — replacement label cycle",
    description: "ECGT rules (September 2026) ban generic sustainability claims. Brands must redesign labels to remove non-compliant claims — triggering a replacement cycle for hangtags, labels, and packaging across the industry.",
    type: "opportunity",
    priority: 3,
    suites: ["Product Branding"],
    timeHorizon: "immediate",
    impactLevel: "high"
  },
  {
    id: "OPP-004",
    title: "Closed-loop hanger programmes for fast fashion",
    description: "Inditex's Green to Pack model shows demand for single-partner closed-loop hanger/packaging supply and return logistics. Mainetti's Hangerloop infrastructure positions it to capture this consolidation trend.",
    type: "opportunity",
    priority: 4,
    suites: ["Retail Experience"],
    timeHorizon: "immediate",
    impactLevel: "high"
  },
  {
    id: "OPP-005",
    title: "QR-code label convergence across regulations",
    description: "Multiple regulations (EPR, DPP, PPWR, reusable packaging) all require QR codes on packaging. A modular QR label system serving multiple regulatory needs is a high-value product opportunity.",
    type: "opportunity",
    priority: 5,
    suites: ["Product Branding"],
    timeHorizon: "short-term",
    impactLevel: "high"
  },
  {
    id: "RISK-001",
    title: "Avery Dennison and SML capturing DPP market",
    description: "Both competitors have well-funded DPP solutions (atma.io, InfuseRFID). If Mainetti doesn't develop comparable digital infrastructure, it risks becoming a commodity label supplier while competitors own the digital layer.",
    type: "risk",
    priority: 1,
    suites: ["Product Branding"],
    timeHorizon: "immediate",
    impactLevel: "critical"
  },
  {
    id: "RISK-002",
    title: "PPWR non-compliance — market access loss",
    description: "Failure to achieve PPWR compliance by August 12, 2026 means Mainetti packaging cannot legally be placed on the EU market. This is a binary market-access risk with no grace period.",
    type: "risk",
    priority: 2,
    suites: ["Product Branding", "Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    impactLevel: "critical"
  },
  {
    id: "RISK-003",
    title: "SML PE investment accelerating competitive gap",
    description: "SML's $600M+ PE backing allows rapid R&D and geographic expansion. As a well-funded, focused competitor for the same apparel brand clients, SML may outpace Mainetti's innovation cadence.",
    type: "risk",
    priority: 3,
    suites: ["Product Branding", "Retail Experience"],
    timeHorizon: "short-term",
    impactLevel: "high"
  },
  {
    id: "RISK-004",
    title: "CBAM cost escalation on imported materials",
    description: "CBAM financial liability on imported steel wire and aluminium inputs from non-EU locations. Scope expansion to downstream products planned for 2028 could increase cost impact.",
    type: "risk",
    priority: 4,
    suites: ["Retail Experience", "Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    impactLevel: "high"
  },
  {
    id: "RISK-005",
    title: "Multi-jurisdiction EPR complexity",
    description: "Simultaneous EPR compliance requirements across 27 EU Member States plus UK, each with different registration, fees, and reporting. France B2B EPR, Germany VerpackDG, UK PackUK all launching in 2026.",
    type: "risk",
    priority: 5,
    suites: ["Supply Chain / Product Movement"],
    timeHorizon: "immediate",
    impactLevel: "high"
  }
];

// ==================== MILESTONES ====================

export const milestones: Milestone[] = [
  {
    id: "MIL-001",
    date: "2026-03-31",
    title: "CBAM ACD Registration Deadline",
    regulation: "CBAM",
    description: "Apply for Authorized CBAM Declarant status if importing >50 tonnes/year of covered goods (iron/steel/aluminium).",
    impactLevel: "high",
    suites: ["Retail Experience", "Supply Chain / Product Movement"]
  },
  {
    id: "MIL-002",
    date: "2026-07-01",
    title: "France B2B EPR Levy Payments Start",
    regulation: "FR B2B EPR",
    description: "All companies placing B2B packaging on French market must be registered with eco-organisation and paying green levies.",
    impactLevel: "high",
    suites: ["Retail Experience", "Supply Chain / Product Movement"]
  },
  {
    id: "MIL-003",
    date: "2026-07-19",
    title: "ESPR Unsold Goods Destruction Ban",
    regulation: "ESPR",
    description: "Ban on destruction of unsold textiles and footwear for large and medium enterprises. No further legislation needed.",
    impactLevel: "critical",
    suites: ["Retail Experience", "Supply Chain / Product Movement"]
  },
  {
    id: "MIL-004",
    date: "2026-08-12",
    title: "PPWR Full Application + VerpackDG",
    regulation: "PPWR / VerpackDG",
    description: "PPWR applies across EU27. Germany VerpackDG simultaneously enters force. EPR registration, DoC, traceability all mandatory.",
    impactLevel: "critical",
    suites: ["Product Branding", "Retail Experience", "Supply Chain / Product Movement"]
  },
  {
    id: "MIL-005",
    date: "2026-09-27",
    title: "ECGT Greenwashing Ban Active",
    regulation: "ECGT",
    description: "Generic environmental claims banned. Carbon offset neutrality claims prohibited. No transitional stock period.",
    impactLevel: "critical",
    suites: ["Product Branding"]
  }
];

// ==================== DASHBOARD META ====================

export const whatToTellClients = [
  {
    id: "TTC-001",
    title: "Your packaging labels need compliance audit now",
    description: "PPWR requires Declarations of Conformity, traceability identifiers, and manufacturer details on all EU-market packaging from August 12. Greenwashing rules ban generic sustainability claims from September 27. Every hangtag and label needs review.",
    urgency: "critical" as ImpactLevel
  },
  {
    id: "TTC-002",
    title: "DPP-ready labels are becoming a market access requirement",
    description: "Zalando and Selfridges already require valid Digital Product Passports before listing brands. The EU mandate follows in 2027–2028. QR-code-integrated labels are no longer optional — they're the cost of doing business.",
    urgency: "high" as ImpactLevel
  },
  {
    id: "TTC-003",
    title: "Circular packaging credentials are now a procurement criterion",
    description: "From closed-loop hangers (Inditex Green to Pack) to recycled-content mandates (PPWR 2030), brands that can prove circularity win shelf space. Mainetti's Hangerloop, Polyloop, and FSC credentials are verified proof points.",
    urgency: "high" as ImpactLevel
  }
];

export const whatToPrepareFor = [
  {
    id: "TPF-001",
    title: "QR codes become the universal packaging format",
    description: "By 2028, QR codes will be mandatory across EPR labels (2027), Digital Product Passports (~2028), PPWR harmonized labels (2028), and reusable packaging (2029). Build modular QR label infrastructure now.",
    horizon: "2027–2029"
  },
  {
    id: "TPF-002",
    title: "PPWR recyclability grades reshape material choices",
    description: "From 2030, all packaging must be recyclable (Grade C or above) with 35% recycled plastic content minimum. Products not meeting these thresholds will be banned from EU market. Design for Recycling assessment is the new baseline.",
    horizon: "2028–2030"
  },
  {
    id: "TPF-003",
    title: "Digital identity becomes standard on every garment",
    description: "RFID and NFC are moving from optional to expected. Walmart/Target mandates expanding. EU DPP requires data carrier on every textile product. The physical label IS the digital infrastructure layer.",
    horizon: "2026–2029"
  }
];

export const weeklyChanges = [
  { id: "WC-001", date: "Mar 23, 2026", title: "ESPR Working Table meets in Milan — DPP operational transition for fashion", source: "European Climate Pact" },
  { id: "WC-002", date: "Mar 19, 2026", title: "CSRD Omnibus I enters force — scope narrowed to >1,000 employees AND >€450M", source: "Gibson Dunn / White & Case" },
  { id: "WC-003", date: "Mar 18, 2026", title: "SML InfuseRFID wins 2026 SEAL Sustainable Product Award", source: "Fibre2Fashion" },
  { id: "WC-004", date: "Mar 15, 2026", title: "ECHA RAC finalizing PFAS restriction option — 60-day consultation to follow", source: "ECHA / Plastics Engineering" },
  { id: "WC-005", date: "Mar 10, 2026", title: "CEN DPP standards (prEN 1821X) deadline March 31 — publication to follow", source: "CEN/CENELEC" }
];

// ==================== HELPER FUNCTIONS ====================

export function getSignalsByImpact(impact: ImpactLevel): Signal[] {
  return signals.filter(s => s.impactLevel === impact);
}

export function getSignalsBySuite(suite: ProductSuite): Signal[] {
  return signals.filter(s => s.suites.includes(suite));
}

export function getSignalsByType(type: SignalType): Signal[] {
  return signals.filter(s => s.type === type);
}

export function getCriticalAlerts(): Signal[] {
  return signals.filter(s => s.impactLevel === "critical" || (s.impactLevel === "high" && s.status === "action-required"));
}

export function getKPIs() {
  return {
    totalSignals: signals.length,
    criticalAlerts: signals.filter(s => s.impactLevel === "critical").length,
    highImpact: signals.filter(s => s.impactLevel === "high").length,
    thisWeek: signals.filter(s => new Date(s.date) >= new Date("2026-03-16")).length,
    earlyWarnings: signals.filter(s => s.timeHorizon === "short-term" || s.timeHorizon === "medium-term").length,
    actionRequired: signals.filter(s => s.status === "action-required").length
  };
}
