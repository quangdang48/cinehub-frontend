import type React from "react";
import classNames from "classnames";

interface AlertProps {
  message?: string;
  variant?: "error" | "success" | "info" | "warning";
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  message,
  variant = "info",
  onClose,
}) => {
  if (!message) return null;

  const variants = {
    error: "bg-red-900/50 border-red-600 text-red-200",
    success: "bg-green-900/50 border-green-600 text-green-200",
    info: "bg-blue-900/50 border-blue-600 text-blue-200",
    warning: "bg-yellow-900/50 border-yellow-600 text-yellow-200",
  };

  return (
    <div
      className={classNames(
        "mb-6 p-4 border rounded text-sm flex items-start justify-between",
        variants[variant],
      )}
    >
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-current hover:opacity-80 transition"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
