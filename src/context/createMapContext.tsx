import {
  createContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import type { Report } from "../pages/map/types";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";

interface MapContextType {
  selectedReport: Report | null;
  setSelectedReport: Dispatch<SetStateAction<Report | null>>;
  lastFlownReport: RefObject<string | null>;
  markerRefs: RefObject<Record<string, L.Marker>>;
  nairobiSubCountyShapefile: RefObject<FeatureCollection<
    Polygon | MultiPolygon
  > | null>;
  isNotInNairobi: boolean;
  setIsNotInNairobi: Dispatch<SetStateAction<boolean>>;
}

export const MapContext = createContext<MapContextType | null>(null);
