import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { fetchReports } from "../../utils/fetchReports";
import type { Report } from "../../types/index";
import { Icon } from "leaflet";
import "../../styles/map-container.css";

function LeafletMap() {
  const [reports, setReports] = useState<Report[] | undefined>(undefined);
  useEffect(() => {
    const url = "/api/v1/reports";
    fetchReports(url).then((data) => {
      if (!data) return;
      setReports(data);
    });
  }, []);

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4904/4904150.png",
    iconSize: [40, 40],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  return (
    <MapContainer
      center={[-1.286389, 36.817223]}
      zoom={13}
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

      {reports &&
        reports.map((report) => {
          const { _id, cloudinary_url, severity, location, dateTaken } = report;
          return (
            <Marker
              key={_id}
              position={location.coordinates}
              title="Report Location"
              icon={customIcon}
            >
              <Popup>
                <div className="report-details-container">
                  <div className="image-report-preview-container">
                    <img
                      src={cloudinary_url}
                      alt="Road Damage"
                      className="preview-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="report-info-container">
                    <ul>
                      <li className="report-severity">
                        <span>Severity:</span>
                        <span>{severity}</span>
                      </li>
                      <li className="report-timestamp">
                        <span>Date Taken:</span>
                        <span>{dateTaken}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}

export default LeafletMap;
