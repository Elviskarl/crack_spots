import {
  createContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import type { Report, ReportCoordinates } from "../pages/map/types";
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
  initialReportCoordinates: ReportCoordinates | null;
  setInitialReportCoordinates: Dispatch<
    SetStateAction<ReportCoordinates | null>
  >;
  isCorrecting: boolean;
  setIsCorrecting: Dispatch<SetStateAction<boolean>>;
  correctedReportCoordinates: ReportCoordinates | null;
  setCorrectedReportCoordinates: Dispatch<
    SetStateAction<ReportCoordinates | null>
  >;
}

export const MapContext = createContext<MapContextType | null>(null);
