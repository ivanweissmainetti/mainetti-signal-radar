import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SuiteBadge, ImpactBadge } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import type { OpportunityRisk, ProductSuite } from "@/lib/types";
import { TrendingUp, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface OpportunitiesRisksProps {
  activeSuite: ProductSuite | "all";
}

export default function OpportunitiesRisks({ activeSuite }: OpportunitiesRisksProps) {
  const { data: opportunitiesRisks = [], isLoading } = useQuery<OpportunityRisk[]>({ queryKey: ["/api/opportunities-risks"] });

  const filtered = activeSuite === "all"
    ? opportunitiesRisks
    : opportunitiesRisks.filter(or => or.suites.some(s => s === activeSuite));

  const opportunities = filtered.filter(or => or.type === "opportunity").sort((a, b) => a.priority - b.priority);
  const risks = filtered.filter(or => or.type === "risk").sort((a, b) => a.priority - b.priority);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-[1400px]">
        <Skeleton className="h-8 w-48" />
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1400px]">
      <h1 className="text-lg font-semibold">Opportunities & Risks</h1>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Opportunities */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b">
            <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
            <h2 className="text-sm font-semibold">Opportunities</h2>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-[10px] border-0">
              {opportunities.length}
            </Badge>
          </div>
          {opportunities.map((opp) => (
            <Card key={opp.id} className="border-l-2 border-l-green-500" data-testid={`opportunity-${opp.orId}`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg font-bold text-green-600/30 dark:text-green-400/30 tabular-nums leading-none mt-0.5">
                    {opp.priority}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-semibold">{opp.title}</h3>
                      <ImpactBadge level={opp.impactLevel} />
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">{opp.timeHorizon}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{opp.description}</p>
                    <div className="flex gap-1 mt-2">
                      {opp.suites.map(s => <SuiteBadge key={s} suite={s} />)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Risks */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b">
            <ShieldAlert size={16} className="text-red-600 dark:text-red-400" />
            <h2 className="text-sm font-semibold">Risks</h2>
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-[10px] border-0">
              {risks.length}
            </Badge>
          </div>
          {risks.map((risk) => (
            <Card key={risk.id} className="border-l-2 border-l-red-500" data-testid={`risk-${risk.orId}`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg font-bold text-red-600/30 dark:text-red-400/30 tabular-nums leading-none mt-0.5">
                    {risk.priority}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-semibold">{risk.title}</h3>
                      <ImpactBadge level={risk.impactLevel} />
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">{risk.timeHorizon}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{risk.description}</p>
                    <div className="flex gap-1 mt-2">
                      {risk.suites.map(s => <SuiteBadge key={s} suite={s} />)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
