import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import type { Stakeholder, ProductSuite } from "@/lib/types";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StakeholderMapProps {
  activeSuite: ProductSuite | "all";
}

export default function StakeholderMap({ activeSuite }: StakeholderMapProps) {
  const { data: stakeholders = [], isLoading } = useQuery<Stakeholder[]>({ queryKey: ["/api/stakeholders"] });

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [geoFilter, setGeoFilter] = useState<string>("all");
  const [impFilter, setImpFilter] = useState<string>("all");

  const categories = useMemo(() => [...new Set(stakeholders.map(s => s.category))], [stakeholders]);

  const filtered = useMemo(() => {
    let result = stakeholders;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q) ||
        s.relevance.toLowerCase().includes(q)
      );
    }
    if (catFilter !== "all") result = result.filter(s => s.category === catFilter);
    if (geoFilter !== "all") result = result.filter(s => s.geography === geoFilter);
    if (impFilter !== "all") result = result.filter(s => s.importance === impFilter);
    return result;
  }, [stakeholders, search, catFilter, geoFilter, impFilter]);

  const importanceColor = (imp: string) => {
    switch (imp) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-[1400px]">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Stakeholder Map</h1>
        <span className="text-xs text-muted-foreground tabular-nums">{filtered.length} stakeholders</span>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search stakeholders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
                data-testid="input-search-stakeholders"
              />
            </div>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="h-8 w-[160px] text-xs" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={geoFilter} onValueChange={setGeoFilter}>
              <SelectTrigger className="h-8 w-[130px] text-xs" data-testid="select-geo">
                <SelectValue placeholder="Geography" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Geographies</SelectItem>
                <SelectItem value="EU-wide" className="text-xs">EU-wide</SelectItem>
                <SelectItem value="France" className="text-xs">France</SelectItem>
                <SelectItem value="Germany" className="text-xs">Germany</SelectItem>
                <SelectItem value="UK" className="text-xs">UK</SelectItem>
                <SelectItem value="Global" className="text-xs">Global</SelectItem>
              </SelectContent>
            </Select>
            <Select value={impFilter} onValueChange={setImpFilter}>
              <SelectTrigger className="h-8 w-[130px] text-xs" data-testid="select-importance">
                <SelectValue placeholder="Importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Levels</SelectItem>
                <SelectItem value="high" className="text-xs">High</SelectItem>
                <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                <SelectItem value="low" className="text-xs">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider w-8"></TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider">Organization</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider">Geography</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider">Role</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider max-w-[300px]">Relevance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((stk) => (
                <TableRow key={stk.id} data-testid={`stakeholder-${stk.stkId}`}>
                  <TableCell className="py-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${importanceColor(stk.importance)}`} title={`${stk.importance} importance`} />
                  </TableCell>
                  <TableCell className="text-xs font-medium py-2">{stk.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground py-2">{stk.organization}</TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{stk.category}</Badge>
                  </TableCell>
                  <TableCell className="text-xs py-2">{stk.geography}</TableCell>
                  <TableCell className="text-[11px] text-muted-foreground py-2 max-w-[200px] truncate">{stk.role}</TableCell>
                  <TableCell className="text-[11px] py-2 max-w-[300px]">
                    <p className="line-clamp-2">{stk.relevance}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="font-medium uppercase tracking-wider">Importance:</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          High
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          Medium
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Low
        </div>
      </div>
    </div>
  );
}
