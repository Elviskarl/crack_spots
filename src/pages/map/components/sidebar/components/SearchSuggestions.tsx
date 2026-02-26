import type { Dispatch, SetStateAction } from "react";

interface SearchSuggestionsProps {
  suggestions: string[];
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function SearchSuggestions({
  suggestions,
  setSearchTerm,
  setIsOpen,
}: SearchSuggestionsProps) {
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
