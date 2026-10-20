import "./styles/index.css";
import "./styles/mapMediaQuerry.css";
import { MapContextProvider } from "../../context/provideMapContext";
import { ReportProvider } from "../../context/provideReportContext";
import MapComponentContainer from "./MapComponentContainer";
import QueryNotificationBridge from "../../provider/QueryNotificationBridge";

function Map() {
  return (
    <ReportProvider>
      <MapContextProvider>
        <QueryNotificationBridge />
        <MapComponentContainer />
      </MapContextProvider>
    </ReportProvider>
  );
}

export default Map;
