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
import useCreateIssues from "../../utils/CreateIssues";

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
  const issues = useCreateIssues(reports);
  const sortedIssues = useMemo(() => {
    return issues.map((issue) => ({
      ...issue,
      reports: [...issue.reports].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    }));
  }, [issues]);

  return (
    <MarkerClusterGroup>
      {sortedIssues.map((issue) => {
        const { issueId, reports } = issue;

        const latestReport = reports[0];
        const resolution = latestReport.resolution;

        const isResolved = latestReport.status === "resolved" && !!resolution;

        const structuredReports = isResolved
          ? [
              {
                imageUrl: resolution.imageUrl,
                dateTaken: resolution.dateTaken,
                location: latestReport.location,
                status: latestReport.status,
                severity: latestReport.severity,
                type: "After",
              },
              ...reports.map((report) => ({
                imageUrl: report.cloudinary_url,
                dateTaken: report.dateTaken,
                location: report.location,
                status: report.status,
                severity: report.severity,
                type: "Before",
              })),
            ]
          : reports.map((report) => ({
              imageUrl: report.cloudinary_url,
              dateTaken: report.dateTaken,
              severity: report.severity,
              location: report.location,
              status: report.status,
              type: "Before",
            }));

        const currentIndex = activeIndexes[issueId] ?? 0;

        const isFirst = currentIndex === 0;
        const isLast = currentIndex === structuredReports.length - 1;
        const currentItem = structuredReports[currentIndex];
        const { location, dateTaken, status, severity } = currentItem;

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
                    src={currentItem.imageUrl}
                    alt="Road Damage"
                    className="preview-image"
                  />
                  <button
                    className={`${structuredReports.length > 1 ? `change-report-btn previous-report` : `change-report-container-single`}`}
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
                    className={`${structuredReports.length > 1 ? `change-report-btn next-report` : `change-report-container-single`}`}
                    aria-label="next report"
                    disabled={isLast}
                    onClick={() =>
                      handleNextReports(issueId, structuredReports.length)
                    }
                  >
                    <img
                      src={changeReportIcon}
                      alt="Road Damage"
                      className="preview-image"
                    />
                  </button>
                  {latestReport.status === "resolved" && (
                    <div className="resolved-report-badge">
                      <p className="issue-status">
                        {currentItem.type === "After" ? "After" : "Before"}
                      </p>
                    </div>
                  )}
                  <p className="progress-indicator">
                    {currentIndex + 1} of {structuredReports.length}
                  </p>
                </div>
                <div className="report-info-container">
                  <h4>
                    Report Details
                    <br />
                    <span className={`report-status ${status}`}></span>
                    <span className={`report-status-value ${status}`}>
                      {status}
                    </span>
                  </h4>
                  <ul>
                    <li className="report-details">
                      <div className="report-details-icon-container"
                       title="Road Name">
                        <img
                          src={roadNameIcon}
                          alt="road Name"
                          className="report-details-icon road-name-icon"
                        />
                      </div>:
                      <span className="road-name">
                        {latestReport.location.address?.road}
                      </span>
                    </li>
                    <li className="report-details">
                      <div className="report-details-icon-container"
                       title="Location">
                        <img
                          src={neighbourhoodNameIcon}
                          alt="neighbourhood Name"
                          className="report-details-icon neighbourhood-name-icon"
                        />
                      </div>:
                      <span className="neighbourhood-name">
                        {latestReport.location.address?.neighbourhood || "N/A"}
                      </span>
                    </li>
                    <li className="report-details">
                      <div className="report-details-icon-container"
                       title="County">
                        <img
                          src={locationNameIcon}
                          alt="location Name"
                          className="report-details-icon location-name-icon"
                        />
                      </div>:
                      <span className="location-name">
                        {latestReport.location.address?.state || "N/A"}
                      </span>
                    </li>
                    <li className="report-details">
                      <div className="report-details-icon-container"
                       title="Date Taken"
                      >
                        <img
                          src={calenderIcon}
                          alt="Date Taken"
                          className="report-details-icon calender-name-icon"
                        />
                      </div>:
                      <span className="calender-name">
                        {new Date(dateTaken)
                          .toLocaleString("en-KE", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                          .split(",")
                          .slice(0, 2)
                          .join(", ")}
                      </span>
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
