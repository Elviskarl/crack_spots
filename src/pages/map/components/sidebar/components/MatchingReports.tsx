import type { Report } from "../../../types";
import "../../../styles/matching-report.css";
import mapImgUrl from "../../../../../assets/location-outline.svg";
import locationImgUrl from "../../../../../assets/map-outline.svg";
import imageCategoryUrl from "../../../../../assets/analytics-outline.svg";
import calenderUrl from "../../../../../assets/calendar-outline.svg";
import leafUrl from "../../../../../assets/leaf-outline.svg";
import { useContext } from "react";
import { MapContext } from "../../../../../context/createMapContext";
interface MatchingReportprops {
  matchingReport: Report[];
}

export default function MatchingReports({
  matchingReport,
}: MatchingReportprops) {
  const { setSelectedReport } = useContext(MapContext)!;

  function flyToReport(param: Report) {
    setSelectedReport(param);
  }

  const matchingReportEl = matchingReport.map((report) => (
    <div className="search-result-card" key={report._id}>
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
            {new Intl.DateTimeFormat("en-GB").format(
              new Date(report.dateTaken),
            )}
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
            onClick={() => flyToReport(report)}
          >
            View on Map
          </span>
        </li>
      </ul>
    </div>
  ));
  return (
    <div className="search-results">
      <div className="report-count-container">
        {matchingReport.length === 1 ? (
          <p className="report-count-paragraph">
            Found{" "}
            <span className="report-count-span">{matchingReport.length} </span>{" "}
            report.
          </p>
        ) : (
          <p className="report-count-paragraph">
            Found{" "}
            <span className="report-count-span">{matchingReport.length} </span>{" "}
            reports matching your search criteria.
          </p>
        )}
      </div>
      {matchingReportEl}
    </div>
  );
}
