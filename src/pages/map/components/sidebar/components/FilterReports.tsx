import { booleanPointInPolygon, point } from "@turf/turf";
import { useContext, useEffect, useMemo, useState } from "react";
import { ReportContext } from "../../../../../context/createReportContext";
import { MapContext } from "../../../../../context/createMapContext";
import "../../../styles/filterReports.css";
import type { downloadKeys, Report } from "../../../types";
import downloadIcon from "../../../../../assets/download-outline.svg";
import { createRowData } from "../../../utils/utils";

type ResolutionQuality = Extract<
  Report,
  { status: "resolved" }
>["resolution"]["quality"];
interface FilterValues {
  yearTaken: number | "";
  severity: "" | Report["severity"];
  reportStatus: "" | Report["status"];
  resolutionQuality: "" | ResolutionQuality;
  location: string;
  streetName: string;
}
const defaultFilterValues: FilterValues = {
  yearTaken: "",
  location: "",
  resolutionQuality: "",
  reportStatus: "",
  severity: "",
  streetName: "",
};

export default function FilterReports() {
  const [filters, setFilters] = useState<FilterValues>(defaultFilterValues);
  const [download, setDownload] = useState(false);
  const { setReports, originalReports } = useContext(ReportContext)!;
  const { nairobiSubCountyShapefile } = useContext(MapContext)!;

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
      if (filters.yearTaken && Number.isInteger(filters.yearTaken)) {
        const date = new Date(report.dateTaken);
        if (isNaN(date.getTime())) return false;
        if (date.getUTCFullYear() !== filters.yearTaken) return false;
      }
      if (filters.severity && report.severity !== filters.severity)
        return false;
      if (filters.reportStatus && report.status !== filters.reportStatus)
        return false;
      if (
        report.status === "resolved" &&
        filters.resolutionQuality &&
        report.resolution.quality !== filters.resolutionQuality
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
      if (filters.streetName) {
        const road = report.location.address?.road?.toLowerCase();
        if (!road) return false;
        if (!road.includes(filters.streetName.toLowerCase())) return false;
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

  useEffect(() => {
    if (!download) return;

    const anchorElement = document.createElement("a");
    function handleDownload() {
      try {
        if (!filterTheReports.length) return;

        anchorElement.classList.add("download-link");
        anchorElement.hidden = true;

        const uniqueKeys = new Set<keyof downloadKeys>();

        const resolvedReport = cleanReports.find(
          (report) => report.status === "resolved",
        );

        if (!resolvedReport) {
          console.error("Missing resolved report");
          return;
        }

        const reportKeyMap: Partial<Record<keyof Report, keyof downloadKeys>> =
          {
            _id: "_id",
            user: "user",
            severity: "severity",
            issueId: "issueId",
            dateTaken: "dateTaken",
            createdAt: "createdAt",
            status: "status",
            cloudinary_url: "report_image_URL",
          };

        [resolvedReport].map((report) =>
          Object.keys(report).forEach((key) => {
            if (key === "location") {
              uniqueKeys.add("type");
              if (
                "coordinates" in report.location &&
                Array.isArray(report.location.coordinates)
              ) {
                uniqueKeys.add("longitude");
                uniqueKeys.add("latitude");
              }
              if ("address" in report.location) {
                uniqueKeys.add("road");
                uniqueKeys.add("neighbourhood");
                uniqueKeys.add("state");
              }
            } else if (key === "cloudinary_url") {
              uniqueKeys.add("report_image_URL");
            } else if (key === "resolution") {
              uniqueKeys.add("resolution_quality" as keyof downloadKeys);
              uniqueKeys.add("resolution_date" as keyof downloadKeys);
              if (
                "coordinates" in report.resolution &&
                Array.isArray(report.resolution.coordinates)
              ) {
                uniqueKeys.add("resolution_longitude" as keyof downloadKeys);
                uniqueKeys.add("resolution_latitude" as keyof downloadKeys);
              }
              uniqueKeys.add("resolution_image_URL" as keyof downloadKeys);
              uniqueKeys.add("resolution_note" as keyof downloadKeys);
            } else {
              const mappedKey = reportKeyMap[key as keyof Report];

              if (mappedKey) {
                uniqueKeys.add(mappedKey);
              }
            }
          }),
        );
        const values = [];
        values.unshift(Array.from(uniqueKeys));

        filterTheReports.forEach((report) => {
          if (report.status === "resolved") {
            const { issueId } = report;

            const similarReportIssue = cleanReports.filter(
              (report) => report.issueId === issueId,
            );
            if (!similarReportIssue.length) return;
            similarReportIssue.forEach((report) => {
              const row = createRowData(report);
              values.push(Object.values(row));
              return;
            });
            return;
          } else {
            const row = createRowData(report);
            row.resolution_quality = null;
            row.resolution_date = null;
            row.resolution_longitude = null;
            row.resolution_latitude = null;
            row.resolution_image_URL = null;
            row.resolution_note = null;
            values.push(Object.values(row));
            return;
          }
        });
        console.table(values);

        let csvContent = "";
        values.forEach((row) => {
          csvContent += row
            .map((val) => JSON.stringify(val))
            .join(",")
            .concat("\n");
        });

        const data = new File([csvContent], "filtered-reports.csv", {
          type: "text/csv;charset=utf-8;",
        });
        anchorElement.href = URL.createObjectURL(data);
        anchorElement.download = "filtered-reports.csv";
        anchorElement.click();
      } catch (error) {
        console.error(error);
      } finally {
        setDownload(false);
        URL.revokeObjectURL(anchorElement.href);
        anchorElement.remove();
      }
    }
    handleDownload();
  }, [download, filterTheReports, filters, cleanReports]);

  return (
    <div className="filter-report-section">
      <p>This filters reports being displayed on the Map.</p>
      <button
        className="download-container"
        title="download"
        onClick={() => {
          setDownload(true);
        }}
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
    </div>
  );
}
