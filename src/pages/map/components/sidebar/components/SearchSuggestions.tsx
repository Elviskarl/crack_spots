import { type Dispatch, type SetStateAction } from "react";
import type { Report } from "../../../types";

interface SearchSuggestionsProps {
  suggestions: string[];
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  reports: Report[];
  debouncedSearchTerm: string;
}

export default function SearchSuggestions({
  suggestions,
  setSearchTerm,
  setIsOpen,
  reports,
}: SearchSuggestionsProps) {
  function FindMatchingReport(param: string) {
    if (!reports) return [];
    reports.filter(
      (report) => report.location.address?.road?.toLowerCase() === param,
    );
    return;
  }
  return (
    <ul className="search-options active">
      {suggestions.length > 0 ? (
        suggestions.map((suggestion, index) => {
          return (
            <li
              className="suggestion-list"
              key={suggestion + index}
              onMouseDown={() => {
                setSearchTerm(suggestion);
                FindMatchingReport(suggestion);
                setIsOpen(false);
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
