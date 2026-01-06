import type React from "react";

interface RadioGroupProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        {label}
      </label>
      <div className="flex gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 focus:ring-yellow-500"
            />
            <span className="text-gray-300">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};
