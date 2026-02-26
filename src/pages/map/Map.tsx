import { useContext, useEffect, useRef, useState } from "react";
import LeafletMap from "./components/leaflet-map/LeafletMap";
import Sidebar from "./components/sidebar/Sidebar";
import "./styles/index.css";
import "./styles/mapMediaQuerry.css";
import { MapContext } from "../../context/createMapContext";

function Map() {
  const [collapsed, setCollapsed] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { map } = useContext(MapContext)!;

  useEffect(() => {
    if (!map || !mapContainerRef.current) return;
    let resizeTimeout: NodeJS.Timeout;

    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        map.invalidateSize();
      }, 300);
    });
    observer.observe(mapContainerRef.current);
    
    return () => {
      clearTimeout(resizeTimeout);
      observer.disconnect();
    };
  }, [map]);
  return (
    <>
      <section className="map-section-container">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="map-container" ref={mapContainerRef}>
          <LeafletMap />
        </div>
      </section>
    </>
  );
}

export default Map;
