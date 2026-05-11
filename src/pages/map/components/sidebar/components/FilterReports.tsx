import { booleanPointInPolygon, point } from "@turf/turf";
import { useContext, useEffect, useMemo, useState } from "react";
import { ReportContext } from "../../../../../context/createReportContext";
import { MapContext } from "../../../../../context/createMapContext";
import "../../../styles/filterReports.css";
import type { Report } from "../../../types";

interface FilterValues {
  yearTaken: number | "";
  severity: "" | Report["severity"];
  resolutionStatus: "" | Report["status"];
  resolutionQuality: "" | NonNullable<Report["resolution"]>["quality"];
  location: string;
}
const defaultFilterValues: FilterValues = {
  yearTaken: "",
  location: "",
  resolutionQuality: "",
  resolutionStatus: "",
  severity: "",
};

export default function FilterReports() {
  const [filters, setFilters] = useState<FilterValues>(defaultFilterValues);
  const { setReports, originalReports } = useContext(ReportContext)!;
  const { nairobiSubCountyShapefile } = useContext(MapContext)!;

  // To resolvIe a react compiler warning when working with useRef
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
        .filter(
          (
            report,
          ): report is Report & {
            resolution: NonNullable<Report["resolution"]>;
          } => report.status === "resolved" && !!report.resolution,
        )
        .map((report) => report.resolution.quality),
    );
  }, [cleanReports]);

  /*function getSubCounty(subcounty: string) {
    const feature = nairobiSubCountyShapefile.current?.features.find(
      (feature) => feature.properties?.subcounty === subcounty,
    );
    if (!feature) return;
    const filteredReports = originalReports.current.filter((report) => {
      const reportPoint = point([
        report.location.coordinates[0],
        report.location.coordinates[1],
      ]);
      return booleanPointInPolygon(reportPoint, feature);
    });
    setReports(filteredReports);
  }*/

  const filterTheReports = useMemo(() => {
    return cleanReports.filter((report) => {
      if (filters.yearTaken) {
        const date = new Date(report.dateTaken);
        if (isNaN(date.getTime())) return false;
        if (date.getUTCFullYear() !== filters.yearTaken) return false;
      }
      if (filters.severity && report.severity !== filters.severity)
        return false;
      if (
        filters.resolutionStatus &&
        report.status !== filters.resolutionStatus
      )
        return false;
      if (
        filters.resolutionQuality &&
        report.resolution?.quality !== filters.resolutionQuality
      )
        return false;
      if (filters.location) {
        const feature = cleanShapeFile?.features.find(
          (f) => f.properties?.subcounty === filters.location,
        );
        if (!feature) return false;
        const reportPoint = point([
          report.location.coordinates[0],
          report.location.coordinates[1],
        ]);
        if (!booleanPointInPolygon(reportPoint, feature)) return false;
      }
      return true;
    });
  }, [filters, cleanReports, cleanShapeFile]);

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

  return (
    <div className="filter-report-section">
      <p>This filters reports being displayed on the Map.</p>
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
          <legend>Filter by resolution status</legend>
          <label htmlFor="select-input"></label>
          <select
            name="resolution-category"
            id="resolution-input"
            value={filters.resolutionStatus}
            onChange={(e) => {
              const selectedCategory = e.target.value as Report["status"];
              updateFilter("resolutionStatus", selectedCategory);
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
              const selectedCategory = e.target.value as Exclude<
                Report["resolution"],
                undefined
              >["quality"];
              updateFilter("resolutionQuality", selectedCategory);
            }}
            disabled={
              filters.resolutionStatus === "open" ||
              filters.resolutionStatus === ""
            }
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
    </div>
  );
}
