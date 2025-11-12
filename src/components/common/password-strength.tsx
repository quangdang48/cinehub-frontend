import type React from "react";
import { PASSWORD_REQUIREMENTS } from "@/utils/constants";

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  showRequirements = true,
}) => {
  const requirements = [
    {
      label: PASSWORD_REQUIREMENTS.MIN_LENGTH,
      met: password.length >= 8,
    },
    {
      label: PASSWORD_REQUIREMENTS.UPPERCASE,
      met: /[A-Z]/.test(password),
    },
    {
      label: PASSWORD_REQUIREMENTS.LOWERCASE,
      met: /[a-z]/.test(password),
    },
    {
      label: PASSWORD_REQUIREMENTS.NUMBER,
      met: /\d/.test(password),
    },
  ];

  const metCount = requirements.filter((req) => req.met).length;
  const strength = metCount === 0 ? 0 : (metCount / requirements.length) * 100;

  const getStrengthColor = () => {
    if (strength === 0) return "bg-gray-600";
    if (strength <= 25) return "bg-red-600";
    if (strength <= 50) return "bg-yellow-600";
    if (strength <= 75) return "bg-blue-600";
    return "bg-green-600";
  };

  const getStrengthLabel = () => {
    if (strength === 0) return "";
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strength}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 min-w-[50px]">
          {getStrengthLabel()}
        </span>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <ul className="space-y-1 text-xs">
          {requirements.map((req, index) => (
            <li
              key={index}
              className={`flex items-center gap-2 ${
                req.met ? "text-green-400" : "text-gray-500"
              }`}
            >
              <span>{req.met ? "✓" : "○"}</span>
              <span>{req.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
