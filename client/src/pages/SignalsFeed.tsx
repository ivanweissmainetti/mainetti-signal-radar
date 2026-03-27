import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SuiteBadge, ImpactBadge, getImpactDot } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import type { Signal, ProductSuite } from "@/lib/types";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SignalsFeedProps {
  activeSuite: ProductSuite | "all";
}

export default function SignalsFeed({ activeSuite }: SignalsFeedProps) {
  const { data: signals = [], isLoading } = useQuery<Signal[]>({ queryKey: ["/api/signals"] });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [impactFilter, setImpactFilter] = useState<string>("all");
  const [horizonFilter, setHorizonFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [confidenceFilter, setConfidenceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "impact">("date");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const impactOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  const filtered = useMemo(() => {
    let result = signals;
    if (activeSuite !== "all") result = result.filter(s => s.suites.includes(activeSuite as ProductSuite));
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q));
    }
    if (typeFilter !== "all") result = result.filter(s => s.type === typeFilter);
    if (impactFilter !== "all") result = result.filter(s => s.impactLevel === impactFilter);
    if (horizonFilter !== "all") result = result.filter(s => s.timeHorizon === horizonFilter);
    if (statusFilter !== "all") result = result.filter(s => s.status === statusFilter);
    if (confidenceFilter !== "all") result = result.filter(s => s.confidence === confidenceFilter);

    result = [...result].sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      return (impactOrder[a.impactLevel] || 9) - (impactOrder[b.impactLevel] || 9);
    });
    return result;
  }, [signals, activeSuite, search, typeFilter, impactFilter, horizonFilter, statusFilter, confidenceFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-[1400px]">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 rounded-lg" />
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Signals Feed</h1>
        <span className="text-xs text-muted-foreground tabular-nums">{filtered.length} signals</span>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search signals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
                data-testid="input-search-signals"
              />
            </div>
            <FilterSelect label="Type" value={typeFilter} onChange={setTypeFilter} options={[
              { value: "all", label: "All Types" },
              { value: "regulation", label: "Regulation" },
              { value: "competitor", label: "Competitor" },
              { value: "market-trend", label: "Market Trend" },
              { value: "client-signal", label: "Client Signal" },
            ]} />
            <FilterSelect label="Impact" value={impactFilter} onChange={setImpactFilter} options={[
              { value: "all", label: "All Impacts" },
              { value: "critical", label: "Critical" },
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]} />
            <FilterSelect label="Horizon" value={horizonFilter} onChange={setHorizonFilter} options={[
              { value: "all", label: "All Horizons" },
              { value: "immediate", label: "Immediate" },
              { value: "short-term", label: "Short-term" },
              { value: "medium-term", label: "Medium-term" },
            ]} />
            <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[
              { value: "all", label: "All Statuses" },
              { value: "action-required", label: "Action Required" },
              { value: "monitoring", label: "Monitoring" },
              { value: "active", label: "Active" },
            ]} />
            <FilterSelect label="Sort" value={sortBy} onChange={(v) => setSortBy(v as "date" | "impact")} options={[
              { value: "date", label: "Newest" },
              { value: "impact", label: "Impact" },
            ]} />
          </div>
        </CardContent>
      </Card>

      {/* Signal list */}
      <div className="space-y-1">
        {filtered.map((signal) => (
          <SignalRow
            key={signal.id}
            signal={signal}
            expanded={expandedId === signal.id}
            onToggle={() => setExpandedId(expandedId === signal.id ? null : signal.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No signals match your filters.</div>
        )}
      </div>
    </div>
  );
}

function SignalRow({ signal, expanded, onToggle }: { signal: Signal; expanded: boolean; onToggle: () => void }) {
  const typeLabels: Record<string, string> = {
    regulation: "REG",
    competitor: "COMP",
    "market-trend": "TREND",
    "client-signal": "CLIENT",
    opportunity: "OPP",
    risk: "RISK",
  };

  return (
    <Card className={`transition-all ${expanded ? "ring-1 ring-primary/30" : ""}`} data-testid={`signal-row-${signal.signalId}`}>
      <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={onToggle}>
        <div className={`w-2 h-2 rounded-full shrink-0 ${getImpactDot(signal.impactLevel)}`} />
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono shrink-0">
          {typeLabels[signal.type]}
        </Badge>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium truncate block">{signal.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {signal.suites.map((s) => <SuiteBadge key={s} suite={s} />)}
          <ImpactBadge level={signal.impactLevel} />
          <Badge variant={signal.status === "action-required" ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0 capitalize">
            {signal.status.replace("-", " ")}
          </Badge>
          <span className="text-[10px] text-muted-foreground tabular-nums w-20 text-right">{signal.date}</span>
          {expanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </div>
      </div>
      {expanded && (
        <div className="px-3 pb-3 border-t space-y-3">
          <div className="grid md:grid-cols-2 gap-4 pt-3">
            <div>
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Summary</h4>
              <p className="text-xs leading-relaxed">{signal.summary}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Why It Matters</h4>
              <p className="text-xs leading-relaxed">{signal.whyItMatters}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Client Implication</h4>
              <p className="text-xs leading-relaxed">{signal.clientImplication}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Suggested Action</h4>
              <p className="text-xs leading-relaxed text-primary font-medium">{signal.suggestedAction}</p>
            </div>
          </div>
          <div className="flex gap-3 text-[10px] text-muted-foreground pt-2 border-t">
            <span>Geography: <strong className="text-foreground">{signal.geography}</strong></span>
            <span>Confidence: <strong className="text-foreground capitalize">{signal.confidence}</strong></span>
            <span>Horizon: <strong className="text-foreground capitalize">{signal.timeHorizon}</strong></span>
            <span>Source: <strong className="text-foreground">{signal.source}</strong></span>
          </div>
        </div>
      )}
    </Card>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-[130px] text-xs" data-testid={`select-${label.toLowerCase()}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className="text-xs">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
