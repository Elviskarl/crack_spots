import {
  MapContainer,
  TileLayer,
  ZoomControl,
  LayersControl,
  Circle,
  Marker,
} from "react-leaflet";
import * as L from "leaflet";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import { useContext } from "react";

import "../../styles/map-container.css";
import { ReportContext } from "../../../../context/createReportContext";
import { ReportsContainer } from "./ReportsContainer";
import { MapContext } from "../../../../context/createMapContext";
import DisplayShapefile from "../sidebar/components/DisplayShapefile";
import {
  FlyToCoordinates,
  FlyToReport,
  ResizeMap,
} from "../sidebar/components/LeafletHelpers";

function LeafletMap() {
  const { reports, isLoading } = useContext(ReportContext)!;
  const {
    isNotInNairobi,
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
  return (
    <div className={`map-container ${isLoading ? "pulse-animation" : ""}`}>
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
              attribution="Imagery © Google"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <FlyToReport />
        <ResizeMap />
        <FlyToCoordinates />
        {isNotInNairobi && <DisplayShapefile />}
        {reports.length > 0 && (
          <ReportsContainer reports={reports} />
        )}
        {initialReportCoordinates && (
          <>
            <Circle
              center={[
                initialReportCoordinates.lat,
                initialReportCoordinates.lng,
              ]}
              radius={30}
              pathOptions={{
                fillOpacity: 0.15,
                weight: 2,
              }}
            />
            <Marker
              position={
                correctedReportCoordinates
                  ? [
                      correctedReportCoordinates.lat,
                      correctedReportCoordinates.lng,
                    ]
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
        )}
      </MapContainer>
    </div>
  );
}

export default LeafletMap;
