import { useContext } from "react";
import { ReportContext } from "../../../../../context/createReportContext";
import "../../../styles/filterReports.css";

export default function FilterReports() {
  const { reports } = useContext(ReportContext)!;
  const category = new Set(reports.map((report) => report.severity));
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
          >
            <option value="" disabled>
              --Please choose an option--
            </option>
            <option value="2024">2024</option>
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
      </form>
    </div>
  );
}
