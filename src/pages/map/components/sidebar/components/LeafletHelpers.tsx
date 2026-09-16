import { useContext, useEffect } from "react";
import { useMap } from "react-leaflet";
import { MapContext } from "../../../../../context/createMapContext";

export function FlyToReport() {
  const map = useMap();
  const { markerRefs, selectedReport, setSelectedReport } =
    useContext(MapContext)!;

  useEffect(() => {
    if (!selectedReport) return;
    // Only fly if lastFlownReport report is different from the last selectedReport
    // if (lastFlownReport.current === selectedReport._id) return;

    const marker = markerRefs.current[selectedReport.issueId];

    map.closePopup();
    // This is to fix a bug where Leaflet is trying to access an internal DOM element that does not exist anymore.

    setTimeout(() => {
      // Force Leaflet to recompute layout before flying
      map.invalidateSize();

      map.flyTo(
        [
          selectedReport.location.coordinates[1],
          selectedReport.location.coordinates[0],
        ],
        19,
        { duration: 3 },
      );

      map.once("moveend", () => {
        marker?.openPopup();
        // Mark as flown
        // lastFlownReport.current = selectedReport._id;
        setSelectedReport(null);
      });
    }, 500); // match sidebar transition
  }, [map, markerRefs, selectedReport, setSelectedReport]);

  return null;
}

export function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [map]);
  return null;
}

export function FlyToCoordinates() {
  const map = useMap();
  const { initialReportCoordinates } = useContext(MapContext)!;

  useEffect(() => {
    if (!initialReportCoordinates) return;

    setTimeout(() => {
      // Force Leaflet to recompute layout before flying
      map.invalidateSize();

      map.flyTo(
        [initialReportCoordinates.lat, initialReportCoordinates.lng],
        19,
        { duration: 3 },
      );
    }, 500); // match sidebar transition
  }, [map, initialReportCoordinates]);

  return null;
}
