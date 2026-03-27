import { QueryClient, QueryFunction, QueryFunctionContext } from "@tanstack/react-query";
import { dataStore } from "@/data/dataStore";

// Local query function that uses the client-side dataStore instead of API calls
const getLocalQueryFn = <T,>(options?: {
  on401?: "returnNull" | "throw";
}): QueryFunction<T> =>
  async (context: QueryFunctionContext): Promise<T> => {
    const queryKey = context.queryKey;
    const path = Array.isArray(queryKey) ? queryKey.join("/") : String(queryKey);

    // Route to local dataStore functions
    if (path === "/api/signals") {
      return dataStore.getAllSignals() as T;
    } else if (path === "/api/regulations") {
      return dataStore.getAllRegulations() as T;
    } else if (path === "/api/stakeholders") {
      return dataStore.getAllStakeholders() as T;
    } else if (path === "/api/competitors") {
      return dataStore.getAllCompetitors() as T;
    } else if (path === "/api/opportunities-risks") {
      return dataStore.getAllOpportunitiesRisks() as T;
    } else if (path === "/api/milestones") {
      return dataStore.getAllMilestones() as T;
    } else if (path === "/api/advisory") {
      return dataStore.getAllAdvisoryItems() as T;
    } else if (path === "/api/kpis") {
      return dataStore.getKPIs() as T;
    } else if (path === "/api/scan/status") {
      return dataStore.getScanStatus() as T;
    } else {
      throw new Error(`Unknown query path: ${path}`);
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getLocalQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 30000,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// For backward compatibility with direct API requests
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Handle scan trigger
  if (method === "POST" && url === "/api/scan/trigger") {
    try {
      await dataStore.triggerScan();
      return new Response(JSON.stringify({ message: "Scan started" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Handle GET requests via queryClient
  if (method === "GET") {
    try {
      const queryKey = url.split("/");
      const fn = getLocalQueryFn({ on401: "throw" });
      const result = await fn({ queryKey } as unknown as QueryFunctionContext);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  throw new Error(`Unsupported method: ${method}`);
}

// Export getQueryFn for compatibility
export { getLocalQueryFn as getQueryFn };
