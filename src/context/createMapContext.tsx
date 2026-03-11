import {
  createContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import type { Report } from "../pages/map/types";

interface MapContextType {
  selectedReport: Report | null;
  setSelectedReport: Dispatch<SetStateAction<Report | null>>;
  lastFlownReport: RefObject<string | null>;
  markerRefs: RefObject<Record<string, L.Marker>>;
}

export const MapContext = createContext<MapContextType | null>(null);
