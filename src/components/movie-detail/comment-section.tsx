import React, { useState, useCallback, useEffect } from 'react';
import { MessageSquare, ChevronDown, AlertCircle } from 'lucide-react';
import type { CommentDto } from '@/types/CommentDto';
import type { CreateCommentDto } from '@/types/CreateCommentDto';
import { ReactionType } from '@/types/CommentReactionDto';
import { ReportReason } from '@/types/CommentReportDto';
import { CommentItem, CommentInput } from '@/components/common';
import { CommentsService } from '@/services/CommentsService';
import { useAppSelector } from '@/store';

interface CommentSectionProps {
  filmId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ 
  filmId,
}) => {
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const signedIn = useAppSelector((state) => state.auth.session.signedIn);
  const currentUser = useAppSelector((state) => state.auth.user);

  // Fetch comments when component mounts or filmId changes
  useEffect(() => {
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
        setTotal(response.totalItems);
        setPage(1);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Không thể tải bình luận. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [filmId]);

  const handleSubmitComment = useCallback(async (content: string) => {
    if (!signedIn) {
      setError('Vui lòng đăng nhập để bình luận');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const createDto: CreateCommentDto = {
        content,
        filmId,
      };

      const response = await CommentsService.commentControllerCreateV1({
        requestBody: createDto,
      });

      if (response.data) {
        setComments(prev => [response.data, ...prev]);
        setTotal(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error creating comment:', err);
      setError('Không thể gửi bình luận. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }, [filmId, signedIn]);

  // Handle reply to any comment (nested replies)
  const handleReply = useCallback(async (parentId: string, content: string): Promise<CommentDto | null> => {
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

      if (response.data) {
        // Update reply count for parent comment in root level
        setComments(prev => prev.map(c => 
          c.id === parentId 
            ? { ...c, totalReplies: c.totalReplies + 1 }
            : c
        ));
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Error creating reply:', err);
      setError('Không thể gửi phản hồi. Vui lòng thử lại.');
      return null;
    }
  }, [filmId, signedIn]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || comments.length >= total) return;

    setIsLoading(true);
    try {
      const response = await CommentsService.commentControllerGetAllV1({
        filmId,
        page: page + 1,
        limit: 10,
      });

      setComments(prev => [...prev, ...response.data]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error loading more comments:', err);
      setError('Không thể tải thêm bình luận.');
    } finally {
      setIsLoading(false);
    }
  }, [filmId, page, isLoading, comments.length, total]);

  const handleLike = useCallback(async (id: string) => {
    if (!signedIn) {
      setError('Vui lòng đăng nhập để thích bình luận');
      return;
    }
    try {
      const response = await CommentsService.commentReactionV1({
        requestBody: { type: ReactionType.LIKE, commentId: id },
      });
      
      // Update comment in state with new like/dislike counts
      setComments(prev => prev.map(c =>
        c.id === id 
          ? { ...c, totalLikes: response.data.totalLikes, totalDislikes: response.data.totalDislikes }
          : c
      ));
    } catch (err) {
      console.error('Error liking comment:', err);
      setError('Không thể thích bình luận.');
    }
  }, [signedIn]);

  const handleDislike = useCallback(async (id: string) => {
    if (!signedIn) {
      setError('Vui lòng đăng nhập để không thích bình luận');
      return;
    }
    try {
      const response = await CommentsService.commentReactionV1({
        requestBody: { type: ReactionType.DISLIKE, commentId: id },
      });
      
      // Update comment in state with new like/dislike counts
      setComments(prev => prev.map(c =>
        c.id === id 
          ? { ...c, totalLikes: response.data.totalLikes, totalDislikes: response.data.totalDislikes }
          : c
      ));
    } catch (err) {
      console.error('Error disliking comment:', err);
      setError('Không thể không thích bình luận.');
    }
  }, [signedIn]);

  const handleEdit = useCallback(async (id: string, content: string) => {
    try {
      await CommentsService.commentControllerUpdateV1({
        id,
        requestBody: { content },
      });

      setComments(prev => prev.map(c =>
        c.id === id ? { ...c, content, updatedAt: new Date().toISOString() } : c
      ));
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Không thể cập nhật bình luận.');
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

    try {
      await CommentsService.commentControllerDeleteV1({ id });
      setComments(prev => prev.filter(c => c.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Không thể xóa bình luận.');
    }
  }, []);

  const handleReport = useCallback(async (id: string, reason?: ReportReason, description?: string) => {
    if (!signedIn) {
      setError('Vui lòng đăng nhập để báo cáo bình luận');
      return;
    }
    try {
      await CommentsService.reportCommentV1({
        requestBody: {
          commentId: id,
          reason: reason || ReportReason.OTHER,
          description,
        },
      });
      alert('Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét bình luận này.');
    } catch (err: any) {
      console.error('Error reporting comment:', err);
      if (err?.response?.status === 400) {
        setError('Bạn đã báo cáo bình luận này rồi.');
      } else {
        setError('Không thể báo cáo bình luận.');
      }
    }
  }, [signedIn]);

  // Load replies for a comment
  const handleLoadReplies = useCallback(async (parentId: string): Promise<CommentDto[]> => {
    try {
      const response = await CommentsService.commentControllerGetAllV1({
        filmId,
        parentId,
        limit: 50, // Load all replies
      });
      return response.data;
    } catch (err) {
      console.error('Error loading replies:', err);
      return [];
    }
  }, [filmId]);

  // Get current user avatar URL
  const currentUserAvatar = currentUser 
    ? currentUser.gender === 'male'
      ? `https://randomuser.me/api/portraits/men/${Math.abs(currentUser.id.charCodeAt(0) % 99)}.jpg`
      : `https://randomuser.me/api/portraits/women/${Math.abs(currentUser.id.charCodeAt(0) % 99)}.jpg`
    : undefined;

  if (isLoading && comments.length === 0) {
    return (
      <div className="bg-[#0f172a]/50 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-white/5 shadow-2xl animate-fade-in">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải bình luận...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a]/50 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-white/5 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="text-yellow-500" size={24} />
          Bình luận cộng đồng <span className="text-sm font-normal text-gray-500">({total})</span>
        </h3>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-300 hover:text-white">×</button>
        </div>
      )}

      {signedIn ? (
        <div className="mb-10">
          <CommentInput
            userAvatar={currentUserAvatar}
            userName={currentUser.name}
            placeholder="Chia sẻ cảm nghĩ của bạn về phim..."
            onSubmit={handleSubmitComment}
            isLoading={isSubmitting}
          />
        </div>
      ) : (
        <div className="mb-10 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
          <p className="text-gray-400 mb-3">Đăng nhập để tham gia bình luận</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-2 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
          >
            Đăng nhập
          </a>
        </div>
      )}

      <div className="space-y-8">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUser?.id}
              currentUserAvatar={currentUserAvatar}
              currentUserName={currentUser?.name}
              onLike={handleLike}
              onDislike={handleDislike}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReport={handleReport}
              onLoadReplies={handleLoadReplies}
              depth={0}
              maxDepth={4} // Allow 4 levels of nested replies
            />
          ))
        )}
      </div>

      {comments.length < total && (
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
                Xem thêm bình luận ({total - comments.length} còn lại)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
