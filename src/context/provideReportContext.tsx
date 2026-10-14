import { useState, type ReactNode } from "react";
// createContext
import { ReportContext } from "./createReportContext";
// types
import type { FilterValues, NotificationType } from "../pages/map/types";
import { defaultFilterValues } from "../pages/map/data";

export function ReportProvider({ children }: { children: ReactNode }) {
  const [filterValues, setFilterValues] =
    useState<FilterValues>(defaultFilterValues);
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );

  return (
    <ReportContext.Provider
      value={{
        filterValues,
        setNotification,
        notification,
        setFilterValues,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}
