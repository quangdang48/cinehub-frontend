import { Star } from "lucide-react";
import type React from "react";

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  size = "md",
  showLabel = false,
}) => {
  const sizes = {
    sm: {
      container: "px-3 py-1.5",
      icon: 16,
      text: "text-sm",
    },
    md: {
      container: "px-4 py-2",
      icon: 20,
      text: "text-lg",
    },
    lg: {
      container: "px-5 py-3",
      icon: 24,
      text: "text-xl",
    },
  };

  const config = sizes[size];

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        className={`inline-flex items-center gap-2 bg-blue-600 rounded-lg ${config.container}`}
      >
        <Star size={config.icon} className="text-white fill-white" />
        {/* <span className={`font-bold text-white ${config.text}`}>
          {rating.toFixed(1)}
        </span> */}
      </div>
      {showLabel && (
        <span className="text-sm text-neutral-400">Đánh giá</span>
      )}
    </div>
  );
};
