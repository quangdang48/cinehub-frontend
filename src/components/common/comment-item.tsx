import React, { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Flag,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { CommentDto } from "@/types/CommentDto";
import { timeAgo } from "@/utils/time";
import { CommentInput } from "./comment-input";

interface CommentItemProps {
  comment: CommentDto;
  currentUserId?: string;
  currentUserAvatar?: string;
  currentUserName?: string;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onReply?: (parentId: string, content: string) => Promise<CommentDto | null>;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onReport?: (id: string) => void;
  onLoadReplies?: (parentId: string) => Promise<CommentDto[]>;
  showActions?: boolean;
  depth?: number; // Track nesting depth
  maxDepth?: number; // Maximum nesting level (like social media platforms)
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  currentUserAvatar,
  currentUserName,
  onLike,
  onDislike,
  onReply,
  onEdit,
  onDelete,
  onReport,
  onLoadReplies,
  showActions = true,
  depth = 0,
  maxDepth = 3, // Default max 3 levels deep like Facebook/YouTube
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentDto[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const isOwner = currentUserId === comment.author.id;
  const canReply = depth < maxDepth; // Only allow replies up to maxDepth

  const handleLike = () => {
    if (disliked) setDisliked(false);
    setLiked(!liked);
    onLike?.(comment.id);
  };

  const handleDislike = () => {
    if (liked) setLiked(false);
    setDisliked(!disliked);
    onDislike?.(comment.id);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit?.(comment.id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleToggleReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    if (replies.length === 0 && onLoadReplies && comment.totalReplies > 0) {
      setLoadingReplies(true);
      try {
        const loadedReplies = await onLoadReplies(comment.id);
        setReplies(loadedReplies);
      } catch (err) {
        console.error("Error loading replies:", err);
      } finally {
        setLoadingReplies(false);
      }
    }
    setShowReplies(true);
  };

  const handleToggleReplyInput = () => {
    if (!currentUserId) {
      alert("Vui lòng đăng nhập để trả lời bình luận");
      return;
    }
    setIsReplying(!isReplying);
  };

  const handleSubmitReply = async (content: string) => {
    if (!onReply) return;

    setIsSubmittingReply(true);
    try {
      const newReply = await onReply(comment.id, content);
      if (newReply) {
        // Add new reply to the beginning of replies list
        setReplies((prev) => [newReply, ...prev]);
        // Update total replies count locally
        comment.totalReplies = (comment.totalReplies || 0) + 1;
        setShowReplies(true);
        setIsReplying(false);
      }
    } catch (err) {
      console.error("Error submitting reply:", err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Calculate indentation based on depth (max visual indent to prevent too narrow)
  const getIndentClass = () => {
    if (depth === 0) return "";
    // Limit visual indent to prevent comments becoming too narrow
    const visualDepth = Math.min(depth, 2);
    return `ml-${visualDepth * 2}`; // e.g., ml-2, ml-4
  };

  return (
    <div className={`flex gap-3 group ${getIndentClass()}`}>
      <div
        className={`${depth > 0 ? "w-8 h-8" : "w-10 h-10"} rounded-full overflow-hidden border-2 border-transparent group-hover:border-yellow-500 transition-colors shrink-0 shadow-lg`}
      >
        <img
          src={
            comment.author.gender === "male"
              ? `https://randomuser.me/api/portraits/men/${Math.abs(comment.author.id.charCodeAt(0) % 99)}.jpg`
              : `https://randomuser.me/api/portraits/women/${Math.abs(comment.author.id.charCodeAt(0) % 99)}.jpg`
          }
          alt={comment.author.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
          <span className="text-white font-bold text-base group-hover:text-yellow-400 transition-colors">
            {comment.author.name}
          </span>
          <span className="text-gray-500 text-xs">
            {timeAgo(comment.createdAt)}
          </span>
          {comment.updatedAt !== comment.createdAt && (
            <span className="text-gray-600 text-xs">(đã chỉnh sửa)</span>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-white/5 text-gray-200 text-sm p-3 rounded-xl border border-white/10 focus:border-yellow-500 focus:outline-none resize-none min-h-20"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 bg-yellow-500 text-black text-sm font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Lưu
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-1.5 bg-white/10 text-white text-sm font-bold rounded-lg hover:bg-white/20 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-sm mb-3 leading-relaxed bg-white/5 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-white/5 hover:bg-white/10 transition-colors">
            {comment.content}
          </p>
        )}

        {showActions && !isEditing && (
          <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${liked ? "text-blue-400" : "hover:text-blue-400"}`}
            >
              <ThumbsUp size={14} className={liked ? "fill-current" : ""} />
              {comment.totalLikes}
            </button>
            <button
              onClick={handleDislike}
              className={`flex items-center gap-1.5 transition-colors ${disliked ? "text-red-400" : "hover:text-red-400"}`}
            >
              <ThumbsDown
                size={14}
                className={disliked ? "fill-current" : ""}
              />
              {comment.totalDislikes}
            </button>
            {onReply && canReply && (
              <button
                onClick={handleToggleReplyInput}
                className={`flex items-center gap-1.5 transition-colors ${isReplying ? "text-yellow-400" : "hover:text-yellow-400"}`}
              >
                <MessageSquare size={14} />
                Trả lời
              </button>
            )}

            <div className="relative ml-auto">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:text-white transition-colors"
              >
                <MoreHorizontal size={16} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-[#1e293b] rounded-lg shadow-xl border border-white/10 py-1 min-w-[140px] z-50">
                  {isOwner && (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <Edit size={14} /> Chỉnh sửa
                      </button>
                      <button
                        onClick={() => {
                          onDelete?.(comment.id);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      onReport?.(comment.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Flag size={14} /> Báo cáo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Replies Button */}
        {comment.totalReplies > 0 && (
          <button
            onClick={handleToggleReplies}
            disabled={loadingReplies}
            className="flex items-center gap-2 mt-3 text-xs text-yellow-500 hover:text-yellow-400 transition-colors font-medium"
          >
            {loadingReplies ? (
              <>
                <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                Đang tải...
              </>
            ) : (
              <>
                {showReplies ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
                {showReplies
                  ? "Ẩn phản hồi"
                  : `Xem ${comment.totalReplies} phản hồi`}
              </>
            )}
          </button>
        )}

        {/* Reply Input - Inline like social media */}
        {isReplying && (
          <div className="mt-4">
            <CommentInput
              userAvatar={currentUserAvatar}
              userName={currentUserName}
              placeholder={`Trả lời ${comment.author.name}...`}
              onSubmit={handleSubmitReply}
              isLoading={isSubmittingReply}
              autoFocus
              minRows={1}
            />
            <button
              onClick={() => setIsReplying(false)}
              className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Hủy
            </button>
          </div>
        )}

        {/* Replies List - Recursive nested comments */}
        {showReplies && replies.length > 0 && (
          <div
            className={`mt-4 space-y-4 ${depth < maxDepth - 1 ? "pl-4 border-l-2 border-white/10" : ""}`}
          >
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                currentUserAvatar={currentUserAvatar}
                currentUserName={currentUserName}
                onLike={onLike}
                onDislike={onDislike}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onReport={onReport}
                onLoadReplies={onLoadReplies}
                showActions={showActions}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
