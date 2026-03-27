import { Link, useLocation } from "wouter";
import { useTheme } from "./ThemeProvider";
import {
  LayoutDashboard,
  Radio,
  Scale,
  Users,
  Swords,
  TrendingUp,
  Sun,
  Moon,
  Tag,
  ShoppingBag,
  Truck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { dataStore } from "@/data/dataStore";
import { useToast } from "@/hooks/use-toast";
import type { ProductSuite, KPIs, ScanStatus } from "@/lib/types";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

const navItems = [
  { path: "/", label: "Overview", icon: LayoutDashboard },
  { path: "/signals", label: "Signals Feed", icon: Radio },
  { path: "/policy", label: "Policy Tracker", icon: Scale },
  { path: "/stakeholders", label: "Stakeholder Map", icon: Users },
  { path: "/competitors", label: "Competitor Watch", icon: Swords },
  { path: "/opportunities", label: "Opportunities & Risks", icon: TrendingUp },
];

const suiteFilters: { label: string; value: ProductSuite | "all" }[] = [
  { label: "All Suites", value: "all" },
  { label: "Product Branding", value: "Product Branding" },
  { label: "Retail Experience", value: "Retail Experience" },
  { label: "Supply Chain", value: "Supply Chain / Product Movement" },
];

const suiteIcons: Record<string, typeof Tag> = {
  "Product Branding": Tag,
  "Retail Experience": ShoppingBag,
  "Supply Chain / Product Movement": Truck,
};

export function getSuiteIcon(suite: string) {
  return suiteIcons[suite] || Tag;
}

export function getSuiteColor(suite: string): string {
  switch (suite) {
    case "Product Branding":
      return "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300";
    case "Retail Experience":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
    case "Supply Chain / Product Movement":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

export function getImpactColor(level: string): string {
  switch (level) {
    case "critical":
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800";
    case "high":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

export function getImpactDot(level: string): string {
  switch (level) {
    case "critical": return "bg-red-500";
    case "high": return "bg-orange-500";
    case "medium": return "bg-yellow-500";
    case "low": return "bg-green-500";
    default: return "bg-gray-400";
  }
}

export function getThreatColor(level: string): string {
  switch (level) {
    case "high": return "text-red-600 dark:text-red-400";
    case "medium-high": return "text-orange-600 dark:text-orange-400";
    case "medium": return "text-yellow-600 dark:text-yellow-400";
    case "low-medium": return "text-blue-600 dark:text-blue-400";
    case "low": return "text-green-600 dark:text-green-400";
    default: return "text-gray-500";
  }
}

interface DashboardLayoutProps {
  children: ReactNode;
  activeSuite: ProductSuite | "all";
  onSuiteChange: (suite: ProductSuite | "all") => void;
}

export default function DashboardLayout({ children, activeSuite, onSuiteChange }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const { toast } = useToast();

  // Fetch KPIs for the last scan time
  const { data: kpis } = useQuery<KPIs>({ queryKey: ["/api/kpis"] });

  // Scan status polling
  const { data: scanStatus, refetch: refetchScanStatus } = useQuery<ScanStatus>({
    queryKey: ["/api/scan/status"],
    refetchInterval: (query) => {
      const data = query.state.data as ScanStatus | undefined;
      return data?.status === "running" ? 3000 : false;
    },
  });

  const isScanning = scanStatus?.status === "running";

  // Trigger scan mutation
  const scanMutation = useMutation({
    mutationFn: async () => {
      return await dataStore.triggerScan();
    },
    onSuccess: () => {
      toast({ title: "Scan started", description: "Searching for new intelligence signals..." });
      // Start polling
      refetchScanStatus();
      // Poll for completion with local status check
      const poll = setInterval(async () => {
        const status = dataStore.getScanStatus();
        if (status.status !== "running") {
          clearInterval(poll);
          // Refresh all data
          queryClient.invalidateQueries({ queryKey: ["/api/signals"] });
          queryClient.invalidateQueries({ queryKey: ["/api/kpis"] });
          queryClient.invalidateQueries({ queryKey: ["/api/scan/status"] });
          refetchScanStatus();
          if (status.status === "completed") {
            toast({
              title: "Scan complete",
              description: `${status.newSignals || 0} new signals found. ${status.summary || ""}`,
            });
          } else {
            toast({ title: "Scan finished", description: status.summary || "Check results.", variant: "destructive" });
          }
        }
      }, 2000);
    },
    onError: (err: any) => {
      toast({ title: "Scan failed", description: err.message, variant: "destructive" });
    },
  });

  const lastScanFormatted = kpis?.lastScanAt
    ? new Date(kpis.lastScanAt).toLocaleString("en-GB", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Brussels" }) + " CET"
    : "Never";

  return (
    <div className="h-screen flex overflow-hidden bg-background" data-testid="dashboard-layout">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 ${
          collapsed ? "w-16" : "w-56"
        }`}
        data-testid="sidebar"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border shrink-0">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="Mainetti Signal Radar" className="shrink-0">
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
            <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
            <circle cx="16" cy="16" r="4" fill="currentColor"/>
            <line x1="16" y1="16" x2="16" y2="2" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="16" y1="16" x2="27" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
          </svg>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-tight">Signal Radar</span>
              <span className="text-[10px] text-sidebar-foreground/60 uppercase tracking-widest">Mainetti</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overscroll-contain">
          {navItems.map((item) => {
            const isActive = item.path === "/" ? location === "/" : location === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="border-t border-sidebar-border p-2 space-y-1 shrink-0">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground w-full transition-colors"
            data-testid="button-theme-toggle"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground w-full transition-colors"
            data-testid="button-collapse-sidebar"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b flex items-center justify-between px-4 bg-background shrink-0" data-testid="header">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Filter by Suite</span>
            <div className="flex gap-1 ml-2">
              {suiteFilters.map((sf) => (
                <button
                  key={sf.value}
                  onClick={() => onSuiteChange(sf.value as ProductSuite | "all")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeSuite === sf.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                  data-testid={`filter-suite-${sf.value}`}
                >
                  {sf.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Update Now button */}
            <button
              onClick={() => scanMutation.mutate()}
              disabled={isScanning || scanMutation.isPending}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isScanning
                  ? "bg-primary/10 text-primary cursor-wait"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
              data-testid="button-update-now"
            >
              {isScanning ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw size={13} />
                  Update Now
                </>
              )}
            </button>
            <div className="text-xs text-muted-foreground tabular-nums">
              Updated: {lastScanFormatted}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overscroll-contain p-4" data-testid="main-content">
          {children}
          <div className="mt-8 pb-4">
            <PerplexityAttribution />
          </div>
        </main>
      </div>
    </div>
  );
}

export function SuiteBadge({ suite }: { suite: string }) {
  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getSuiteColor(suite)} border-0`}>
      {suite === "Supply Chain / Product Movement" ? "Supply Chain" : suite}
    </Badge>
  );
}

export function ImpactBadge({ level }: { level: string }) {
  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getImpactColor(level)} capitalize`}>
      {level}
    </Badge>
  );
}
