import React, { useState, useCallback, useEffect } from "react";
import {
  MessageSquare,
  Star,
  ChevronDown,
  AlertCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import type { CommentDto } from "@/types/CommentDto";
import type { ReviewDto } from "@/types/ReviewDto";
import type { CreateCommentDto } from "@/types/CreateCommentDto";
import type { CreateReviewDto } from "@/types/CreateReviewDto";
import { ReactionType } from "@/types/CommentReactionDto";

import {
  CommentItem,
  CommentInput,
  ReviewItem,
  ReviewInput,
} from "@/components/common";
import { CommentsService } from "@/services/CommentsService";
import { ReviewsService } from "@/services/ReviewsService";
import { useAppSelector } from "@/store";

type TabType = "comments" | "reviews";

interface CommentSectionProps {
  filmId: string;
  averageRating?: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  filmId,
  averageRating = 0,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("comments");

  // Comments state
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [commentsPage, setCommentsPage] = useState(1);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [sortBy, setSortBy] = useState<"newest" | "helpful">("newest");
  const [userReview, setUserReview] = useState<ReviewDto | null>(null);

  // Common state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signedIn = useAppSelector((state) => state.auth.session.signedIn);
  const currentUser = useAppSelector((state) => state.auth.user);

  // Get current user avatar
  const currentUserAvatar = currentUser
    ? currentUser.gender === "male"
      ? `https://randomuser.me/api/portraits/men/${Math.abs(currentUser.id.charCodeAt(0) % 99)}.jpg`
      : `https://randomuser.me/api/portraits/women/${Math.abs(currentUser.id.charCodeAt(0) % 99)}.jpg`
    : undefined;

  // Fetch comments
  useEffect(() => {
    if (activeTab !== "comments") return;

    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await CommentsService.commentControllerGetAllV1({
          filmId,
          page: 1,
          limit: 10,
        });
        setComments(response.data);
        setTotalComments(response.totalItems);
        setCommentsPage(1);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Không thể tải bình luận. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [filmId, activeTab]);

  // Fetch reviews
  useEffect(() => {
    if (activeTab !== "reviews") return;

    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ReviewsService.reviewControllerGetAllV1({
          filmId,
          page: 1,
          limit: 10,
          sort:
            sortBy === "newest"
              ? '{"createdAt":"DESC"}'
              : '{"totalLikes":"DESC"}',
        });
        setReviews(response.data);
        setTotalReviews(response.totalItems);
        setReviewsPage(1);

        // Check if current user already has a review
        if (currentUser?.id) {
          const existingReview = response.data.find(
            (r) => r.author.id === currentUser.id,
          );
          setUserReview(existingReview || null);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Không thể tải đánh giá. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [filmId, activeTab, sortBy, currentUser?.id]);

  const handleSubmitComment = useCallback(
    async (content: string) => {
      if (!signedIn) {
        setError("Vui lòng đăng nhập để bình luận");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const createDto: CreateCommentDto = { content, filmId };
        const response = await CommentsService.commentControllerCreateV1({
          requestBody: createDto,
        });

        if (response.data) {
          setComments((prev) => [response.data, ...prev]);
          setTotalComments((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Error creating comment:", err);
        setError("Không thể gửi bình luận. Vui lòng thử lại.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [filmId, signedIn],
  );

  const handleReplyComment = useCallback(
    async (parentId: string, content: string): Promise<CommentDto | null> => {
      if (!signedIn) {
        setError("Vui lòng đăng nhập để trả lời bình luận");
        return null;
      }

      try {
        const createDto: CreateCommentDto = { content, filmId, parentId };
        const response = await CommentsService.commentControllerCreateV1({
          requestBody: createDto,
        });

        if (response.data) {
          // Update reply count for parent comment
          setComments((prev) =>
            prev.map((c) =>
              c.id === parentId
                ? { ...c, totalReplies: c.totalReplies + 1 }
                : c,
            ),
          );
          return response.data;
        }
        return null;
      } catch (err) {
        console.error("Error creating reply:", err);
        setError("Không thể gửi phản hồi. Vui lòng thử lại.");
        return null;
      }
    },
    [filmId, signedIn],
  );

  const handleLoadMoreComments = useCallback(async () => {
    if (isLoading || comments.length >= totalComments) return;

    setIsLoading(true);
    try {
      const response = await CommentsService.commentControllerGetAllV1({
        filmId,
        page: commentsPage + 1,
        limit: 10,
      });

      setComments((prev) => [...prev, ...response.data]);
      setCommentsPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error loading more comments:", err);
      setError("Không thể tải thêm bình luận.");
    } finally {
      setIsLoading(false);
    }
  }, [filmId, commentsPage, isLoading, comments.length, totalComments]);

  const handleLoadReplies = useCallback(
    async (parentId: string): Promise<CommentDto[]> => {
      try {
        const response = await CommentsService.commentControllerGetAllV1({
          filmId,
          parentId,
          limit: 50,
        });
        return response.data;
      } catch (err) {
        console.error("Error loading replies:", err);
        return [];
      }
    },
    [filmId],
  );

  const handleLikeComment = useCallback(
    async (id: string) => {
      if (!signedIn) {
        setError("Vui lòng đăng nhập để thích bình luận");
        return;
      }
      try {
        const response = await CommentsService.commentReactionV1({
          requestBody: { type: ReactionType.LIKE, commentId: id },
        });

        setComments((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  totalLikes: response.data.totalLikes,
                  totalDislikes: response.data.totalDislikes,
                }
              : c,
          ),
        );
      } catch (err) {
        console.error("Error liking comment:", err);
        setError("Không thể thích bình luận.");
      }
    },
    [signedIn],
  );

  const handleDislikeComment = useCallback(
    async (id: string) => {
      if (!signedIn) {
        setError("Vui lòng đăng nhập để không thích bình luận");
        return;
      }
      try {
        const response = await CommentsService.commentReactionV1({
          requestBody: { type: ReactionType.DISLIKE, commentId: id },
        });

        setComments((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  totalLikes: response.data.totalLikes,
                  totalDislikes: response.data.totalDislikes,
                }
              : c,
          ),
        );
      } catch (err) {
        console.error("Error disliking comment:", err);
        setError("Không thể không thích bình luận.");
      }
    },
    [signedIn],
  );

  const handleEditComment = useCallback(async (id: string, content: string) => {
    try {
      await CommentsService.commentControllerUpdateV1({
        id,
        requestBody: { content },
      });

      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, content, updatedAt: new Date().toISOString() }
            : c,
        ),
      );
    } catch (err) {
      console.error("Error updating comment:", err);
      setError("Không thể cập nhật bình luận.");
    }
  }, []);

  const handleDeleteComment = useCallback(async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;

    try {
      await CommentsService.commentControllerDeleteV1({ id });
      setComments((prev) => prev.filter((c) => c.id !== id));
      setTotalComments((prev) => prev - 1);
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Không thể xóa bình luận.");
    }
  }, []);

  const handleReportComment = useCallback(
    async (id: string, reason?: string, description?: string) => {
      if (!signedIn) {
        setError("Vui lòng đăng nhập để báo cáo bình luận");
        return;
      }
      try {
        await CommentsService.reportCommentV1({
          requestBody: {
            commentId: id,
            reason: reason || ("other" as any),
            description,
          },
        });
        alert("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét bình luận này.");
      } catch (err: any) {
        console.error("Error reporting comment:", err);
        if (err?.response?.status === 400) {
          setError("Bạn đã báo cáo bình luận này rồi.");
        } else {
          setError("Không thể báo cáo bình luận.");
        }
      }
    },
    [signedIn],
  );

  const handleSubmitReview = useCallback(
    async (content: string, rating: number) => {
      if (!signedIn) {
        setError("Vui lòng đăng nhập để đánh giá");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const createDto: CreateReviewDto = { content, rating, filmId };
        const response = await ReviewsService.reviewControllerCreateV1({
          requestBody: createDto,
        });

        if (response.data) {
          setReviews((prev) => [response.data, ...prev]);
          setTotalReviews((prev) => prev + 1);
          setUserReview(response.data);
        }
      } catch (err) {
        console.error("Error creating review:", err);
        setError(
          "Không thể gửi đánh giá. Có thể bạn đã đánh giá phim này rồi.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [filmId, signedIn],
  );

  const handleLoadMoreReviews = useCallback(async () => {
    if (isLoading || reviews.length >= totalReviews) return;

    setIsLoading(true);
    try {
      const response = await ReviewsService.reviewControllerGetAllV1({
        filmId,
        page: reviewsPage + 1,
        limit: 10,
        sort:
          sortBy === "newest"
            ? '{"createdAt":"DESC"}'
            : '{"totalLikes":"DESC"}',
      });

      setReviews((prev) => [...prev, ...response.data]);
      setReviewsPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error loading more reviews:", err);
      setError("Không thể tải thêm đánh giá.");
    } finally {
      setIsLoading(false);
    }
  }, [filmId, reviewsPage, sortBy, isLoading, reviews.length, totalReviews]);

  const handleLikeReview = useCallback(
    async (id: string) => {
      if (!signedIn) {
        setError("Vui lòng đăng nhập để thích đánh giá");
        return;
      }
      try {
        const response = await ReviewsService.reviewReactionV1({
          requestBody: { type: ReactionType.LIKE, reviewId: id },
        });

        // Update review in state with new like/dislike counts
        setReviews((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  totalLikes: response.data.totalLikes,
                  totalDislikes: response.data.totalDislikes,
                }
              : r,
          ),
        );

        // Also update userReview if it's the same
        if (userReview?.id === id) {
          setUserReview((prev) =>
            prev
              ? {
                  ...prev,
                  totalLikes: response.data.totalLikes,
                  totalDislikes: response.data.totalDislikes,
                }
              : null,
          );
        }
      } catch (err) {
        console.error("Error liking review:", err);
        setError("Không thể thích đánh giá.");
      }
    },
    [signedIn, userReview],
  );

  const handleDislikeReview = useCallback(
    async (id: string) => {
      if (!signedIn) {
        setError("Vui lòng đăng nhập để không thích đánh giá");
        return;
      }
      try {
        const response = await ReviewsService.reviewReactionV1({
          requestBody: { type: ReactionType.DISLIKE, reviewId: id },
        });

        // Update review in state with new like/dislike counts
        setReviews((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  totalLikes: response.data.totalLikes,
                  totalDislikes: response.data.totalDislikes,
                }
              : r,
          ),
        );

        // Also update userReview if it's the same
        if (userReview?.id === id) {
          setUserReview((prev) =>
            prev
              ? {
                  ...prev,
                  totalLikes: response.data.totalLikes,
                  totalDislikes: response.data.totalDislikes,
                }
              : null,
          );
        }
      } catch (err) {
        console.error("Error disliking review:", err);
        setError("Không thể không thích đánh giá.");
      }
    },
    [signedIn, userReview],
  );

  const handleEditReview = useCallback(
    async (id: string, content: string, rating: number) => {
      try {
        await ReviewsService.reviewControllerUpdateV1({
          id,
          requestBody: { content, rating },
        });

        setReviews((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, content, rating, updatedAt: new Date().toISOString() }
              : r,
          ),
        );

        if (userReview?.id === id) {
          setUserReview((prev) =>
            prev
              ? {
                  ...prev,
                  content,
                  rating,
                  updatedAt: new Date().toISOString(),
                }
              : null,
          );
        }
      } catch (err) {
        console.error("Error updating review:", err);
        setError("Không thể cập nhật đánh giá.");
      }
    },
    [userReview],
  );

  const handleDeleteReview = useCallback(
    async (id: string) => {
      if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;

      try {
        await ReviewsService.reviewControllerDeleteV1({ id });
        setReviews((prev) => prev.filter((r) => r.id !== id));
        setTotalReviews((prev) => prev - 1);

        if (userReview?.id === id) {
          setUserReview(null);
        }
      } catch (err) {
        console.error("Error deleting review:", err);
        setError("Không thể xóa đánh giá.");
      }
    },
    [userReview],
  );

  const handleReportReview = useCallback(
    async (id: string, reason?: string, description?: string) => {
      if (!signedIn) {
        setError("Vui lòng đăng nhập để báo cáo đánh giá");
        return;
      }
      try {
        await ReviewsService.reportReviewV1({
          requestBody: {
            reviewId: id,
            reason: reason || ("other" as any),
            description,
          },
        });
        alert("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét đánh giá này.");
      } catch (err: any) {
        console.error("Error reporting review:", err);
        if (err?.response?.status === 400) {
          setError("Bạn đã báo cáo đánh giá này rồi.");
        } else {
          setError("Không thể báo cáo đánh giá.");
        }
      }
    },
    [signedIn],
  );

  // Load comments for a review
  const handleLoadReviewComments = useCallback(
    async (reviewId: string): Promise<CommentDto[]> => {
      try {
        const response = await CommentsService.commentControllerGetAllV1({
          filmId,
          reviewId,
          limit: 50,
        });
        return response.data;
      } catch (err) {
        console.error("Error loading review comments:", err);
        return [];
      }
    },
    [filmId],
  );

  // Submit comment for a review
  const handleSubmitReviewComment = useCallback(
    async (reviewId: string, content: string): Promise<void> => {
      if (!signedIn) {
        setError("Vui lòng đăng nhập để bình luận");
        return;
      }

      const createDto: CreateCommentDto = { content, filmId, reviewId };
      await CommentsService.commentControllerCreateV1({
        requestBody: createDto,
      });

      // Update comment count for the review
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, totalComments: r.totalComments + 1 } : r,
        ),
      );
    },
    [filmId, signedIn],
  );

  // Reply to a comment within a review
  const handleReplyToReviewComment = useCallback(
    async (parentId: string, content: string): Promise<CommentDto | null> => {
      if (!signedIn) {
        setError("Vui lòng đăng nhập để trả lời bình luận");
        return null;
      }

      try {
        const createDto: CreateCommentDto = { content, filmId, parentId };
        const response = await CommentsService.commentControllerCreateV1({
          requestBody: createDto,
        });
        return response.data || null;
      } catch (err) {
        console.error("Error creating reply:", err);
        setError("Không thể gửi phản hồi. Vui lòng thử lại.");
        return null;
      }
    },
    [filmId, signedIn],
  );

  // Calculate rating distribution
  const ratingDistribution = reviews.reduce(
    (acc, review) => {
      const bucket = Math.ceil(review.rating / 2);
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  return (
    <div className="bg-[#0f172a]/50 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-white/5 shadow-2xl animate-fade-in">
      {/* Header with Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <MessageSquare className="text-yellow-500" size={24} />
            {activeTab === "comments" ? "Bình luận" : "Đánh giá"}
            <span className="text-sm font-normal text-gray-500">
              ({activeTab === "comments" ? totalComments : totalReviews})
            </span>
          </h3>

          {/* Tab Switcher */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab("comments")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "comments"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Bình luận
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "reviews"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Đánh giá
            </button>
          </div>
        </div>

        {/* Sort options for reviews */}
        {activeTab === "reviews" && (
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setSortBy("newest")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sortBy === "newest"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Mới nhất
            </button>
            <button
              onClick={() => setSortBy("helpful")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                sortBy === "helpful"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <TrendingUp size={12} /> Hữu ích
            </button>
          </div>
        )}
      </div>

      {/* Rating Summary for Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-white/10">
          <div className="text-center">
            <div className="flex items-center gap-2 mb-2">
              <Star className="text-yellow-400 fill-yellow-400" size={28} />
              <span className="text-3xl font-bold text-white">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-500 text-lg">/10</span>
            </div>
            <p className="text-gray-400 text-sm">{totalReviews} đánh giá</p>
          </div>

          {/* Rating Distribution */}
          <div className="hidden sm:block space-y-1 flex-1 max-w-[200px]">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 w-3">{star * 2}</span>
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
                    style={{
                      width: `${totalReviews > 0 ? ((ratingDistribution[star] || 0) / totalReviews) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-gray-500 w-4">
                  {ratingDistribution[star] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-300 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Section */}
      {activeTab === "comments" ? (
        signedIn ? (
          <div className="mb-8">
            <CommentInput
              userAvatar={currentUserAvatar}
              userName={currentUser?.name}
              placeholder="Chia sẻ cảm nghĩ của bạn về phim..."
              onSubmit={handleSubmitComment}
              isLoading={isSubmitting}
            />
          </div>
        ) : (
          <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
            <p className="text-gray-400 mb-3">
              Đăng nhập để tham gia bình luận
            </p>
            <a
              href="/login"
              className="inline-block px-6 py-2 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Đăng nhập
            </a>
          </div>
        )
      ) : signedIn && !userReview ? (
        <div className="mb-8">
          <ReviewInput
            userAvatar={currentUserAvatar}
            userName={currentUser?.name}
            placeholder="Chia sẻ đánh giá của bạn về phim này..."
            onSubmit={handleSubmitReview}
            isLoading={isSubmitting}
          />
        </div>
      ) : signedIn && userReview ? (
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
          <p className="text-yellow-400 text-sm mb-3 flex items-center gap-2">
            <Star size={16} className="fill-current" />
            Đánh giá của bạn
          </p>
          <ReviewItem
            review={userReview}
            currentUserId={currentUser?.id}
            currentUserAvatar={currentUserAvatar}
            currentUserName={currentUser?.name}
            onLike={handleLikeReview}
            onDislike={handleDislikeReview}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
            onReport={handleReportReview}
            onLoadComments={handleLoadReviewComments}
            onSubmitComment={handleSubmitReviewComment}
            onReplyToComment={handleReplyToReviewComment}
            onLoadReplies={handleLoadReplies}
          />
        </div>
      ) : (
        <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
          <p className="text-gray-400 mb-3">Đăng nhập để đánh giá phim</p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
          >
            Đăng nhập
          </a>
        </div>
      )}

      {/* Content List */}
      <div className="space-y-6">
        {isLoading &&
        (activeTab === "comments"
          ? comments.length === 0
          : reviews.length === 0) ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : activeTab === "comments" ? (
          comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-500">
                Chưa có bình luận nào. Hãy là người đầu tiên!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUser?.id}
                currentUserAvatar={currentUserAvatar}
                currentUserName={currentUser?.name}
                onLike={handleLikeComment}
                onDislike={handleDislikeComment}
                onReply={handleReplyComment}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                onReport={handleReportComment}
                onLoadReplies={handleLoadReplies}
                depth={0}
                maxDepth={4}
              />
            ))
          )
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-500">
              Chưa có đánh giá nào. Hãy là người đầu tiên!
            </p>
          </div>
        ) : (
          reviews
            .filter((r) => r.id !== userReview?.id)
            .map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                currentUserId={currentUser?.id}
                currentUserAvatar={currentUserAvatar}
                currentUserName={currentUser?.name}
                onLike={handleLikeReview}
                onDislike={handleDislikeReview}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                onReport={handleReportReview}
                onLoadComments={handleLoadReviewComments}
                onSubmitComment={handleSubmitReviewComment}
                onReplyToComment={handleReplyToReviewComment}
                onLoadReplies={handleLoadReplies}
              />
            ))
        )}
      </div>

      {/* Load More Button */}
      {((activeTab === "comments" && comments.length < totalComments) ||
        (activeTab === "reviews" && reviews.length < totalReviews)) && (
        <div className="mt-8 text-center">
          <button
            onClick={
              activeTab === "comments"
                ? handleLoadMoreComments
                : handleLoadMoreReviews
            }
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <ChevronDown size={18} />
                Xem thêm (
                {activeTab === "comments"
                  ? totalComments - comments.length
                  : totalReviews - reviews.length}{" "}
                còn lại)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
