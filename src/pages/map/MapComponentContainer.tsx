import { useContext, useState } from "react";
import { Notifications } from "./components/sidebar/components/Notifications";
import { ReportContext } from "../../context/createReportContext";
import Sidebar from "./components/sidebar/Sidebar";
import LeafletMap from "./components/leaflet-map/LeafletMap";
import "./styles/mapComponentContainer.css";

export default function MapComponentContainer() {
  const [collapsed, setCollapsed] = useState(false);
  const { notification, setNotification } = useContext(ReportContext)!;
  return (
    <section className="map-section-container">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <>
        <LeafletMap />
      </>
      {notification && (
        <Notifications
          message={notification?.message}
          func={setNotification}
          type={notification.type}
        />
      )}
      {/* <Notifications message="Hello there" type="Info" func={setNotification} /> */}
    </section>
  );
}
