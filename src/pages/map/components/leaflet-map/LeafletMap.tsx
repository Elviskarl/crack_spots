import {
  MapContainer,
  TileLayer,
  ZoomControl,
  LayersControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useContext, useEffect } from "react";

import "../../styles/map-container.css";
import { ReportContext } from "../../../../context/createReportContext";
import { ReportsContainer } from "./ReportsContainer";
import { MapContext } from "../../../../context/createMapContext";

function LeafletMap() {
  const { reports, isLoading } = useContext(ReportContext)!;

  function FlyToReport() {
    const map = useMap();
    const { selectedReport, markerRefs, setSelectedReport } =
      useContext(MapContext)!;

    useEffect(() => {
      if (!selectedReport) return;
      // Only fly if lastFlownReport report is different from the last selectedReport
      // if (lastFlownReport.current === selectedReport._id) return;

      const marker = markerRefs.current[selectedReport._id];

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
    }, [selectedReport, map, markerRefs, setSelectedReport]);

    return null;
  }

  function ResizeMap() {
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

  return (
    <div className={`map-container ${isLoading && "pulse-animation"}`}>
      <MapContainer
        center={[-1.216013888888889, 36.90145277777778]}
        zoom={14}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <ZoomControl position="topright" />
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View" checked>
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={["mt1", "mt2", "mt3"]}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <FlyToReport />
        <ResizeMap />
        {reports && reports.length > 0 && (
          <ReportsContainer reports={reports} />
        )}
      </MapContainer>
    </div>
  );
}

export default LeafletMap;
