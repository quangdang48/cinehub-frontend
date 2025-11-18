import React, { useState } from 'react';

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

export const CommentSection: React.FC<CommentSectionProps> = ({ filmId }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: {
        name: 'Vũ Năng Đằng Khoa',
        avatar: '/avatar-placeholder.jpg',
      },
      content: 'Phim rất hay và ấn tượng!',
      rating: 5,
      createdAt: '2024-11-15',
      likes: 74,
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Add comment logic here
    console.log('Submit comment:', { content: newComment, rating });
    setNewComment('');
  };

  return (
    <div className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Comment Form */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Bình luận ({comments.length})</h3>

          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận của bạn..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Đánh giá:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <svg
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'text-yellow-500'
                                : 'text-gray-600'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                    disabled={!newComment.trim()}
                  >
                    Đăng
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{comment.user.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= comment.rating
                                  ? 'text-yellow-500'
                                  : 'text-gray-600'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-3">{comment.content}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white transition">
                      <span className="px-2 py-1 bg-gray-800 rounded">
                        Bình luận ({comment.likes})
                      </span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white transition">
                      <span>Đánh giá</span>
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
