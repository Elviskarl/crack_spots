import {
  useContext,
  useEffect,
  useMemo,
  useState,
  type SubmitEvent,
} from "react";
import { ReportContext } from "../../../../../context/createReportContext";
import searchIconUrl from "../../../../../assets/search-icon.svg";
import SearchSuggestions from "./SearchSuggestions";
import MatchingReports from "./MatchingReports";
import "../../../styles/searchListSection.css";
import useDebounce from "../../../hooks/Debouncer";
import { type Report, type ListItemOptional } from "../../../types";

export default function SearchListSection(props: ListItemOptional) {
  const [searchTerm, setSearchTerm] = useState("");
  const [matchingReports, setMatchingReports] = useState<Report[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { reports } = useContext(ReportContext)!;
  const debouncedSearchTerm = useDebounce(searchTerm, 300).toLowerCase().trim();
  const { setCollapsed, isResolving, setInterestedReport, interestedReport } =
    props;

  const hasSearch = debouncedSearchTerm.trim() !== "";

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
    return streetNames.filter((street) => street.includes(debouncedSearchTerm));
  }, [streetNames, debouncedSearchTerm]);

  // Handle form submission
  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (setInterestedReport) {
      setInterestedReport(null);
    }
    try {
      const filteredReports = filterReports(searchTerm);
      setMatchingReports(filteredReports);
    } catch (error) {
      console.error(error);
    }
    setIsOpen(false);
  }

  function filterReports(term: string) {
    const normalized = term.toLowerCase().trim();
    return reports.filter((report) =>
      report.location.address?.road?.toLowerCase().trim().includes(normalized),
    );
  }

  useEffect(() => {
    if (!searchTerm.trim()) {
      setInterestedReport?.(null);
    }
  }, [searchTerm, setInterestedReport]);
  return (
    <div className="search-input-section">
      <form className="search-input-container" onSubmit={handleSubmit}>
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
          maxLength={20}
        />
        {searchTerm && (
          <button
            className="clear-btn"
            onClick={() => {
              setSearchTerm("");
              setIsOpen(false);
              setTimeout(() => {
                setMatchingReports(null);
              }, 350);
            }}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ionicon"
              viewBox="0 0 512 512"
            >
              <path
                d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
        <button className="search-button" type="submit">
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
          setMatchingReport={setMatchingReports}
          func={filterReports}
          setInterestedReport={setInterestedReport}
        />
      </form>
      {hasSearch ? (
        matchingReports ? (
          <MatchingReports
            matchingReport={matchingReports}
            setCollapsed={setCollapsed}
            isResolving={isResolving}
            setInterestedReport={setInterestedReport}
            interestedReport={interestedReport}
            term={debouncedSearchTerm}
          />
        ) : (
          <p className="no-results-found">No results found.</p>
        )
      ) : null}
    </div>
  );
}
