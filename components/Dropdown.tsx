import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './Icons';

interface DropdownProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ id, label, options, value, onChange, placeholder, error, required = false, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasError = !!error;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
          </div>
        )}
        <button
          type="button"
          id={id}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            block w-full text-left rounded-lg border shadow-sm py-3
            placeholder-gray-400 text-gray-900 
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
            transition duration-150 ease-in-out sm:text-sm
            ${icon ? 'pl-10' : 'px-4'}
            pr-10
            ${hasError ? 'border-red-500 ring-red-500' : 'border-gray-300 hover:border-indigo-400'}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {value || <span className="text-gray-400">{placeholder}</span>}
        </button>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
      </div>
      
      <div
        className={`absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md transition-all duration-200 ease-out origin-top
          ${isOpen ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95 pointer-events-none'}`}
      >
        <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm" role="listbox">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-100"
              role="option"
              aria-selected={value === option}
            >
              <span className={`block truncate ${value === option ? 'font-semibold' : 'font-normal'}`}>
                {option}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-2 text-sm text-red-600 min-h-[1.25rem]">{error || ''}</p>
    </div>
  );
};

export default Dropdown;