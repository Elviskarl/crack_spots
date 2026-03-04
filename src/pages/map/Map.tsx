import { useState } from "react";
import LeafletMap from "./components/leaflet-map/LeafletMap";
import Sidebar from "./components/sidebar/Sidebar";
import "./styles/index.css";
import "./styles/mapMediaQuerry.css";
import { MapContextProvider } from "../../context/provideMapContext";
import { ReportProvider } from "../../context/provideReportContext";

function Map() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <ReportProvider>
      <section className="map-section-container">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="map-container">
          <MapContextProvider>
            <LeafletMap />
          </MapContextProvider>
        </div>
      </section>
    </ReportProvider>
  );
}

export default Map;
