import { useRef, useState } from "react";
import { MapContext } from "./createMapContext";
import type { Map } from "leaflet";
import type { Report } from "../pages/map/types";

export function MapContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const [map, setMap] = useState<Map | null>(null);

  return (
    <MapContext.Provider
      value={{ selectedReport, setSelectedReport, markerRefs, map, setMap }}
    >
      {children}
    </MapContext.Provider>
  );
}
