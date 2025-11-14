import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, value, onChange, error, required = false, placeholder, icon }) => {
  const hasError = !!error;
  
  return (
    <div>
      <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full rounded-lg border-gray-300 shadow-sm py-3
            placeholder-gray-400 text-gray-900 
            focus:border-indigo-500 focus:ring-indigo-500
            transition duration-150 ease-in-out sm:text-sm
            ${icon ? 'pl-10' : 'px-4'}
            ${
            hasError
              ? 'border-red-500 ring-red-500 text-red-700 placeholder-red-400 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
        />
      </div>
      <p className="mt-2 text-sm text-red-600 min-h-[1.25rem]">{error || ''}</p>
    </div>
  );
};

export default InputField;