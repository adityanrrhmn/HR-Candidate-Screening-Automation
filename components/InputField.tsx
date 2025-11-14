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
      <label htmlFor={id} className="flex items-center text-sm font-medium text-slate-400 mb-1">
        {label} {required && <span className="text-red-400 ml-1">*</span>}
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
          className={`block w-full rounded-lg border bg-slate-800/50 py-3
            placeholder-slate-500 text-slate-100 
            focus:border-purple-500 focus:ring-1 focus:ring-purple-500
            transition duration-150 ease-in-out sm:text-sm
            ${icon ? 'pl-10' : 'px-4'}
            ${
            hasError
              ? 'border-red-500/50 text-red-400 placeholder-red-500/70 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-700 hover:border-slate-600'
          }`}
        />
      </div>
      <p className="mt-2 text-sm text-red-400 min-h-[1.25rem]">{error || ''}</p>
    </div>
  );
};

export default InputField;