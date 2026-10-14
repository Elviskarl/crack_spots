import { useMemo, useState } from "react";
// styles
import "../../../styles/filterReports.css";
// types
import type { NotificationType, Report, FilterValues } from "../../../types";
// assets
import downloadIcon from "../../../../../assets/download-outline.svg";
// Helper Fn
import handleDownload from "../../../utils/handleDownLoad";
// components
import { Notifications } from "./Notifications";
// context
import useMapContext from "../../../hooks/getMapContext";
import useReportContext from "../../../hooks/getReportsContext";
// hooks
import useReports from "../../../hooks/useReports";
import useFilteredReports from "../../../hooks/filteredReports";
// data
import { defaultFilterValues } from "../../../data";

export default function FilterReports() {
  const [filters, setFilters] = useState<FilterValues>(defaultFilterValues);
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );
  const { setReports, originalReports, isLoading } = useReportContext();
  const { nairobiSubCountyShapefile } = useMapContext();

  // To resolve a react compiler warning when working with useRef
  const cleanReports = originalReports.current;
  const cleanShapeFile = nairobiSubCountyShapefile.current;

  const category = useMemo(() => {
    return new Set(cleanReports.map((report) => report.severity));
  }, [cleanReports]);

  const yearTaken = useMemo(() => {
    return new Set(
      cleanReports.map((report) => new Date(report.dateTaken).getUTCFullYear()),
    );
  }, [cleanReports]);

  const resolutionStatus = useMemo(() => {
    return new Set(cleanReports.map((report) => report.status));
  }, [cleanReports]);

  const resolutionQuality = useMemo(() => {
    return new Set(
      cleanReports
        .filter((report) => report.status === "resolved")
        .map((report) => report.resolution.quality),
    );
  }, [cleanReports]);

  const streetNames = useMemo(() => {
    return new Set(
      cleanReports
        .map((item) => item.location.address?.road?.toLowerCase())
        .filter(Boolean) as string[],
    );
  }, [cachedResults]);

  // Helper to update one filter field
  const updateFilter = <k extends keyof FilterValues>(
    key: k,
    value: FilterValues[k],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setReports(filterTheReports);
  }, [setReports, filterTheReports]);

  function handleDownload() {
    if (isLoading) {
      setNotification({
        type: "Info",
        message: "Fetching reports from the server. Please wait a moment.",
      });
      return;
    }
          try {
            handleDownload(filteredReports, cachedResults);
    } catch (error) {
      if (error instanceof Error) {
        setNotification({
          type: "Error",
          message: error.message,
        });
      }
      console.error(error);
    } finally {
      setTimeout(() => {
        URL.revokeObjectURL(anchorElement.href);
      }, 1000);
      anchorElement.remove();
    }
  }

  return (
    <div className="filter-report-section">
      <p>This filters reports being displayed on the Map.</p>
      <button
        className="download-container"
        title="download"
        onClick={handleDownload}
      >
        <img src={downloadIcon} alt="Download" />
      </button>
      <form className="filter-report-form">
        <fieldset>
          <legend>Filter by Year</legend>
          {/* <label htmlFor="date-input">From: </label>
          <input type="date" name="date" id="date-input" className="date-input"/> */}
          <select
            name="date-input"
            id="date-input-input"
            value={filters.yearTaken}
            onChange={(e) => {
              const selectedYear = e.target.value;
              updateFilter(
                "yearTaken",
                selectedYear === "" ? "" : Number(selectedYear),
              );
            }}
          >
            <option value="">--Please choose an option--</option>
            {Array.from(yearTaken).map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset>
          <legend>Filter by severity</legend>
          <label htmlFor="select-input"></label>
          <select
            name="address-category"
            id="select-input"
            value={filters.severity}
            onChange={(e) => {
              const selectedCategory = e.target.value as Report["severity"];
              updateFilter("severity", selectedCategory);
            }}
          >
            <option value="">--Please choose an option--</option>
            {Array.from(category).map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset>
          <legend>Filter by location</legend>
          <label htmlFor="location-input"></label>
          <select
            name="location-category"
            id="location-input"
            value={filters.location}
            onChange={(e) => {
              const selectedSubCounty = e.target.value;
              updateFilter("location", selectedSubCounty);
              // getSubCounty(selectedSubCounty);
            }}
          >
            <option value="">--Please choose an option--</option>
            {cleanShapeFile?.features.map((feature, index) => (
              <option key={index} value={feature.properties?.subcounty}>
                {feature.properties?.subcounty.replace(
                  /\s*Sub\s+County\s*/i,
                  "",
                )}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset>
          <legend>Filter by street name</legend>
          <label htmlFor="street-input"></label>
          <select
            name="street-name"
            id="street-input"
            value={filters.streetName}
            onChange={(e) => {
              const selectedStreet = e.target.value;
              updateFilter("streetName", selectedStreet);
            }}
          >
            <option value="">--Please choose an option--</option>
            {Array.from(streetNames).map((street, index) => (
              <option key={index} value={street}>
                {street}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset>
          <legend>Filter by resolution status</legend>
          <label htmlFor="select-input"></label>
          <select
            name="resolution-category"
            id="resolution-input"
            value={filters.reportStatus}
            onChange={(e) => {
              const selectedCategory = e.target.value as Report["status"];
              updateFilter("reportStatus", selectedCategory);
              if (selectedCategory !== "resolved") {
                updateFilter("resolutionQuality", "");
              }
            }}
          >
            <option value="">--Please choose an option--</option>
            {Array.from(resolutionStatus).map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset>
          <legend>Filter by resolution Quality</legend>
          <label htmlFor="select-input"></label>
          <select
            name="resolution-category"
            id="resolution-quality-input"
            value={filters.resolutionQuality}
            onChange={(e) => {
              const selectedCategory = e.target.value as Extract<
                Report,
                { status: "resolved" }
              >["resolution"]["quality"];
              updateFilter("resolutionQuality", selectedCategory);
            }}
            disabled={filters.reportStatus !== "resolved"}
          >
            <option value="">--Please choose an option--</option>
            {Array.from(resolutionQuality).map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </fieldset>
        <button
          type="reset"
          title="Reset filters"
          className="reset-btn"
          onClick={() => {
            setFilters(defaultFilterValues);
          }}
        >
          Reset
        </button>
      </form>
      {notification && (
        <Notifications
          message={notification.message}
          type={notification.type}
          func={setNotification}
        />
      )}
    </div>
  );
}
