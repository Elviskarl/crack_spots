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
import "../../../styles/matching-report.css";
interface MatchingReportprops {
  matchingReport: Report[];
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
  isResolving?: boolean;
  setInterestedReport?: Dispatch<SetStateAction<Report | null>>;
  interestedReport?: Report | null;
}

export default function MatchingReports({
  matchingReport,
  setCollapsed,
  isResolving,
  setInterestedReport,
  interestedReport,
}: MatchingReportprops) {
  const { setSelectedReport } = useContext(MapContext)!;

  const sortedIssues = useMemo(() => {
    const sourceReport = interestedReport ? [interestedReport] : matchingReport;
    const issues = CreateIssues(sourceReport);
    return issues.map((issue) => ({
      issueId: issue.issueId,
      reports: [...issue.reports].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    }));
  }, [interestedReport, matchingReport]);

  function flyToReport(param: Report) {
    setSelectedReport(param);
  }

  const matchingIssuesEl = sortedIssues.map((issue) => {
    const report = issue.reports[0];
    return (
      <div className="search-result-card" key={issue.issueId}>
        <div className="search-result-image-container">
          <img
            src={report.cloudinary_url}
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
        {isResolving ? (
          <>
            <div className="select-report-container">
              {!interestedReport && (
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
            {interestedReport?._id === report._id && (
              <div className="interested-report-checkmark">
                <img src={checkUrl} alt="checkMark" />
              </div>
            )}
          </>
        ) : null}
      </div>
    );
  });
  return (
    <div className="search-results">
      <div className="report-count-container">
        {sortedIssues.length === 1 ? (
          <p className="report-count-paragraph">
            Found{" "}
            <span className="report-count-span">{sortedIssues.length} </span>{" "}
            issue.
          </p>
        ) : (
          <p className="report-count-paragraph">
            Found{" "}
            <span className="report-count-span">{sortedIssues.length} </span>{" "}
            issues matching your search criteria.
          </p>
        )}
      </div>
      {matchingIssuesEl}
    </div>
  );
}
