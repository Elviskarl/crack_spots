import { createContext } from "react";
import type { Report } from "../pages/map/types";

interface ReportContextType {
  reports: Report[];
}

export const ReportContext = createContext<ReportContextType | null>(null);
