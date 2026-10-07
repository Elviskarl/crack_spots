import type { SearchSuggestionsProps } from "../../../types";

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
  resetPreview,
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
                resetPreview?.();
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
