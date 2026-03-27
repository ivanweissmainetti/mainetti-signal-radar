import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import DashboardLayout from "@/components/DashboardLayout";
import Overview from "@/pages/Overview";
import SignalsFeed from "@/pages/SignalsFeed";
import PolicyTracker from "@/pages/PolicyTracker";
import StakeholderMap from "@/pages/StakeholderMap";
import CompetitorWatch from "@/pages/CompetitorWatch";
import OpportunitiesRisks from "@/pages/OpportunitiesRisks";
import NotFound from "@/pages/not-found";
import { useState } from "react";
import type { ProductSuite } from "@/lib/types";

function AppRouter() {
  const [activeSuite, setActiveSuite] = useState<ProductSuite | "all">("all");

  return (
    <DashboardLayout activeSuite={activeSuite} onSuiteChange={setActiveSuite}>
      <Switch>
        <Route path="/" component={() => <Overview activeSuite={activeSuite} />} />
        <Route path="/signals" component={() => <SignalsFeed activeSuite={activeSuite} />} />
        <Route path="/policy" component={() => <PolicyTracker activeSuite={activeSuite} />} />
        <Route path="/stakeholders" component={() => <StakeholderMap activeSuite={activeSuite} />} />
        <Route path="/competitors" component={() => <CompetitorWatch activeSuite={activeSuite} />} />
        <Route path="/opportunities" component={() => <OpportunitiesRisks activeSuite={activeSuite} />} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Router hook={useHashLocation}>
            <AppRouter />
          </Router>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
