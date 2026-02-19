import { useEffect, useState } from "react";
import { ReportContext } from "./createReportContext";
import { fetchReports } from "../pages/map/utils/fetchReports";
import type { Report } from "../pages/map/types";

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [report, setReport] = useState<Report[]>([]);

  useEffect(() => {
    // Fetch the report data from the API
    const url = "https://crackspots-server.onrender.com/api/v1/reports";
    fetchReports(url)
      .then((data) => {
        if (!data) return;
        setReport(data);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
      });
  }, []);

  return (
    <ReportContext.Provider value={report}>
      {children}
    </ReportContext.Provider>
  );
}