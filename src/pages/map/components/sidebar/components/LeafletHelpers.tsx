import { useContext, useEffect } from "react";
import * as L from "leaflet";
import * as turf from "@turf/turf";
import { Circle, Marker, useMap } from "react-leaflet";
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
  const { initialReportCoordinates, isCorrecting } = useContext(MapContext)!;

  useEffect(() => {
    if (!initialReportCoordinates) return;
    if (isCorrecting) {
      map.setView(
        [initialReportCoordinates.lat, initialReportCoordinates.lng],
        19,
      );
    } else {
      map.flyTo(
        [initialReportCoordinates.lat, initialReportCoordinates.lng],
        19,
        { duration: 3 },
      );
    }
  }, [map, initialReportCoordinates, isCorrecting]);

  return null;
}
export function MapCorrection() {
  const {
    initialReportCoordinates,
    correctedReportCoordinates,
    setCorrectedReportCoordinates,
  } = useContext(MapContext)!;
  function enforceBounds(e: L.LeafletEvent) {
    if (!initialReportCoordinates) return;

    const marker = e.target;
    const originalPosition = L.latLng(
      initialReportCoordinates.lat,
      initialReportCoordinates.lng,
    );
    const newPosition = marker.getLatLng();

    const distance = originalPosition.distanceTo(newPosition);

    if (distance > 30) {
      const direction = turf.bearing(
        [originalPosition.lng, originalPosition.lat],
        [newPosition.lng, newPosition.lat],
      );
      const boundaryPoint = turf.destination(
        [originalPosition.lng, originalPosition.lat],
        30,
        direction,
        { units: "meters" },
      );
      const boundaryLatLng = L.latLng(
        boundaryPoint.geometry.coordinates[1],
        boundaryPoint.geometry.coordinates[0],
      );
      marker.setLatLng(boundaryLatLng);
    }
  }
  if (!initialReportCoordinates) return null;
  return (
    <>
      <Circle
        center={[initialReportCoordinates.lat, initialReportCoordinates.lng]}
        radius={30}
        pathOptions={{
          fillOpacity: 0.15,
          weight: 2,
        }}
      />
      <Marker
        position={
          correctedReportCoordinates
            ? [correctedReportCoordinates.lat, correctedReportCoordinates.lng]
            : [initialReportCoordinates.lat, initialReportCoordinates.lng]
        }
        draggable
        eventHandlers={{
          dragstart: (e) => {
            e.target.setOpacity(0.7);
          },
          drag: enforceBounds,
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            e.target.setOpacity(1);
            setCorrectedReportCoordinates({ lat, lng });
          },
        }}
        zIndexOffset={40}
      />
    </>
  );
}
