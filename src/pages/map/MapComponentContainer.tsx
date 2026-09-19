import { useContext, useState } from "react";
import { Notifications } from "./components/sidebar/components/Notifications";
import { ReportContext } from "../../context/createReportContext";
import Sidebar from "./components/sidebar/Sidebar";
import LeafletMap from "./components/leaflet-map/LeafletMap";
import "./styles/mapComponentContainer.css";
import { MapContext } from "../../context/createMapContext";

export default function MapComponentContainer() {
  const [collapsed, setCollapsed] = useState(false);
  const { notification, setNotification } = useContext(ReportContext)!;
  const {
    setIsCorrecting,
    setInitialReportCoordinates,
    initialReportCoordinates,
  } = useContext(MapContext)!;

  function handleClick(/*e: MouseEvent<HTMLButtonElement>*/) {
    setIsCorrecting(false);
    setCollapsed(false);
    setInitialReportCoordinates(null);
  }
  return (
    <section className="map-section-container">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <>
        <LeafletMap />
      </>
      {initialReportCoordinates ? (
        <button className="confirm-correction" onClick={handleClick}>
          confirm
        </button>
      ) : (
        ""
      )}
      {notification && (
        <Notifications
          message={notification?.message}
          func={setNotification}
          type={notification.type}
        />
      )}
    </section>
  );
}
