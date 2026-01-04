import React, { useState } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  ChevronUp,
} from "lucide-react";
import type { ReviewDto } from "@/types/ReviewDto";
import type { CommentDto } from "@/types/CommentDto";
import { timeAgo } from "@/utils/time";
import { CommentItem } from "./comment-item";
import { CommentInput } from "./comment-input";
import { normalizeUrl } from "@/utils/videoUtils";

interface ReviewItemProps {
  review: ReviewDto;
  currentUserId?: string;
  currentUserAvatar?: string;
  currentUserName?: string;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onLoadComments?: (reviewId: string) => Promise<CommentDto[]>;
  onSubmitComment?: (reviewId: string, content: string) => Promise<void>;
  onReplyToComment?: (
    parentId: string,
    content: string,
  ) => Promise<CommentDto | null>;
  onLoadReplies?: (parentId: string) => Promise<CommentDto[]>;
  onEdit?: (id: string, content: string, rating: number) => void;
  onDelete?: (id: string) => void;
  onReport?: (id: string) => void;
  showActions?: boolean;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  currentUserId,
  currentUserAvatar,
  currentUserName,
  onLike,
  onDislike,
  onLoadComments,
  onSubmitComment,
  onReplyToComment,
  onLoadReplies,
  onEdit,
  onDelete,
  onReport,
  showActions = true,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const [editRating, setEditRating] = useState(review.rating);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const isOwner = currentUserId === review.author.id;

  const handleLike = () => {
    if (disliked) setDisliked(false);
    setLiked(!liked);
    onLike?.(review.id);
  };

  const handleDislike = () => {
    if (liked) setLiked(false);
    setDisliked(!disliked);
    onDislike?.(review.id);
  };

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onEdit?.(review.id, editContent, editRating);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(review.content);
    setEditRating(review.rating);
    setIsEditing(false);
  };

  const handleToggleComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    if (comments.length === 0 && onLoadComments && review.totalComments > 0) {
      setLoadingComments(true);
      try {
        const loadedComments = await onLoadComments(review.id);
        setComments(loadedComments);
      } catch (err) {
        console.error("Error loading comments:", err);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(true);
  };

  const handleSubmitComment = async (content: string) => {
    if (!onSubmitComment) return;

    setSubmittingComment(true);
    try {
      await onSubmitComment(review.id, content);
      // Reload comments after submitting
      if (onLoadComments) {
        const loadedComments = await onLoadComments(review.id);
        setComments(loadedComments);
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderStars = (rating: number, interactive = false, size = 16) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setEditRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-transform ${interactive ? "hover:scale-110" : ""}`}
          >
            <Star
              size={size}
              className={`transition-colors ${
                star <= (interactive ? hoverRating || editRating : rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-yellow-500/30 transition-all group">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-yellow-500 transition-colors shrink-0 shadow-lg">
          <img
            src={review.author.avatarUrl ? normalizeUrl(review.author.avatarUrl) : "/default-avatar.png"}
            alt={review.author.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                <span className="text-white font-bold text-base group-hover:text-yellow-400 transition-colors">
                  {review.author.name}
                </span>
                <span className="text-gray-500 text-xs">
                  {timeAgo(review.createdAt)}
                </span>
                {review.updatedAt !== review.createdAt && (
                  <span className="text-gray-600 text-xs">(đã chỉnh sửa)</span>
                )}
              </div>
              {isEditing ? (
                <div className="mt-2">
                  {renderStars(editRating, true, 20)}
                  <span className="ml-2 text-sm text-yellow-400 font-bold">
                    {editRating}/10
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-yellow-400 font-bold text-sm">
                    {review.rating}/10
                  </span>
                </div>
              )}
            </div>

            {showActions && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-gray-500 hover:text-white transition-colors"
                >
                  <MoreHorizontal size={18} />
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
                            onDelete?.(review.id);
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
                        onReport?.(review.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Flag size={14} /> Báo cáo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-white/5 text-gray-200 text-sm p-3 rounded-xl border border-white/10 focus:border-yellow-500 focus:outline-none resize-none min-h-[100px]"
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
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {review.content}
            </p>
          )}

          {showActions && !isEditing && (
            <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 transition-colors ${liked ? "text-blue-400" : "hover:text-blue-400"}`}
              >
                <ThumbsUp size={14} className={liked ? "fill-current" : ""} />
                Hữu ích ({review.totalLikes})
              </button>
              <button
                onClick={handleDislike}
                className={`flex items-center gap-1.5 transition-colors ${disliked ? "text-red-400" : "hover:text-red-400"}`}
              >
                <ThumbsDown
                  size={14}
                  className={disliked ? "fill-current" : ""}
                />
                {review.totalDislikes}
              </button>
              {review.totalComments > 0 && (
                <button
                  onClick={handleToggleComments}
                  disabled={loadingComments}
                  className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
                >
                  {loadingComments ? (
                    <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : showComments ? (
                    <ChevronUp size={14} />
                  ) : (
                    <MessageSquare size={14} />
                  )}
                  {showComments
                    ? "Ẩn bình luận"
                    : `${review.totalComments} bình luận`}
                </button>
              )}
            </div>
          )}

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-white/10">
              {/* Comment Input */}
              {currentUserId && onSubmitComment && (
                <div className="mb-4">
                  <CommentInput
                    userAvatar={currentUserAvatar}
                    userName={currentUserName}
                    placeholder="Viết bình luận về đánh giá này..."
                    onSubmit={handleSubmitComment}
                    isLoading={submittingComment}
                    minRows={1}
                  />
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={currentUserId}
                    currentUserAvatar={currentUserAvatar}
                    currentUserName={currentUserName}
                    onReply={onReplyToComment}
                    onLoadReplies={onLoadReplies}
                    showActions={true}
                    depth={1}
                    maxDepth={3} // Allow nested replies within review comments
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
