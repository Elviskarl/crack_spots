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
import roadNameIcon from "../../../../assets/distance.png";
import locationNameIcon from "../../../../assets/map.png";
import neighbourhoodNameIcon from "../../../../assets/neighborhood.png";
import calenderIcon from "../../../../assets/calendar.png";
import tagIcon from "../../../../assets/bookmark.png";
import "../../styles/map-container.css";

function LeafletMap() {
  const [reports, setReports] = useState<Report[] | undefined>(undefined);
  useEffect(() => {
    const url = "/api/v1/reports";
    fetchReports(url)
      .then((data) => {
        if (!data) return;
        console.log("Fetched reports:", data[0].dateTaken);
        setReports(data);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
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
              position={[
                location.coordinates[1], // latitude
                location.coordinates[0], // longitude
              ]}
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
                    />
                  </div>
                  <div className="report-info-container">
                    <h4>Report Details</h4>
                    <ul>
                      <li className="report-details">
                        <div className="report-details-icon-container">
                          <img
                            src={roadNameIcon}
                            alt=""
                            className="report-details-icon road-name-icon"
                          />
                        </div>
                        Road Name:
                        <span className="road-name">
                          {report.location.address?.road || "unknown"}
                        </span>
                      </li>
                      <li className="report-details">
                        <div className="report-details-icon-container">
                          <img
                            src={neighbourhoodNameIcon}
                            alt=""
                            className="report-details-icon neighbourhood-name-icon"
                          />
                        </div>
                        Location:
                        <span className="neighbourhood-name">
                          {report.location.address?.neighbourhood || "N/A"}
                        </span>
                      </li>
                      <li className="report-details">
                        <div className="report-details-icon-container">
                          <img
                            src={locationNameIcon}
                            alt=""
                            className="report-details-icon location-name-icon"
                          />
                        </div>
                        County:
                        <span className="location-name">
                          {report.location.address?.state || "N/A"}
                        </span>
                      </li>
                      <li className="report-details">
                        <div className="report-details-icon-container">
                          <img
                            src={calenderIcon}
                            alt=""
                            className="report-details-icon calender-name-icon"
                          />
                        </div>
                        Date Taken:
                        <span className="calender-name">{dateTaken}</span>
                      </li>
                      <li className="report-details">
                        <div className="tag-container">
                          <div className="report-details-icon-container">
                            <img
                              src={tagIcon}
                              alt=""
                              className="report-details-icon tag-name-icon"
                            />
                          </div>
                          <span>Tags</span>
                        </div>
                        <div className="tag-values">
                          <div
                            className={`tag-value-indicator ${severity.toLowerCase()}`}
                          ></div>
                          <small>Severity: {severity}</small>
                        </div>
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
