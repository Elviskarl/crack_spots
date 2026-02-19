import { createContext } from "react";
import type { Report } from "../pages/map/types";

export const ReportContext = createContext<Report[] | null>(null);
