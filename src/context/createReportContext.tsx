import { createContext, type Dispatch, type SetStateAction } from "react";
import type { NotificationType, Report } from "../pages/map/types";

interface ReportContextType {
  reports: Report[];
  isLoading: boolean;
  notification: NotificationType | null;
  setNotification: Dispatch<SetStateAction<NotificationType | null>>;
}

export const ReportContext = createContext<ReportContextType | null>(null);
