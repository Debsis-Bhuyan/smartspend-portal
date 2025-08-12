import React, { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";

interface SingleSelectProps {
  label: string;
  options: { id: string | number; name: string }[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onSearch?: (query: string) => void;
  className?: string;
  labelClassName?: string;
  buttonClassName?: string;
  optionsClassName?: string;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  error,
  onSearch,
  className = "",
  labelClassName = "block text-sm font-medium text-gray-700 mb-1",
  buttonClassName = "px-3 py-2",
  optionsClassName = "",
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(query.toLowerCase())
  );

  const selectedLabel = options.find((opt) => opt.id === value)?.name || "";
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (onSearch) onSearch(query);
    }, 300); 

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className={`relative ${className}`}>
      <label className={labelClassName}>{label}</label>

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={`w-full text-left border rounded-md bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${buttonClassName} ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <span>{selectedLabel || placeholder}</span>
          <ChevronsUpDown className="w-4 h-4 ml-2 text-gray-500" />
        </button>

        {open && (
          <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto ${optionsClassName}`}>
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
            />

            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
            )}

            {filteredOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                  setQuery("");
                }}
                className="px-3 py-2 cursor-pointer hover:bg-blue-100"
              >
                {opt.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default SingleSelect;
