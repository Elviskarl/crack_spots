import { useEffect, useRef, useState } from "react";
import { MapContext } from "./createMapContext";
import type { Report, ReportCoordinates } from "../pages/map/types";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { loadBoundary } from "../pages/map/utils/utils";

export function MapContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const lastFlownReport = useRef<string>(null);
  const nairobiSubCountyShapefile =
    useRef<FeatureCollection<Polygon | MultiPolygon>>(null);
  const [isNotInNairobi, setIsNotInNairobi] = useState(false);
  const [initialReportCoordinates, setInitialReportCoordinates] =
    useState<ReportCoordinates | null>(null);
  const [correctedReportCoordinates, setCorrectedReportCoordinates] =
    useState<ReportCoordinates | null>(null);
  const [isCorrecting, setIsCorrecting] = useState(false);

  useEffect(() => {
    async function loadShapefile() {
      try {
        if (!nairobiSubCountyShapefile.current) {
          const data = await loadBoundary();
          nairobiSubCountyShapefile.current = data;
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadShapefile();
  }, []);
  return (
    <MapContext.Provider
      value={{
        isNotInNairobi,
        setIsNotInNairobi,
        selectedReport,
        setSelectedReport,
        markerRefs,
        lastFlownReport,
        nairobiSubCountyShapefile,
        initialReportCoordinates,
        setInitialReportCoordinates,
        isCorrecting,
        setIsCorrecting,
        correctedReportCoordinates,
        setCorrectedReportCoordinates,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
