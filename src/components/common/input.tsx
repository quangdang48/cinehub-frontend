import type React from "react";
import { forwardRef } from "react";
import classNames from "classnames";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={classNames(
            "w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 rounded border border-gray-700 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition",
            {
              "border-red-600 bg-red-900/20": error,
            },
            className,
          )}
          {...props}
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        {helperText && !error && (
          <p className="text-gray-400 text-xs mt-2">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
