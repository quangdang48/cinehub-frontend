import type React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => {
  return (
    <div className="w-full max-w-md">
      <div className="bg-black/80 border border-gray-700 rounded-lg p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-gray-400 text-sm mt-2">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
