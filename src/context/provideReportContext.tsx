import { useEffect, useState } from "react";
import { ReportContext } from "./createReportContext";
import { fetchReports } from "../pages/map/utils/fetchReports";
import type { Report } from "../pages/map/types";

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch the report data from the API
    const url = "https://crackspots-server.onrender.com/api/v1/reports";
    async function loadReports(url: string) {
      setIsLoading(true);
      try {
        const data = await fetchReports(url);
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    }
    loadReports(url);
  }, []);

  return (
    <ReportContext.Provider value={{ reports, isLoading }}>
      {children}
    </ReportContext.Provider>
  );
}
