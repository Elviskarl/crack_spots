import { useContext, useEffect, useMemo, useState } from "react";
import { ReportContext } from "../../../../../context/createReportContext";
import searchIconUrl from "../../../../../assets/searchIcon.png";
import SearchSuggestions from "./SearchSuggestions";
import MatchingReports from "./MatchingReports";
import "../../../styles/searchListSection.css";
import useDebounce from "../../../hooks/Debouncer";
import type { ListItemOptional } from "../../../types";

export default function SearchListSection(props: ListItemOptional) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { reports } = useContext(ReportContext)!;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { setCollapsed, isResolving, setInterestedReport, interestedReport } =
    props;

  // Find matching Report
  const matchingReport = useMemo(() => {
    return reports.filter(
      (report) =>
        report.location.address?.road?.toLowerCase().trim() ===
        debouncedSearchTerm,
    );
  }, [reports, debouncedSearchTerm]);

  const hasSearch = debouncedSearchTerm.trim() !== "";
  const hasResults = matchingReport.length > 0;

  // Extract unique street names from the report data
  const streetNames = useMemo(() => {
    if (!reports) return [];
    const uniqueStreetNames = new Set(
      reports
        .map((item) => item.location.address?.road?.toLowerCase())
        .filter(Boolean) as string[],
    );
    return Array.from(uniqueStreetNames);
  }, [reports]);

  // Filter street names based on the search term
  const suggestions = useMemo(() => {
    return streetNames.filter((street) =>
      street.includes(debouncedSearchTerm.toLowerCase().trim()),
    );
  }, [streetNames, debouncedSearchTerm]);

  // Handle form submission
  function handleSubmit() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (interestedReport && setInterestedReport) {
      const isValid = matchingReport.some(
        (report) => report._id === interestedReport._id,
      );
      if (!isValid) {
        setInterestedReport(null);
      }
    }
  }, [interestedReport, setInterestedReport, matchingReport]);
  return (
    <div className="search-input-section">
      <form className="search-input-container" action={handleSubmit}>
        <input
          type="text"
          placeholder="Search by street name..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
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
        <SearchSuggestions
          setIsOpen={setIsOpen}
          setSearchTerm={setSearchTerm}
          suggestions={suggestions}
          reports={reports}
          debouncedSearchTerm={debouncedSearchTerm}
          isOpen={isOpen}
        />
      </form>
      {hasSearch ? (
        hasResults ? (
          <MatchingReports
            matchingReport={matchingReport}
            setCollapsed={setCollapsed}
            isResolving={isResolving}
            setInterestedReport={setInterestedReport}
            interestedReport={interestedReport}
          />
        ) : (
          <p className="no-results-found">No results found.</p>
        )
      ) : null}
    </div>
  );
}
