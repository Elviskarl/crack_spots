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
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );
  const { filterValues, setFilterValues } = useReportContext();
  const { data: cachedResults = [], isLoading } = useReports();
  const { nairobiSubCountyShapefile } = useMapContext();
  const filteredReports = useFilteredReports();

  // To resolve a react compiler warning when working with useRef
  const cleanShapeFile = nairobiSubCountyShapefile.current;

  const category = useMemo(() => {
    return new Set(cachedResults.map((report) => report.severity));
  }, [cachedResults]);

  const yearTaken = useMemo(() => {
    return new Set(
      cachedResults.map((report) =>
        new Date(report.dateTaken).getUTCFullYear(),
      ),
    );
  }, [cachedResults]);

  const resolutionStatus = useMemo(() => {
    return new Set(cachedResults.map((report) => report.status));
  }, [cachedResults]);

  const resolutionQuality = useMemo(() => {
    return new Set(
      cachedResults
        .filter((report) => report.status === "resolved")
        .map((report) => report.resolution.quality),
    );
  }, [cachedResults]);

  const streetNames = useMemo(() => {
    return new Set(
      cachedResults
        .map((item) => item.location.address?.road?.toLowerCase())
        .filter(Boolean) as string[],
    );
  }, [cachedResults]);

  // Helper to update one filter field
  const updateFilter = <k extends keyof FilterValues>(
    key: k,
    value: FilterValues[k],
  ) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="filter-report-section">
      <p>This filters reports being displayed on the Map.</p>
      <button
        className="download-container"
        title="download"
        onClick={() => {
          if (isLoading) {
            setNotification({
              type: "Info",
              message:
                "Fetching reports from the server. Please wait a moment.",
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
          }
        }}
      >
        <img src={downloadIcon} alt="Download" />
      </button>
      <form className="filter-report-form">
        <fieldset>
          <legend>Filter by Year</legend>
          <select
            name="date-input"
            id="date-input-input"
            value={filterValues.yearTaken}
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
          <legend>Filter by severity</legend>{" "}
          <select
            name="address-category"
            id="select-input"
            value={filterValues.severity}
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
          <select
            name="location-category"
            id="location-input"
            value={filterValues.location}
            onChange={(e) => {
              const selectedSubCounty = e.target.value;
              updateFilter("location", selectedSubCounty);
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
          <select
            name="street-name"
            id="street-input"
            value={filterValues.streetName}
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
          <select
            name="resolution-category"
            id="resolution-input"
            value={filterValues.reportStatus}
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
          <select
            name="resolution-category"
            id="resolution-quality-input"
            value={filterValues.resolutionQuality}
            onChange={(e) => {
              const selectedCategory = e.target.value as Extract<
                Report,
                { status: "resolved" }
              >["resolution"]["quality"];
              updateFilter("resolutionQuality", selectedCategory);
            }}
            disabled={filterValues.reportStatus !== "resolved"}
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
          title="Reset filter"
          className="reset-btn"
          onClick={() => {
            setFilterValues(defaultFilterValues);
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
