import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ReportProvider } from "./context/provideReportContext.tsx";
import { MapContextProvider } from "./context/provideMapContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReportProvider>
      <MapContextProvider>
        <App />
      </MapContextProvider>
    </ReportProvider>
  </StrictMode>,
);
