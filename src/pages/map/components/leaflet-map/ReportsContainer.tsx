import { useContext, useMemo, useState } from "react";
import { Icon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { Report } from "../../types";
import roadNameIcon from "../../../../assets/distance.png";
import locationNameIcon from "../../../../assets/map.png";
import neighbourhoodNameIcon from "../../../../assets/neighborhood.png";
import calenderIcon from "../../../../assets/calendar.png";
import tagIcon from "../../../../assets/bookmark.png";
import changeReportIcon from "../../../../assets/up_arrow.png";
// Import the required CSS for marker clustering
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import { MapContext } from "../../../../context/createMapContext";

export function ReportsContainer({ reports }: { reports: Report[] }) {
  const { markerRefs } = useContext(MapContext)!;
  const [activeIndexes, setActiveIndexes] = useState<Record<string, number>>(
    {},
  );

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4904/4904150.png",
    iconSize: [40, 40],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  const issues = useMemo(() => {
    const grouped = Object.groupBy(reports, (report) => report.issueId);

    return Object.entries(grouped).map(([issueId, reports]) => ({
      issueId,
      reports: reports ?? [],
    }));
  }, [reports]);

  return (
    <MarkerClusterGroup>
      {issues.map((issue, index) => {
        const { issueId, reports } = issue;

        const currentIndex = activeIndexes[issueId] ?? 0;
        const currentReport = reports[currentIndex];
        const isFirst = currentIndex === 0;
        const isLast = currentIndex === reports.length - 1;
        const { cloudinary_url, severity, location, dateTaken } = currentReport;

        function handleNextReports(issueId: string, length: number) {
          setActiveIndexes((prev) => {
            const current = prev[issueId] ?? 0;

            if (current >= length - 1) return prev; // stop at end

            return {
              ...prev,
              [issueId]: current + 1,
            };
          });
        }

        function handlePreviousReports(issueId: string) {
          setActiveIndexes((prev) => {
            const current = prev[issueId] ?? 0;

            if (current <= 0) return prev; // stop at start

            return {
              ...prev,
              [issueId]: current - 1,
            };
          });
        }
        return (
          <Marker
            key={issueId}
            position={[
              location.coordinates[1], // latitude
              location.coordinates[0], // longitude
            ]}
            title="Report Location"
            icon={customIcon}
            ref={(ref) => {
              if (ref) {
                markerRefs.current[issueId] = ref;
              }
            }}
          >
            <Popup>
              <div className="report-details-container">
                <div className="image-report-preview-container">
                  <img
                    src={cloudinary_url}
                    alt="Road Damage"
                    className="preview-image"
                  />
                  <button
                    className={`${reports.length > 1 ? `change-report-btn previous-report` : `change-report-container-single`}`}
                    aria-label="previous report"
                    disabled={isFirst}
                    onClick={() => handlePreviousReports(issueId)}
                  >
                    <img
                      src={changeReportIcon}
                      alt="Road Damage"
                      className="preview-image"
                    />
                  </button>
                  <button
                    className={`${reports.length > 1 ? `change-report-btn next-report` : `change-report-container-single`}`}
                    aria-label="next report"
                    disabled={isLast}
                    onClick={() => handleNextReports(issueId, reports.length)}
                  >
                    <img
                      src={changeReportIcon}
                      alt="Road Damage"
                      className="preview-image"
                    />
                  </button>
                </div>
                <div className="report-info-container">
                  <h4>
                    Report Details <br />
                    issue: {index + 1}
                  </h4>
                  <ul>
                    <li className="report-details">
                      <div className="report-details-icon-container">
                        <img
                          src={roadNameIcon}
                          alt="road Name"
                          className="report-details-icon road-name-icon"
                        />
                      </div>
                      Road Name:
                      <span className="road-name">
                        {currentReport.location.address?.road}
                      </span>
                    </li>
                    <li className="report-details">
                      <div className="report-details-icon-container">
                        <img
                          src={neighbourhoodNameIcon}
                          alt="neighbourhood Name"
                          className="report-details-icon neighbourhood-name-icon"
                        />
                      </div>
                      Location:
                      <span className="neighbourhood-name">
                        {currentReport.location.address?.neighbourhood || "N/A"}
                      </span>
                    </li>
                    <li className="report-details">
                      <div className="report-details-icon-container">
                        <img
                          src={locationNameIcon}
                          alt="location Name"
                          className="report-details-icon location-name-icon"
                        />
                      </div>
                      County:
                      <span className="location-name">
                        {currentReport.location.address?.state || "N/A"}
                      </span>
                    </li>
                    <li className="report-details">
                      <div className="report-details-icon-container">
                        <img
                          src={calenderIcon}
                          alt="Date Taken"
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
                            alt="Tag icon"
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
    </MarkerClusterGroup>
  );
}
