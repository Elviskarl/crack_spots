import {
  MapContainer,
  TileLayer,
  ZoomControl,
  LayersControl,
} from "react-leaflet";

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
  MapCorrection,
} from "../sidebar/components/LeafletHelpers";

function LeafletMap() {
  const { reports, isLoading } = useContext(ReportContext)!;
  const { isNotInNairobi } = useContext(MapContext)!;
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
        <MapCorrection />
        {isNotInNairobi && <DisplayShapefile />}
        {reports.length > 0 && <ReportsContainer reports={reports} />}
      </MapContainer>
    </div>
  );
}

export default LeafletMap;
