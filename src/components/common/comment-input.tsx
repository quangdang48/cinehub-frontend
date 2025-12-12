import React, { useState } from "react";
import { Send } from "lucide-react";
import { Avatar } from "./avatar";

interface CommentInputProps {
  userAvatar?: string;
  userName?: string;
  placeholder?: string;
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  autoFocus?: boolean;
  minRows?: number;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  userAvatar,
  userName = "Bạn",
  placeholder = "Chia sẻ cảm nghĩ của bạn...",
  onSubmit,
  isLoading = false,
  autoFocus = false,
  minRows = 2,
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim() && !isLoading) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-linear-to-r from-yellow-500 to-orange-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
      <div className="relative bg-[#020617] rounded-2xl p-4">
        <div className="flex gap-4">
          <div className="w-10 h-10 shrink-0">
            <Avatar src={userAvatar} alt={userName} size="sm" />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            rows={minRows}
            className="w-full bg-transparent text-gray-200 text-sm focus:outline-none resize-none placeholder-gray-600"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <span className="text-xs text-gray-600">Ctrl + Enter để gửi</span>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isLoading}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              content.trim() && !isLoading
                ? "bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20"
                : "bg-white/10 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                Đang gửi...
              </>
            ) : (
              <>
                Gửi <Send size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
