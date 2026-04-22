import { type Dispatch, type SetStateAction } from "react";
import type { Report } from "../../../types";

interface SearchSuggestionsProps {
  suggestions: string[];
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setMatchingReport: Dispatch<SetStateAction<Report[] | null>>;
  setInterestedReport: Dispatch<SetStateAction<Report | null>> | undefined;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  reports: Report[];
  debouncedSearchTerm: string;
  isOpen: boolean;
  func: (term: string) => Report[];
}

export default function SearchSuggestions({
  suggestions,
  setSearchTerm,
  setIsOpen,
  isOpen,
  debouncedSearchTerm,
  setMatchingReport,
  setInterestedReport,
  func,
}: SearchSuggestionsProps) {
  return (
    <ul
      className={`search-options ${isOpen && debouncedSearchTerm ? "active" : ""}`}
    >
      {suggestions.length > 0 ? (
        suggestions.map((suggestion, index) => {
          return (
            <li
              className="suggestion-list"
              key={suggestion + index}
              onMouseDown={() => {
                setSearchTerm(suggestion);
                setIsOpen(false);
                if (setInterestedReport) {
                  setInterestedReport(null);
                }
                setMatchingReport(func(suggestion));
              }}
            >
              <span>{suggestion}</span>
            </li>
          );
        })
      ) : (
        <li className="suggestion-list no-results">No results found.</li>
      )}
    </ul>
  );
}
