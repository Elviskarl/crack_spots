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
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import { MapContext } from "../../../../context/createMapContext";
import useCreateIssues from "../../utils/CreateIssues";
import useLocationCluster from "../../hooks/locationCluster";

const resolvedIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/13984/13984191.png",
  iconSize: [40, 40],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const unResolvedIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/4904/4904150.png",
  iconSize: [40, 40],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

type StructuredReport = {
  imageUrl: string;
  dateTaken: string;
  location: Report["location"];
  status: Report["status"];
  severity: Report["severity"];
  type: "Before" | "After";
  issueId: string;
};

export function ReportsContainer({ reports }: { reports: Report[] }) {
  const { markerRefs } = useContext(MapContext)!;
  const [activeIndexes, setActiveIndexes] = useState<Record<string, number>>(
    {},
  );

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
  // Location based groups
  const locationGroups = useLocationCluster(sortedIssues);

  function handleNextReports(groupId: string, length: number) {
    setActiveIndexes((prev) => {
      const current = prev[groupId] ?? 0;

      if (current >= length - 1) return prev;

      return {
        ...prev,
        [groupId]: current + 1,
      };
    });
  }

  function handlePreviousReports(groupId: string) {
    setActiveIndexes((prev) => {
      const current = prev[groupId] ?? 0;

      if (current <= 0) return prev;

      return {
        ...prev,
        [groupId]: current - 1,
      };
    });
  }

  return (
    <MarkerClusterGroup key={reports.map((report) => report._id).join("-")}>
      {locationGroups.map((group) => {
        // Use latest issue in group for marker position

        //Get issue Location status
        const hasOpenIssue = group.issues.some(
          (issue) => issue.reports[0].status === "open",
        );

        //Flatten all issues into one location history
        const structuredReports: StructuredReport[] = group.issues.flatMap(
          (issue) => {
            const latestReport = issue.reports[0];
            const resolution = latestReport.resolution;

            const isResolved =
              latestReport.status === "resolved" && !!resolution;

            return isResolved
              ? [
                  {
                    imageUrl: resolution.imageUrl,
                    dateTaken: resolution.dateTaken,
                    location: latestReport.location,
                    status: latestReport.status,
                    severity: latestReport.severity,
                    type: "After",
                    issueId: issue.issueId,
                  },
                  ...issue.reports.map((report) => ({
                    imageUrl: report.cloudinary_url,
                    dateTaken: report.dateTaken,
                    location: report.location,
                    status: report.status,
                    severity: report.severity,
                    type: "Before" as const,
                    issueId: issue.issueId,
                  })),
                ]
              : issue.reports.map((report) => ({
                  imageUrl: report.cloudinary_url,
                  dateTaken: report.dateTaken,
                  location: report.location,
                  status: report.status,
                  severity: report.severity,
                  type: "Before" as const,
                  issueId: issue.issueId,
                }));
          },
        );

        const currentIndex = activeIndexes[group.id] ?? 0;

        const currentItem = structuredReports[currentIndex];

        const isFirst = currentIndex === 0;
        const isLast = currentIndex === structuredReports.length - 1;

        const { location, dateTaken, status, severity } = currentItem;

        return (
          <Marker
            key={group.id}
            position={[
              currentItem.location.coordinates[1],
              currentItem.location.coordinates[0],
            ]}
            title="Report Location"
            icon={hasOpenIssue ? unResolvedIcon : resolvedIcon}
            ref={(ref) => {
              if (ref) {
                markerRefs.current[group.id] = ref;
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
                    className={`${
                      structuredReports.length > 1
                        ? "change-report-btn previous-report"
                        : "change-report-container-single"
                    }`}
                    aria-label="previous report"
                    disabled={isFirst}
                    onClick={() => handlePreviousReports(group.id)}
                  >
                    <img
                      src={changeReportIcon}
                      alt="Previous"
                      className="preview-image"
                    />
                  </button>
                  <button
                    className={`${
                      structuredReports.length > 1
                        ? "change-report-btn next-report"
                        : "change-report-container-single"
                    }`}
                    aria-label="next report"
                    disabled={isLast}
                    onClick={() =>
                      handleNextReports(group.id, structuredReports.length)
                    }
                  >
                    <img
                      src={changeReportIcon}
                      alt="Next"
                      className="preview-image"
                    />
                  </button>
                  {currentItem.status === "resolved" && (
                    <div className="resolved-report-badge">
                      <p className="issue-status">{currentItem.type}</p>
                    </div>
                  )}
                  <p className="progress-indicator">
                    {currentIndex + 1} of {structuredReports.length}
                  </p>
                </div>
                <div className="report-info-container">
                  <h4>
                    Location History
                    <br />
                    <span className={`report-status ${status}`}></span>
                    <span className={`report-status-value ${status}`}>
                      {status}
                    </span>
                  </h4>
                  <ul>
                    <li className="report-details">
                      <div
                        className="report-details-icon-container"
                        title="Road Name"
                      >
                        <img
                          src={roadNameIcon}
                          alt="road Name"
                          className="report-details-icon road-name-icon"
                        />
                      </div>
                      :
                      <span className="road-name">
                        {location.address?.road}
                      </span>
                    </li>
                    <li className="report-details">
                      <div
                        className="report-details-icon-container"
                        title="Location"
                      >
                        <img
                          src={neighbourhoodNameIcon}
                          alt="Neighbourhood"
                          className="report-details-icon neighbourhood-name-icon"
                        />
                      </div>
                      :
                      <span className="neighbourhood-name">
                        {location.address?.neighbourhood || "N/A"}
                      </span>
                    </li>
                    <li className="report-details">
                      <div
                        className="report-details-icon-container"
                        title="County"
                      >
                        <img
                          src={locationNameIcon}
                          alt="County"
                          className="report-details-icon location-name-icon"
                        />
                      </div>
                      :
                      <span className="location-name">
                        {location.address?.state || "N/A"}
                      </span>
                    </li>
                    <li className="report-details">
                      <div
                        className="report-details-icon-container"
                        title="Date Taken"
                      >
                        <img
                          src={calenderIcon}
                          alt="Date Taken"
                          className="report-details-icon calender-name-icon"
                        />
                      </div>
                      :
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
