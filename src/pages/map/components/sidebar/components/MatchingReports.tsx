import { useContext, useMemo, type Dispatch, type SetStateAction } from "react";
import { MapContext } from "../../../../../context/createMapContext";
import type { Report } from "../../../types";
import CreateIssues from "../../../utils/CreateIssues";
import mapImgUrl from "../../../../../assets/location-outline.svg";
import locationImgUrl from "../../../../../assets/map-outline.svg";
import imageCategoryUrl from "../../../../../assets/analytics-outline.svg";
import calenderUrl from "../../../../../assets/calendar-outline.svg";
import leafUrl from "../../../../../assets/leaf-outline.svg";
import checkUrl from "../../../../../assets/check.png";
import approvedImageUrl from "../../../../../assets/approved.png";
import "../../../styles/matching-report.css";
interface MatchingReportprops {
  matchingReport: Report[];
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
  isResolving?: boolean;
  setInterestedReport?: Dispatch<SetStateAction<Report | null>>;
  interestedReport?: Report | null;
  term: string;
}

export default function MatchingReports({
  matchingReport,
  setCollapsed,
  isResolving,
  setInterestedReport,
  interestedReport,
  term,
}: MatchingReportprops) {
  const { setSelectedReport } = useContext(MapContext)!;

  const sortedIssues = useMemo(() => {
    const sourceReport = interestedReport ? [interestedReport] : matchingReport;
    if (!sourceReport) return [];

    const issues = CreateIssues(sourceReport);
    return issues
      .map((issue) => {
        const sortedReports = [...issue.reports].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        return {
          issueId: issue.issueId,
          reports: sortedReports,
        };
      })
      .filter((issue) => {
        if (!isResolving) return true;
        const latestReport = issue.reports[0];
        return latestReport.status !== "resolved";
      });
  }, [interestedReport, matchingReport, isResolving]);

  function flyToReport(param: Report) {
    setSelectedReport(param);
  }

  const matchingIssuesEl = sortedIssues.map((issue) => {
    const report = issue.reports[0];
    return (
      <div className="search-result-card" key={issue.issueId}>
        <div className="search-result-image-container">
          <img
            src={
              report.status === "resolved"
                ? report.resolution?.imageUrl
                : report.cloudinary_url
            }
            alt="Report image"
            className="search-result-image"
          />
        </div>
        <ul className="result-details-list">
          <li className="result-detail-item">
            <div className="result-detail-img-container">
              <img
                src={mapImgUrl}
                alt="Location image"
                className="result-detail-img"
              />
            </div>
            <span>{report.location.address?.road}</span>
          </li>
          <li className="result-detail-item">
            <div className="result-detail-img-container">
              <img
                src={locationImgUrl}
                alt="Location image"
                className="result-detail-img"
              />
            </div>
            <span>{report.location.address?.city}</span>
          </li>
          <li className="result-detail-item">
            <div className="result-detail-img-container">
              <img
                src={imageCategoryUrl}
                alt="Location image"
                className="result-detail-img"
              />
            </div>
            <span className="result-detail-category">
              {report.location.category || "District road"}
            </span>
          </li>
          <li className="result-detail-item">
            <div className="result-detail-img-container">
              <img
                src={calenderUrl}
                alt="Location image"
                className="result-detail-img"
              />
            </div>
            <span className="result-detail-date">
              {
                new Date(report.dateTaken)
                  .toLocaleString("en-KE", {
                    timeZone: "Africa/Nairobi",
                  })
                  .split(",")[0]
              }
            </span>
          </li>
          <li className="result-detail-item">
            <div className="result-detail-img-container">
              <img
                src={leafUrl}
                alt="Location image"
                className="result-detail-img"
              />
            </div>
            <span
              className="result-detail-link"
              onClick={() => {
                if (setCollapsed) {
                  setCollapsed(true);
                  flyToReport(report);
                }
              }}
            >
              View on Map
            </span>
          </li>
        </ul>
        <div className="select-report-container">
          {isResolving && !interestedReport && (
            <button
              className="select-report-btn"
              onClick={() => {
                if (setInterestedReport) {
                  setInterestedReport(report);
                }
              }}
            >
              Select Issue
            </button>
          )}
        </div>
        <div className="interested-report-checkmark">
          {interestedReport?._id === report._id ? (
            <img src={checkUrl} alt="checkMark" title="interested Report" />
          ) : report.status === "resolved" ? (
            <img src={approvedImageUrl} alt="checkMark" title={report.status} />
          ) : null}
        </div>
      </div>
    );
  });
  return (
    <div className="search-results">
      <div className="report-count-container">
        <p className="report-count-paragraph">
          {term}{" "}
          <span className="report-count-span">
            ({sortedIssues.length}{" "}
            {sortedIssues.length === 1 ? "result" : "results"})
          </span>{" "}
        </p>
      </div>
      {matchingIssuesEl}
    </div>
  );
}
