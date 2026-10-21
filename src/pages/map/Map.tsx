import "./styles/index.css";
import "./styles/mapMediaQuerry.css";
import { MapContextProvider } from "../../context/provideMapContext";
import { ReportProvider } from "../../context/provideReportContext";
import MapComponentContainer from "./MapComponentContainer";
import QueryNotificationBridge from "../../provider/QueryNotificationBridge";
import { useEffect } from "react";

function Map() {
  useEffect(() => {
    function preventDefault(e: DragEvent) {
      e.preventDefault();
    }

    document.addEventListener("dragover", preventDefault);
    document.addEventListener("drop", preventDefault);

    return () => {
      document.removeEventListener("dragover", preventDefault);
      document.removeEventListener("drop", preventDefault);
    };
  }, []);
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
