import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SuiteBadge, ImpactBadge, getImpactDot } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import type { Signal, KPIs, AdvisoryItem, ProductSuite } from "@/lib/types";
import {
  AlertTriangle, Radio, ShieldAlert, Zap, Eye, MessageSquare, ArrowRight, Calendar,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const CHART_COLORS = ["hsl(183,98%,22%)", "hsl(20,73%,34%)", "hsl(103,56%,31%)", "hsl(43,74%,49%)", "hsl(320,57%,40%)"];
const IMPACT_COLORS = ["#dc2626", "#ea580c", "#ca8a04", "#16a34a"];

interface OverviewProps {
  activeSuite: ProductSuite | "all";
}

export default function Overview({ activeSuite }: OverviewProps) {
  const { data: signals = [], isLoading: loadingSignals } = useQuery<Signal[]>({ queryKey: ["/api/signals"] });
  const { data: kpis } = useQuery<KPIs>({ queryKey: ["/api/kpis"] });
  const { data: advisoryItems = [] } = useQuery<AdvisoryItem[]>({ queryKey: ["/api/advisory"] });

  const weeklyChanges = advisoryItems.filter(a => a.category === "weekly-change").sort((a, b) => a.sortOrder - b.sortOrder);
  const tellClients = advisoryItems.filter(a => a.category === "tell-clients").sort((a, b) => a.sortOrder - b.sortOrder);
  const prepareFor = advisoryItems.filter(a => a.category === "prepare-for").sort((a, b) => a.sortOrder - b.sortOrder);

  const criticalAlerts = signals
    .filter(s => s.impactLevel === "critical" || s.impactLevel === "high")
    .filter(s => activeSuite === "all" || s.suites.includes(activeSuite as ProductSuite))
    .sort((a, b) => {
      const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return (order[a.impactLevel] || 9) - (order[b.impactLevel] || 9);
    });

  // Distribution data
  const suiteDist = [
    { name: "Product Branding", value: signals.filter((s) => s.suites.includes("Product Branding")).length },
    { name: "Retail Experience", value: signals.filter((s) => s.suites.includes("Retail Experience")).length },
    { name: "Supply Chain", value: signals.filter((s) => s.suites.includes("Supply Chain / Product Movement")).length },
  ];
  const impactDist = [
    { name: "Critical", value: signals.filter((s) => s.impactLevel === "critical").length },
    { name: "High", value: signals.filter((s) => s.impactLevel === "high").length },
    { name: "Medium", value: signals.filter((s) => s.impactLevel === "medium").length },
    { name: "Low", value: signals.filter((s) => s.impactLevel === "low").length },
  ];
  const horizonDist = [
    { name: "Immediate", value: signals.filter((s) => s.timeHorizon === "immediate").length },
    { name: "Short-term", value: signals.filter((s) => s.timeHorizon === "short-term").length },
    { name: "Medium-term", value: signals.filter((s) => s.timeHorizon === "medium-term").length },
    { name: "Long-term", value: signals.filter((s) => s.timeHorizon === "long-term").length },
  ];

  if (loadingSignals) {
    return (
      <div className="space-y-4 max-w-[1400px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1400px]">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" data-testid="kpi-cards">
        <KPICard icon={Radio} label="Total Signals" value={kpis?.totalSignals ?? signals.length} />
        <KPICard icon={ShieldAlert} label="Critical Alerts" value={kpis?.criticalAlerts ?? 0} accent="text-red-600 dark:text-red-400" />
        <KPICard icon={AlertTriangle} label="High-Impact" value={kpis?.highImpact ?? 0} accent="text-orange-600 dark:text-orange-400" />
        <KPICard icon={Zap} label="This Week" value={kpis?.thisWeek ?? 0} accent="text-primary" />
        <KPICard icon={Eye} label="Action Required" value={kpis?.actionRequired ?? 0} accent="text-amber-600 dark:text-amber-400" />
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* What Changed This Week */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                What Changed This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {weeklyChanges.map((wc) => (
                <div key={wc.itemId} className="flex items-start gap-3 py-1.5 border-b last:border-0" data-testid={`weekly-change-${wc.itemId}`}>
                  <span className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap mt-0.5">{wc.date}</span>
                  <span className="text-xs leading-snug">{wc.title}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto whitespace-nowrap">{wc.source}</span>
                </div>
              ))}
              {weeklyChanges.length === 0 && <div className="text-xs text-muted-foreground py-2">No updates this week.</div>}
            </CardContent>
          </Card>

          {/* High Priority Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldAlert size={14} className="text-red-500" />
                High Priority Alerts
                <Badge variant="outline" className="ml-2 text-[10px] bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                  {criticalAlerts.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {criticalAlerts.slice(0, 6).map((alert) => (
                <div key={alert.signalId} className="flex items-start gap-3 py-2 border-b last:border-0" data-testid={`alert-${alert.signalId}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getImpactDot(alert.impactLevel)}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium">{alert.title}</span>
                      <ImpactBadge level={alert.impactLevel} />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{alert.summary}</p>
                    <div className="flex gap-1 mt-1">
                      {alert.suites.map((s) => <SuiteBadge key={s} suite={s} />)}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">{alert.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare size={14} className="text-primary" />
                Tell Clients Now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tellClients.map((item, i) => (
                <div key={item.itemId} className="pb-3 border-b last:border-0 last:pb-0" data-testid={`tell-clients-${item.itemId}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-primary tabular-nums">{i + 1}</span>
                    <div>
                      <p className="text-xs font-medium leading-snug">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ArrowRight size={14} className="text-primary" />
                Prepare For
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {prepareFor.map((item, i) => (
                <div key={item.itemId} className="pb-3 border-b last:border-0 last:pb-0" data-testid={`prepare-for-${item.itemId}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-muted-foreground tabular-nums">{i + 1}</span>
                    <div>
                      <p className="text-xs font-medium leading-snug">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{item.description}</p>
                      {item.horizon && <span className="text-[10px] text-primary font-medium">{item.horizon}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">By Product Suite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={suiteDist} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  <Bar dataKey="value" fill="hsl(183,98%,22%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">By Impact Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={impactDist} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" paddingAngle={2}>
                    {impactDist.map((_, i) => <Cell key={i} fill={IMPACT_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-3 mt-1">
              {impactDist.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: IMPACT_COLORS[i] }} />
                  <span className="text-[10px] text-muted-foreground">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">By Time Horizon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={horizonDist} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  <Bar dataKey="value" fill="hsl(183,98%,22%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, accent }: { icon: typeof Radio; label: string; value: number; accent?: string }) {
  return (
    <Card data-testid={`kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <Icon size={16} className={accent || "text-muted-foreground"} />
          <span className={`text-xl font-bold tabular-nums ${accent || ""}`}>{value}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 font-medium">{label}</p>
      </CardContent>
    </Card>
  );
}
