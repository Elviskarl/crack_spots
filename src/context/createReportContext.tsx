import { createContext, type Dispatch, type SetStateAction } from "react";
import type { ErrorMessage, Report } from "../pages/map/types";

interface ReportContextType {
  reports: Report[];
  isLoading: boolean;
  errorMessage: ErrorMessage | null;
  setErrorMessage: Dispatch<SetStateAction<ErrorMessage | null>>;
}

export const ReportContext = createContext<ReportContextType | null>(null);
