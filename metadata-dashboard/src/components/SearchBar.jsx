// src/components/SearchBar.jsx
import React, { useState, useCallback } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { subDays, formatISO } from "date-fns";
import { debounce } from "lodash";

// This handler will now be inside the component
function SearchBar({ onFilterChange }) {
  const [inputValue, setInputValue] = useState("");

  const debouncedFilter = useCallback(
    debounce((query) => {
      const lowerQuery = query.toLowerCase();
      const updatedMatch = lowerQuery.match(
        /updated (in the )?last (\d+)? ?(week|day)s?/,
      );

      if (updatedMatch) {
        const value = parseInt(updatedMatch[2] || "1", 10);
        const unit = updatedMatch[3];
        let days = unit === "week" ? value * 7 : value;
        onFilterChange({
          search: "",
          updatedSince: formatISO(subDays(new Date(), days)),
        });
      } else {
        onFilterChange({ search: query, updatedSince: null });
      }
    }, 400),
    [],
  );

  const handleChange = (event) => {
    setInputValue(event.target.value);
    debouncedFilter(event.target.value);
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search or try 'updated last week'..."
      value={inputValue}
      onChange={handleChange}
      InputProps={
        {
          /* ... */
        }
      }
      sx={{ mb: 3 }}
    />
  );
}

export default SearchBar;
