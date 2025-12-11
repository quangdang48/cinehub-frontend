import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Avatar } from './avatar';

interface ReviewInputProps {
  userAvatar?: string;
  userName?: string;
  placeholder?: string;
  onSubmit: (content: string, rating: number) => void;
  isLoading?: boolean;
  initialRating?: number;
}

export const ReviewInput: React.FC<ReviewInputProps> = ({
  userAvatar,
  userName = 'Bạn',
  placeholder = 'Viết đánh giá của bạn về phim...',
  onSubmit,
  isLoading = false,
  initialRating = 0,
}) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (content.trim() && rating > 0 && !isLoading) {
      onSubmit(content.trim(), rating);
      setContent('');
      setRating(0);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="cursor-pointer transition-transform hover:scale-110"
          >
            <Star
              size={24}
              className={`transition-colors ${
                star <= (hoverRating || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-600 hover:text-gray-500'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = () => {
    const r = hoverRating || rating;
    if (r === 0) return 'Chọn điểm đánh giá';
    if (r <= 2) return 'Rất tệ';
    if (r <= 4) return 'Tệ';
    if (r <= 5) return 'Tạm được';
    if (r <= 7) return 'Hay';
    if (r <= 9) return 'Rất hay';
    return 'Tuyệt vời';
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex gap-4 mb-4">
        <div className="w-12 h-12 shrink-0">
          <Avatar src={userAvatar} alt={userName} size="sm" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-bold mb-3">Đánh giá của bạn</h4>
          <div className="flex items-center gap-4 mb-4">
            {renderStars()}
            <span className={`text-sm font-medium ${(hoverRating || rating) > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
              {(hoverRating || rating) > 0 && <span className="mr-2">{hoverRating || rating}/10</span>}
              {getRatingText()}
            </span>
          </div>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full bg-white/5 text-gray-200 text-sm p-4 rounded-xl border border-white/10 focus:border-yellow-500 focus:outline-none resize-none placeholder-gray-600 mb-4"
        disabled={isLoading}
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {!rating && <span className="text-yellow-500">* </span>}
          Vui lòng chọn điểm đánh giá trước khi gửi
        </p>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || rating === 0 || isLoading}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            content.trim() && rating > 0 && !isLoading
              ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20'
              : 'bg-white/10 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
              Đang gửi...
            </>
          ) : (
            <>
              Gửi đánh giá <Send size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
