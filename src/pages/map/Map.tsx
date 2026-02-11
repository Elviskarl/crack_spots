import LeafletMap from "./components/leaflet-map/LeafletMap";
import Sidebar from "./components/sidebar/Sidebar";
import "./styles/index.css";
import "./styles/mapMediaQuerry.css";

function Map() {
  return (
    <>
      <section className="map-section-container">
        <Sidebar />
        <div className="map-container">
          <LeafletMap />
        </div>
      </section>
    </>
  );
}

export default Map;
