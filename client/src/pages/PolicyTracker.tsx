import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SuiteBadge, ImpactBadge, getImpactDot } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import type { Regulation, Milestone, ProductSuite } from "@/lib/types";
import { Calendar, Clock, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PolicyTrackerProps {
  activeSuite: ProductSuite | "all";
}

export default function PolicyTracker({ activeSuite }: PolicyTrackerProps) {
  const { data: regulations = [], isLoading: loadingRegs } = useQuery<Regulation[]>({ queryKey: ["/api/regulations"] });
  const { data: milestones = [], isLoading: loadingMs } = useQuery<Milestone[]>({ queryKey: ["/api/milestones"] });

  const [geoFilter, setGeoFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let result = regulations;
    if (activeSuite !== "all") result = result.filter(r => r.suites.includes(activeSuite as ProductSuite));
    if (geoFilter !== "all") result = result.filter(r => r.geography === geoFilter);
    return result.sort((a, b) => new Date(a.nextMilestoneDate).getTime() - new Date(b.nextMilestoneDate).getTime());
  }, [regulations, activeSuite, geoFilter]);

  const filteredMilestones = useMemo(() => {
    let result = milestones;
    if (activeSuite !== "all") result = result.filter(m => m.suites.includes(activeSuite as ProductSuite));
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [milestones, activeSuite]);

  const daysUntil = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loadingRegs || loadingMs) {
    return (
      <div className="space-y-4 max-w-[1400px]">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 rounded-lg" />
        <div className="grid md:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Policy Tracker</h1>
        <Select value={geoFilter} onValueChange={setGeoFilter}>
          <SelectTrigger className="h-8 w-[150px] text-xs" data-testid="select-geography">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Geographies</SelectItem>
            <SelectItem value="EU-wide" className="text-xs">EU-wide</SelectItem>
            <SelectItem value="Germany" className="text-xs">Germany</SelectItem>
            <SelectItem value="France" className="text-xs">France</SelectItem>
            <SelectItem value="UK" className="text-xs">UK</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Upcoming Milestones Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar size={14} className="text-primary" />
            Upcoming Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-4">
              {filteredMilestones.map((m) => {
                const days = daysUntil(m.date);
                const isUrgent = days <= 30;
                return (
                  <div key={m.id} className="relative pl-8" data-testid={`milestone-${m.msId}`}>
                    <div className={`absolute left-1.5 w-3 h-3 rounded-full border-2 border-background ${getImpactDot(m.impactLevel)}`} />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">{m.title}</span>
                          <ImpactBadge level={m.impactLevel} />
                          {isUrgent && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 animate-pulse">
                              <AlertTriangle size={10} className="mr-0.5" />
                              {days}d
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{m.description}</p>
                        <div className="flex gap-1 mt-1">
                          {m.suites.map(s => <SuiteBadge key={s} suite={s} />)}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-medium tabular-nums">{m.date}</span>
                        <div className="text-[10px] text-muted-foreground">{days > 0 ? `${days} days` : "Past"}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulation Cards */}
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((reg) => {
          const days = daysUntil(reg.nextMilestoneDate);
          const expanded = expandedId === reg.id;
          return (
            <Card
              key={reg.id}
              className={`cursor-pointer transition-all ${expanded ? "ring-1 ring-primary/30" : ""}`}
              data-testid={`regulation-${reg.regId}`}
              onClick={() => setExpandedId(expanded ? null : reg.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">{reg.shortName}</Badge>
                      <ImpactBadge level={reg.impactLevel} />
                    </div>
                    <h3 className="text-xs font-semibold mt-1.5">{reg.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{reg.status}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock size={10} />
                      {days > 0 ? `${days}d` : "Past"}
                    </div>
                    <span className="text-[10px] tabular-nums">{reg.nextMilestoneDate}</span>
                    {expanded ? <ChevronUp size={14} className="text-muted-foreground ml-auto mt-1" /> : <ChevronDown size={14} className="text-muted-foreground ml-auto mt-1" />}
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  {reg.suites.map(s => <SuiteBadge key={s} suite={s} />)}
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto">{reg.geography}</Badge>
                </div>
                {expanded && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    <p className="text-xs leading-relaxed">{reg.description}</p>
                    <div>
                      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Key Requirements</h4>
                      <ul className="space-y-0.5">
                        {reg.keyRequirements.map((req, i) => (
                          <li key={i} className="text-[11px] flex gap-1.5">
                            <span className="text-primary shrink-0">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Next: <strong className="text-foreground">{reg.nextMilestone}</strong>
                    </div>
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
