import React, { useState, useCallback, useEffect } from 'react';
import { Star, ChevronDown, AlertCircle, TrendingUp } from 'lucide-react';
import type { ReviewDto } from '@/types/ReviewDto';
import type { CommentDto } from '@/types/CommentDto';
import type { CreateReviewDto } from '@/types/CreateReviewDto';
import type { CreateCommentDto } from '@/types/CreateCommentDto';
import { ReviewItem, ReviewInput } from '@/components/common';
import { ReviewsService } from '@/services/ReviewsService';
import { CommentsService } from '@/services/CommentsService';
import { useAppSelector } from '@/store';

interface ReviewSectionProps {
  filmId: string;
  averageRating?: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  filmId,
  averageRating = 0,
}) => {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'helpful'>('newest');
  const [error, setError] = useState<string | null>(null);
  const [userReview, setUserReview] = useState<ReviewDto | null>(null);

  const signedIn = useAppSelector((state) => state.auth.session.signedIn);
  const currentUser = useAppSelector((state) => state.auth.user);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const response = await ReviewsService.reviewControllerGetAllV1({
          filmId,
          page: 1,
          limit: 10,
          sort: sortBy === 'newest' ? '{"createdAt":"DESC"}' : '{"totalLikes":"DESC"}',
        });

        setReviews(response.data);
        setTotal(response.totalItems);
        
        // Check if current user already has a review
        if (currentUser?.id) {
          const existingReview = response.data.find(r => r.author.id === currentUser.id);
          setUserReview(existingReview || null);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Không thể tải đánh giá. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [filmId, sortBy, currentUser?.id]);

  const handleSubmitReview = useCallback(async (content: string, rating: number) => {
    if (!signedIn) {
      setError('Vui lòng đăng nhập để đánh giá');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const createDto: CreateReviewDto = {
        content,
        rating,
        filmId,
      };

      const response = await ReviewsService.reviewControllerCreateV1({
        requestBody: createDto,
      });

      if (response.data) {
        setReviews(prev => [response.data, ...prev]);
        setTotal(prev => prev + 1);
        setUserReview(response.data);
      }
    } catch (err) {
      console.error('Error creating review:', err);
      setError('Không thể gửi đánh giá. Có thể bạn đã đánh giá phim này rồi.');
    } finally {
      setIsSubmitting(false);
    }
  }, [filmId, signedIn]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || reviews.length >= total) return;

    setIsLoading(true);
    try {
      const response = await ReviewsService.reviewControllerGetAllV1({
        filmId,
        page: page + 1,
        limit: 10,
        sort: sortBy === 'newest' ? '{"createdAt":"DESC"}' : '{"totalLikes":"DESC"}',
      });

      setReviews(prev => [...prev, ...response.data]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error loading more reviews:', err);
      setError('Không thể tải thêm đánh giá.');
    } finally {
      setIsLoading(false);
    }
  }, [filmId, page, sortBy, isLoading, reviews.length, total]);

  const handleLike = useCallback(async (id: string) => {
    if (!signedIn) {
      setError('Vui lòng đăng nhập để thích đánh giá');
      return;
    }
    // TODO: Implement like API when available
    console.log('Like review:', id);
  }, [signedIn]);

  const handleDislike = useCallback(async (id: string) => {
    if (!signedIn) {
      setError('Vui lòng đăng nhập để không thích đánh giá');
      return;
    }
    // TODO: Implement dislike API when available
    console.log('Dislike review:', id);
  }, [signedIn]);

  const handleEdit = useCallback(async (id: string, content: string, rating: number) => {
    try {
      await ReviewsService.reviewControllerUpdateV1({
        id,
        requestBody: { content, rating },
      });

      setReviews(prev => prev.map(r =>
        r.id === id ? { ...r, content, rating, updatedAt: new Date().toISOString() } : r
      ));
      
      if (userReview?.id === id) {
        setUserReview(prev => prev ? { ...prev, content, rating, updatedAt: new Date().toISOString() } : null);
      }
    } catch (err) {
      console.error('Error updating review:', err);
      setError('Không thể cập nhật đánh giá.');
    }
  }, [userReview]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;

    try {
      await ReviewsService.reviewControllerDeleteV1({ id });
      setReviews(prev => prev.filter(r => r.id !== id));
      setTotal(prev => prev - 1);
      
      if (userReview?.id === id) {
        setUserReview(null);
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Không thể xóa đánh giá.');
    }
  }, [userReview]);

  const handleReport = useCallback((id: string) => {
    console.log('Report review:', id);
    alert('Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét đánh giá này.');
  }, []);

  // Load comments for a review
  const handleLoadComments = useCallback(async (reviewId: string): Promise<CommentDto[]> => {
    try {
      const response = await CommentsService.commentControllerGetAllV1({
        filmId,
        reviewId,
        limit: 50, // Load all comments
      });
      return response.data;
    } catch (err) {
      console.error('Error loading review comments:', err);
      return [];
    }
  }, [filmId]);

  // Submit comment for a review
  const handleSubmitComment = useCallback(async (reviewId: string, content: string): Promise<void> => {
    if (!signedIn) {
      setError('Vui lòng đăng nhập để bình luận');
      return;
    }

    const createDto: CreateCommentDto = {
      content,
      filmId,
      reviewId,
    };

    await CommentsService.commentControllerCreateV1({
      requestBody: createDto,
    });

    // Update comment count for the review
    setReviews(prev => prev.map(r =>
      r.id === reviewId
        ? { ...r, totalComments: r.totalComments + 1 }
        : r
    ));
  }, [filmId, signedIn]);

  // Reply to a comment within a review (nested replies)
  const handleReplyToComment = useCallback(async (parentId: string, content: string): Promise<CommentDto | null> => {
    if (!signedIn) {
      setError('Vui lòng đăng nhập để trả lời bình luận');
      return null;
    }

    try {
      const createDto: CreateCommentDto = {
        content,
        filmId,
        parentId,
      };

      const response = await CommentsService.commentControllerCreateV1({
        requestBody: createDto,
      });

      return response.data || null;
    } catch (err) {
      console.error('Error creating reply:', err);
      setError('Không thể gửi phản hồi. Vui lòng thử lại.');
      return null;
    }
  }, [filmId, signedIn]);

  // Load replies for a comment (nested comments)
  const handleLoadReplies = useCallback(async (parentId: string): Promise<CommentDto[]> => {
    try {
      const response = await CommentsService.commentControllerGetAllV1({
        filmId,
        parentId,
        limit: 50,
      });
      return response.data;
    } catch (err) {
      console.error('Error loading replies:', err);
      return [];
    }
  }, [filmId]);

  // Get current user avatar
  const currentUserAvatar = currentUser
    ? currentUser.gender === 'male'
      ? `https://randomuser.me/api/portraits/men/${Math.abs(currentUser.id.charCodeAt(0) % 99)}.jpg`
      : `https://randomuser.me/api/portraits/women/${Math.abs(currentUser.id.charCodeAt(0) % 99)}.jpg`
    : undefined;

  // Calculate rating distribution
  const ratingDistribution = reviews.reduce((acc, review) => {
    const bucket = Math.ceil(review.rating / 2); // Convert 1-10 to 1-5 buckets
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="bg-[#0f172a]/50 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-white/5 shadow-2xl animate-fade-in">
      {/* Header with Rating Summary */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-2 mb-2">
              <Star className="text-yellow-400 fill-yellow-400" size={32} />
              <span className="text-4xl font-bold text-white">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500 text-lg">/10</span>
            </div>
            <p className="text-gray-400 text-sm">{total} đánh giá</p>
          </div>

          {/* Rating Distribution */}
          <div className="hidden lg:block space-y-1.5 min-w-[200px]">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 w-3">{star * 2}</span>
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${total > 0 ? ((ratingDistribution[star] || 0) / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-gray-500 w-6">{ratingDistribution[star] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-end">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'newest'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mới nhất
            </button>
            <button
              onClick={() => setSortBy('helpful')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                sortBy === 'helpful'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp size={14} /> Hữu ích
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-300 hover:text-white">×</button>
        </div>
      )}

      {/* Review Input - Only show if user hasn't reviewed yet */}
      {signedIn && !userReview ? (
        <div className="mb-10">
          <ReviewInput
            userAvatar={currentUserAvatar}
            userName={currentUser.name}
            placeholder="Chia sẻ đánh giá của bạn về phim này..."
            onSubmit={handleSubmitReview}
            isLoading={isSubmitting}
          />
        </div>
      ) : signedIn && userReview ? (
        <div className="mb-10 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
          <p className="text-yellow-400 text-sm mb-3 flex items-center gap-2">
            <Star size={16} className="fill-current" />
            Đánh giá của bạn
          </p>
          <ReviewItem
            review={userReview}
            currentUserId={currentUser.id}
            currentUserAvatar={currentUserAvatar}
            currentUserName={currentUser.name}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLoadComments={handleLoadComments}
            onSubmitComment={handleSubmitComment}
            onReplyToComment={handleReplyToComment}
            onLoadReplies={handleLoadReplies}
          />
        </div>
      ) : (
        <div className="mb-10 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
          <p className="text-gray-400 mb-3">Đăng nhập để đánh giá phim</p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
          >
            Đăng nhập
          </a>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading && reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải đánh giá...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-500">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          reviews
            .filter(r => r.id !== userReview?.id) // Don't show user's review again in list
            .map(review => (
              <ReviewItem
                key={review.id}
                review={review}
                currentUserId={currentUser?.id}
                currentUserAvatar={currentUserAvatar}
                currentUserName={currentUser?.name}
                onLike={handleLike}
                onDislike={handleDislike}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReport={handleReport}
                onLoadComments={handleLoadComments}
                onSubmitComment={handleSubmitComment}
                onReplyToComment={handleReplyToComment}
                onLoadReplies={handleLoadReplies}
              />
            ))
        )}
      </div>

      {/* Load More Button */}
      {reviews.length < total && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                Đang tải...
              </>
            ) : (
              <>
                <ChevronDown size={18} />
                Xem thêm đánh giá ({total - reviews.length} còn lại)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
