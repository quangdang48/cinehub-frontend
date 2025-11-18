import type React from "react";
import classNames from "classnames";

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  sticky?: boolean;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  sticky = false,
  className,
}) => {
  return (
    <div
      className={classNames(
        "bg-neutral-900 border-b border-neutral-800",
        sticky && "sticky top-16 z-10",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-8" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
              className={classNames(
                "py-4 px-2 font-semibold transition-colors relative",
                activeTab === tab.id
                  ? "text-white"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
