import React, { useState, useRef, useEffect } from "react";

type Option = {
  id: number | string;
  name: string;
};

interface MultiSelectWithInputProps {
  options: Option[];
  selectedIds: (number | string)[];
  onChange: (ids: (number | string)[]) => void;
  placeholder?: string;
  label?: string;
}

const MultiSelectWithInput: React.FC<MultiSelectWithInputProps> = ({
  options,
  selectedIds,
  onChange,
  placeholder = "Search and select...",
  label = "Select Tests",
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(
    (option) =>
      option.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedIds?.includes(option.id)
  );

  const handleSelect = (id: number | string) => {
    onChange([...selectedIds, id]);
    setSearch("");
  };

  const handleRemove = (id: number | string) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  // 🔐 Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      <div
        className="border border-gray-300 rounded-md px-2 py-1 w-full focus-within:ring-2 focus-within:ring-blue-500"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-wrap gap-1">
          {selectedIds.length>0 && selectedIds.map((id) => {
            const option = options.find((o) => o.id === id);
            return (
              <span
                key={id}
                className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm flex items-center"
              >
                {option?.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(id);
                  }}
                  className="ml-1 text-blue-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            );
          })}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="flex-1 border-none outline-none py-1 px-2 text-sm"
            onFocus={() => setIsOpen(true)}
          />
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto shadow-md">
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectWithInput;
