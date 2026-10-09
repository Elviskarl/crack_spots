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
    const abortController = new AbortController();
    async function loadReports(url: string) {
      setIsLoading(true);

      try {
        const data = await fetchReports(url, abortController.signal);

        // Ignore results if this effect has been cleaned up.
        if (abortController.signal.aborted) return;

        originalReports.current = data;
        setReports(data);
        setNotification({
          type: "Success",
          message: "Reports fetched successfully.",
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Error fetching reports:", err);

        setNotification({
          type: "Error",
          message: `Failed to fetch reports: ${
            err instanceof Error ? err.message : String(err)
          }`,
        });
      } finally {
        // Don't let a cancelled request update loading state.
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }
    loadReports(url);

    return () => {
      abortController.abort();
    };
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
