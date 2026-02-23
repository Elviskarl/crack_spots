import { useContext, useMemo, useState, type FormEvent } from "react";
import { ReportContext } from "../../../../../context/createReportContext";
import "../../../styles/searchListSection.css";
import searchIconUrl from "../../../../../assets/searchIcon.png";
import type { Report } from "../../../types";
import SearchSuggestions from "./SearchSuggestions";
import MatchingReports from "./MatchingReports";

export default function SearchListSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const report = useContext(ReportContext);
  const [matchingReport, setMatchingReport] = useState<Report[]>([]);

  // Extract unique street names from the report data
  const streetNames = useMemo(() => {
    if (!report) return [];
    const uniqueStreetNames = new Set(
      report
        .map((item) => item.location.address?.road?.toLowerCase())
        .filter(Boolean) as string[],
    );
    return Array.from(uniqueStreetNames);
  }, [report]);

  // Filter street names based on the search term
  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    return streetNames.filter((street) =>
      street.includes(searchTerm.toLowerCase()),
    );
  }, [streetNames, searchTerm]);

  // Handle form submission
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsOpen(false);
    try {
      if (!report) throw new Error("Report data is unavailable.");
      const searchResults = report.filter(
        (item) =>
          item.location.address?.road?.toLowerCase() ===
          searchTerm.toLowerCase(),
      );
      setMatchingReport(searchResults);
      console.log(searchResults);
    } catch (error) {
      console.error("Error during search:", error);
    }
  }

  return (
    <div className="search-input-section">
      <form className="search-input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value.trim();
            setSearchTerm(value);
            setIsOpen(true);
          }}
          onBlur={() => setIsOpen(false)}
          onFocus={() => searchTerm && setIsOpen(true)}
        />
        <button className="search-button">
          <img
            src={searchIconUrl}
            alt="Search Icon"
            aria-hidden
            className="small-list-images"
          />
        </button>
        {isOpen && (
          <SearchSuggestions
            setIsOpen={setIsOpen}
            setSearchTerm={setSearchTerm}
            suggestions={suggestions}
          />
        )}
      </form>
      {matchingReport.length > 0 ? (
        <MatchingReports matchingReport={matchingReport} />
      ) : (
        <p className="no-results-found">No results found.</p>
      )}
    </div>
  );
}
