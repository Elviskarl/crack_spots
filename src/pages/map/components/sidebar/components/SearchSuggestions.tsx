import { type Dispatch, type RefObject, type SetStateAction } from "react";
import type { Report } from "../../../types";

interface SearchSuggestionsProps {
  suggestions: string[];
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setMatchingReport: Dispatch<SetStateAction<Report[] | null>>;
  setInterestedReport: Dispatch<SetStateAction<Report | null>> | undefined;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  debouncedSearchTerm: string;
  isOpen: boolean;
  func: (term: string) => Report[];
  searchedTerm: RefObject<string>;
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
  searchedTerm,
}: SearchSuggestionsProps) {
  return (
    <ul className={`search-options ${isOpen ? "active" : ""}`}>
      {suggestions.length > 0 &&
        debouncedSearchTerm &&
        suggestions.map((suggestion, index) => {
          return (
            <li
              className="suggestion-list"
              key={suggestion + index}
              onMouseDown={() => {
                setSearchTerm(suggestion);
                searchedTerm.current = suggestion;
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
        })}
    </ul>
  );
}
