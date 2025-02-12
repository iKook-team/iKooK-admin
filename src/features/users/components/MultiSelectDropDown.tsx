import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MultiSelectDropdownProps {
  title: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelectDropdown({ title, options, value, onChange }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSelection = (item: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent closing dropdown on click
    onChange(value.includes(item) ? value.filter((i) => i !== item) : [...value, item]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <label className="block text-gray-700 font-medium mb-1">{title}</label>
      <div
        className="border border-gray-300 rounded-lg p-2 flex items-center cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex flex-wrap gap-2 flex-grow">
          {value.length > 0 ? (
            value.map((item) => (
              <span
                key={item}
                className="px-2 py-1 text-sm border border-yellow-400 bg-yellow-50 rounded-full"
              >
                {item}
              </span>
            ))
          ) : (
            <span className="text-gray-400">Select cuisine</span>
          )}
        </div>
        <ChevronDown className="ml-auto text-gray-600" size={16} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-md">
          {options.map((option) => (
            <div
              key={option}
              className={`p-2 cursor-pointer ${
                value.includes(option) ? "bg-yellow-100 font-medium" : "hover:bg-gray-100"
              }`}
              onClick={(event) => toggleSelection(option, event)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
