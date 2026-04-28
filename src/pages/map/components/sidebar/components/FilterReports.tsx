import { booleanPointInPolygon, point } from "@turf/turf";
import { useContext } from "react";
import { ReportContext } from "../../../../../context/createReportContext";
import { MapContext } from "../../../../../context/createMapContext";
import "../../../styles/filterReports.css";

export default function FilterReports() {
  const { setReports, originalReports } = useContext(ReportContext)!;
  const { nairobiSubCountyShapefile } = useContext(MapContext)!;

  const category = new Set(
    originalReports.current.map((report) => report.severity),
  );

  const yearTaken = new Set(
    originalReports.current.map((report) =>
      new Date(report.dateTaken).getUTCFullYear(),
    ),
  );

  const resolutionStatus = new Set(
    originalReports.current.map((report) => report.resolution?.quality),
  );

  function getSubCounty(subcounty: string) {
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
  }
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
            defaultValue={""}
            required
            onChange={(e) => {
              const selectedYear = Number(e.target.value);
              setReports(
                originalReports.current.filter((report) => {
                  const date = new Date(report.dateTaken);
                  if (isNaN(date.getTime())) return false;
                  return date.getUTCFullYear() === selectedYear;
                }),
              );
            }}
          >
            <option value="" disabled>
              --Please choose an option--
            </option>
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
            defaultValue={""}
            required
            onChange={(e) => {
              const selectedCategory = e.target.value;
              setReports(
                originalReports.current.filter(
                  (report) => report.severity === selectedCategory,
                ),
              );
            }}
          >
            <option value="" disabled>
              --Please choose an option--
            </option>
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
            defaultValue={""}
            required
            onChange={(e) => {
              const selectedSubCounty = e.target.value;
              getSubCounty(selectedSubCounty);
            }}
          >
            <option value="" disabled>
              --Please choose an option--
            </option>
            {nairobiSubCountyShapefile.current?.features.map(
              (feature, index) => (
                <option key={index} value={feature.properties?.subcounty}>
                  {feature.properties?.subcounty.replace(
                    /\s*Sub\s+County\s*/i,
                    "",
                  )}
                </option>
              ),
            )}
          </select>
        </fieldset>
        <fieldset>
          <legend>Filter by resolution quality</legend>
          <label htmlFor="select-input"></label>
          <select
            name="resolution-category"
            id="resolution-input"
            defaultValue={""}
            required
            onChange={(e) => {
              const selectedCategory = e.target.value;
              setReports(
                originalReports.current.filter(
                  (report) => report.resolution?.quality === selectedCategory,
                ),
              );
            }}
          >
            <option value="" disabled>
              --Please choose an option--
            </option>
            {Array.from(resolutionStatus).map((item, index) => (
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
            setReports(originalReports.current);
          }}
        >
          Reset
        </button>
      </form>
    </div>
  );
}
