import { createContext, type RefObject } from "react";
import type { Report } from "../pages/map/types";
import type { Map } from "leaflet";

interface MapContextType {
  selectedReport: Report | null;
  setSelectedReport: React.Dispatch<React.SetStateAction<Report | null>>;
  map: Map | null;
  setMap: React.Dispatch<React.SetStateAction<Map | null>>;
  markerRefs: RefObject<Record<string, L.Marker>>;
}

export const MapContext = createContext<MapContextType | null>(null);
