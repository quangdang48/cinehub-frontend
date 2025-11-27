import type React from "react";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import classNames from "classnames";
import type { MovieOptions } from "@/constant/movie.const";


interface MegaMenuDropdownProps {
  label: string;
  items: MovieOptions[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  basePath: string;
  columns?: number;
  className?: string;
}

export const MegaMenuDropdown: React.FC<MegaMenuDropdownProps> = ({
  label,
  items,
  isOpen,
  onToggle,
  onClose,
  basePath,
  columns = 4,
  className,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={dropdownRef} className={classNames("relative", className)}>
      {/* Trigger Button */}
      <button
        onClick={onToggle}
        className={classNames(
          "flex items-center gap-1 text-sm transition-colors",
          isOpen ? "text-white" : "text-neutral-300 hover:text-white"
        )}
      >
        {label}
        <ChevronDown
          size={16}
          className={classNames(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Menu Content */}
          <div
            className={classNames(
              "absolute top-full left-1/2 mt-4 z-50",
              "bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl",
              "p-6 w-max"
            )}
            style={{
              transform: 'translateX(-50%)',
              animation: 'megaMenuFadeIn 0.2s ease-out'
            }}
          >
            <div
              className="grid gap-x-8 gap-y-2"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(120px, 1fr))`,
              }}
            >
              {items.map((item) => (
                <Link
                  key={item.value}
                  to={`${basePath}?${basePath.includes("genre") ? "genre" : "country"}=${item.slug || item.value}`}
                  onClick={onClose}
                  className="text-sm text-neutral-300 hover:text-yellow-400 py-1.5 whitespace-nowrap transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes megaMenuFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default MegaMenuDropdown;
