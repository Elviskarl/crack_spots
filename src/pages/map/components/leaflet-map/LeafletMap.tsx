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
  const { reports } = useContext(ReportContext)!;
  const { map, markerRefs, selectedReport } = useContext(MapContext)!;

  useEffect(() => {
    if (!map) {
      console.error("Map instance is not available");
      return;
    }
    if (!selectedReport) {
      console.warn("No report selected");
      return;
    }

    const marker = markerRefs.current[selectedReport._id];

    // This is to fix a bug where Leaflet is trying to access an internal DOM element that does not exist anymore.
    map.whenReady(() => {
      map.flyTo(
        [
          selectedReport.location.coordinates[1],
          selectedReport.location.coordinates[0],
        ],
        19,
        { duration: 3 },
      );
    }, [map, selectedReport]);
    
    map.once("moveend", () => {
      if (marker) {
        marker.openPopup();
      } else {
        console.warn(`Marker for report ID ${selectedReport._id} not found.`);
      }
    });
  });

  function MapInitializer() {
    const map = useMap();
    const { setMap } = useContext(MapContext)!;
    // This function will be implemented to fly to the report location on the map when a report is selected from the sidebar.

    useEffect(() => {
      setMap(map);
    }, [map, setMap]);

    return null;
  }

  return (
    <MapContainer
      center={[-1.216013888888889, 36.90145277777778]}
      zoom={14}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <LayersControl position="topright">
      <ZoomControl position="topright" />
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
      {reports && reports.length > 0 && <ReportsContainer reports={reports} />}
      <MapInitializer />
    </MapContainer>
  );
}

export default LeafletMap;
