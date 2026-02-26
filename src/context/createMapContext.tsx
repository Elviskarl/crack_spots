import {
  createContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import type { Report } from "../pages/map/types";
import type { Map } from "leaflet";

interface MapContextType {
  selectedReport: Report | null;
  setSelectedReport: Dispatch<SetStateAction<Report | null>>;
  map: Map | null;
  setMap: Dispatch<SetStateAction<Map | null>>;
  markerRefs: RefObject<Record<string, L.Marker>>;
}

export const MapContext = createContext<MapContextType | null>(null);
