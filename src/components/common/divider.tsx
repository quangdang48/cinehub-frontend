import type React from "react";

interface DividerProps {
  text?: string;
}

export const Divider: React.FC<DividerProps> = ({ text = "OR" }) => {
  return (
    <div className="my-8 flex items-center">
      <div className="flex-1 h-px bg-gray-700"></div>
      {text && <span className="px-4 text-gray-400 text-sm">{text}</span>}
      <div className="flex-1 h-px bg-gray-700"></div>
    </div>
  );
};
