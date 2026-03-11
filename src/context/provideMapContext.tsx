import { useRef, useState } from "react";
import { MapContext } from "./createMapContext";
import type { Report } from "../pages/map/types";

export function MapContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const lastFlownReport = useRef<string>(null);
  return (
    <MapContext.Provider
      value={{
        selectedReport,
        setSelectedReport,
        markerRefs,
        lastFlownReport,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
