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

function LeafletMap() {
  const report = useContext(ReportContext);
  console.log(report);

  return (
    <MapContainer
      center={[-1.216013888888889, 36.90145277777778]}
      zoom={14}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <ZoomControl position="topright" />
      <LayersControl position="topleft">
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
      {report && report.length > 0 && <ReportsContainer reports={report} />}
    </MapContainer>
  );
}

export default LeafletMap;
