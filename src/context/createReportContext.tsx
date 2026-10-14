import { createContext, type Dispatch, type SetStateAction } from "react";
import type { FilterValues, NotificationType } from "../pages/map/types";

interface ReportContextType {
  filterValues: FilterValues;
  notification: NotificationType | null;
  setNotification: Dispatch<SetStateAction<NotificationType | null>>;
  setFilterValues: Dispatch<SetStateAction<FilterValues>>;
}

export const ReportContext = createContext<ReportContextType | null>(null);
