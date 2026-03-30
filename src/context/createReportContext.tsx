import {
  createContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import type { NotificationType, Report } from "../pages/map/types";

interface ReportContextType {
  reports: Report[];
  isLoading: boolean;
  notification: NotificationType | null;
  setNotification: Dispatch<SetStateAction<NotificationType | null>>;
  setReports: Dispatch<SetStateAction<Report[]>>;
  originalReports: RefObject<Report[]>;
}

export const ReportContext = createContext<ReportContextType | null>(null);
