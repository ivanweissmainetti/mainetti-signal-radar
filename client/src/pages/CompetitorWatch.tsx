import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SuiteBadge, getThreatColor } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import type { Competitor, ProductSuite } from "@/lib/types";
import { Shield, DollarSign, Users, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CompetitorWatchProps {
  activeSuite: ProductSuite | "all";
}

export default function CompetitorWatch({ activeSuite }: CompetitorWatchProps) {
  const { data: competitors = [], isLoading } = useQuery<Competitor[]>({ queryKey: ["/api/competitors"] });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = activeSuite === "all"
    ? competitors
    : competitors.filter(c => c.overlapAreas.some(a => a === activeSuite));

  const threatOrder: Record<string, number> = { high: 0, "medium-high": 1, medium: 2, "low-medium": 3, low: 4 };
  const sorted = [...filtered].sort((a, b) => (threatOrder[a.threatLevel] || 9) - (threatOrder[b.threatLevel] || 9));

  const threatIcon = (level: string) => {
    switch (level) {
      case "high": return "🔴";
      case "medium-high": return "🟠";
      case "medium": return "🟡";
      case "low-medium": return "🔵";
      case "low": return "🟢";
      default: return "⚪";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-[1400px]">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-16 rounded-lg" />
        <div className="grid md:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Competitor Watch</h1>
        <span className="text-xs text-muted-foreground tabular-nums">{sorted.length} competitors</span>
      </div>

      {/* Threat Summary */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-3">
            {sorted.map(c => (
              <div key={c.id} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50">
                <span className="text-sm">{threatIcon(c.threatLevel)}</span>
                <span className="text-xs font-medium">{c.name}</span>
                <span className={`text-[10px] font-semibold uppercase ${getThreatColor(c.threatLevel)}`}>{c.threatLevel}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Cards */}
      <div className="grid md:grid-cols-2 gap-3">
        {sorted.map((comp) => {
          const expanded = expandedId === comp.id;
          return (
            <Card
              key={comp.id}
              className={`cursor-pointer transition-all ${expanded ? "ring-1 ring-primary/30" : ""}`}
              data-testid={`competitor-${comp.compId}`}
              onClick={() => setExpandedId(expanded ? null : comp.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{comp.name}</h3>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 capitalize ${getThreatColor(comp.threatLevel)} border-current`}>
                        {comp.threatLevel} threat
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{comp.description}</p>
                  </div>
                  {expanded ? <ChevronUp size={14} className="text-muted-foreground shrink-0" /> : <ChevronDown size={14} className="text-muted-foreground shrink-0" />}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {comp.revenue && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <DollarSign size={10} />
                      {comp.revenue}
                    </div>
                  )}
                  {comp.employees && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users size={10} />
                      {comp.employees}
                    </div>
                  )}
                </div>

                {/* Overlap areas */}
                <div className="flex gap-1 mt-2">
                  {comp.overlapAreas.map(a => <SuiteBadge key={a} suite={a} />)}
                </div>

                {/* Key Strength */}
                <div className="flex items-start gap-1.5 mt-2 p-2 rounded bg-secondary/50">
                  <Shield size={12} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-[11px] font-medium">{comp.keyStrength}</span>
                </div>

                {expanded && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent Moves</h4>
                    <ul className="space-y-1.5">
                      {comp.recentMoves.map((move, i) => (
                        <li key={i} className="text-[11px] flex gap-1.5">
                          <AlertCircle size={10} className="text-primary shrink-0 mt-0.5" />
                          {move}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
