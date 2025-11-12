import type React from "react";
import classNames from "classnames";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors rounded-lg",
        {
          "bg-yellow-600 text-white": isActive,
          "text-gray-300 hover:bg-gray-800": !isActive,
        }
      )}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
};
