import { normalizeUrl } from "@/utils/videoUtils";
import type React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
  onEdit?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  editable = false,
  onEdit,
}) => {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  return (
    <div className="relative inline-block">
      <div
        className={`${sizes[size]} rounded-full overflow-hidden border-4 border-gray-700`}
      >
        {src ? (
          <img src={normalizeUrl(src)} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full rounded-full bg-linear-to-br from-yellow-400 to-red-600 flex items-center justify-center text-white font-bold text-lg">
            {alt?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
      {editable && (
        <button
          onClick={onEdit}
          className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full border-2 border-gray-700 hover:bg-gray-700 transition"
          aria-label="Edit avatar"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
