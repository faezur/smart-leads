import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all
          border-gray-300 bg-white text-gray-900
          focus:border-blue-500 focus:ring-2 focus:ring-blue-100
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-100' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Input;
