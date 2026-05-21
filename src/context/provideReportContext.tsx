import { useEffect, useRef, useState } from "react";
import { ReportContext } from "./createReportContext";
import { fetchReports } from "../pages/map/utils/fetchReports";
import type { NotificationType, Report } from "../pages/map/types";

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );
  const originalReports = useRef<Report[]>([]);
  useEffect(() => {
    // Fetch the report data from the API
    const url = "https://crackspots-server.onrender.com/api/v1/reports";
    async function loadReports(url: string) {
      setIsLoading(true);
      try {
        const data = await fetchReports(url);
        setNotification({
          type: "Success",
          message: "Reports fetched successfully.",
        });
        originalReports.current = data;
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setNotification({
          type: "Error",
          message: "Failed to fetch reports.",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    }
    loadReports(url);
  }, []);

  return (
    <ReportContext.Provider
      value={{
        reports,
        isLoading,
        setNotification,
        notification,
        setReports,
        originalReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}
