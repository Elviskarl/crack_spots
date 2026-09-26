import {
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  const searchInputElement = useRef<HTMLInputElement>(null);
  const searchedTerm = useRef<string>("");

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
    try {
      const normalized = searchTerm.toLowerCase().trim();

      if (!normalized) {
        setSearchTerm("");
        setMatchingReports(null);
        return;
      }
      const filteredReports = filterReports(normalized);
      searchedTerm.current = normalized;
      setMatchingReports(filteredReports);
      if (setInterestedReport) {
        setInterestedReport(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsOpen(false);
      searchInputElement.current?.blur();
    }
  }

  function filterReports(term: string) {
    return reports.filter((report) => {
      const isOnSameRoad = report.location.address?.road
        ?.toLowerCase()
        .trim()
        .includes(term);

      if (!isOnSameRoad) return false;

      return true;
    });
  }

  useEffect(() => {
    if (!searchTerm.trim()) {
      setInterestedReport?.(null);
    }
  }, [searchTerm, setInterestedReport]);
  return (
    <div className="search-input-section">
      <form
        className={`search-input-container ${hasSearch && suggestions.length > 0 && isOpen ? "has-suggestions" : ""}`}
        onSubmit={handleSubmit}
      >
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
          onFocus={(e) => {
            if (searchTerm) {
              setIsOpen(true);
            }
            e.target.setSelectionRange(
              e.target.value.length,
              e.target.value.length,
            );
          }}
          maxLength={20}
          ref={searchInputElement}
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
          debouncedSearchTerm={debouncedSearchTerm}
          isOpen={isOpen}
          setMatchingReport={setMatchingReports}
          func={filterReports}
          setInterestedReport={setInterestedReport}
          searchedTerm={searchedTerm}
        />
      </form>
      {matchingReports ? (
        <MatchingReports
          matchingReport={matchingReports}
          setCollapsed={setCollapsed}
          isResolving={isResolving}
          setInterestedReport={setInterestedReport}
          interestedReport={interestedReport}
          searchedTerm={searchedTerm.current}
        />
      ) : null}
    </div>
  );
}
