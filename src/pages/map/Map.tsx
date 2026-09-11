import "./styles/index.css";
import "./styles/mapMediaQuerry.css";
import { MapContextProvider } from "../../context/provideMapContext";
import { ReportProvider } from "../../context/provideReportContext";
import MapComponentContainer from "./MapComponentContainer";

function Map() {
  return (
    <ReportProvider>
      <MapContextProvider>
        <MapComponentContainer />
      </MapContextProvider>
    </ReportProvider>
  );
}

export default Map;
