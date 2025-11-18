import React, { useState } from 'react';
import { User, Star } from 'lucide-react';
import { Button } from '@/components/common';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  rating: number;
  createdAt: string;
  likes: number;
}

interface CommentSectionProps {
  filmId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ filmId: _filmId }) => {
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      user: {
        name: 'Vũ Năng Đằng Khoa',
        avatar: '/avatar-placeholder.jpg',
      },
      content: 'Phim rất hay và ấn tượng! Diễn xuất tuyệt vời, cốt truyện cuốn hút từ đầu đến cuối.',
      rating: 5,
      createdAt: '2024-11-15',
      likes: 74,
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Add comment logic here
    console.log('Submit comment:', { content: newComment, rating });
    setNewComment('');
  };

  return (
    <div className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <h3 className="text-2xl font-bold mb-6">Bình luận ({comments.length})</h3>

        {/* Comment Form */}
        <div className="mb-8">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center">
                  <User size={24} className="text-neutral-400" />
                </div>
              </div>

              {/* Input Area */}
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận của bạn..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />

                {/* Rating & Submit */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400">Đánh giá:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            size={24}
                            className={
                              star <= rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-neutral-600'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="md"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!newComment.trim()}
                  >
                    Đăng
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center">
                  <User size={24} className="text-neutral-400" />
                </div>
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="bg-neutral-900 rounded-lg p-4">
                  {/* User Info & Rating */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{comment.user.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {/* Rating Stars */}
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={
                                star <= comment.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-neutral-600'
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-neutral-500">
                          {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-neutral-300 mb-3 leading-relaxed">{comment.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 text-sm">
                    <button className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition">
                      Bình luận ({comment.likes})
                    </button>
                    <button className="text-neutral-400 hover:text-white transition">
                      Đánh giá
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
