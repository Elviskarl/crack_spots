import { useContext, useMemo, useState, type FormEvent } from "react";
import { ReportContext } from "../../../../../context/createReportContext";
import searchIconUrl from "../../../../../assets/searchIcon.png";
import SearchSuggestions from "./SearchSuggestions";
import MatchingReports from "./MatchingReports";
import { MapContext } from "../../../../../context/createMapContext";
import "../../../styles/searchListSection.css";
import useDebounce from "../../../hooks/Debouncer";

export default function SearchListSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { reports } = useContext(ReportContext)!;
  const { setSelectedReport } = useContext(MapContext)!;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const matchingReport = useMemo(() => {
    if (!reports) return [];
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (term === "") return [];

    return reports.filter((report) =>
      report.location.address?.road?.toLowerCase().includes(term),
    );
  }, [debouncedSearchTerm, reports]);

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
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsOpen(false);
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
      {hasSearch ? (
        hasResults ? (
          <MatchingReports
            matchingReport={matchingReport}
            setSelectedReport={setSelectedReport}
          />
        ) : (
          <p className="no-results-found">No results found.</p>
        )
      ) : null}
    </div>
  );
}
