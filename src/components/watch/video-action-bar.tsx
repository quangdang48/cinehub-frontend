import React from 'react';
import { 
  Heart, Plus, Film, Users, Share2, Flag,
  HeartOff, Check, X
} from 'lucide-react';

interface VideoActionBarProps {
  isFavorite?: boolean;
  isInWatchlist?: boolean;
  onToggleFavorite?: () => void;
  onAddToWatchlist?: () => void;
  onSkipIntro?: () => void;
  onTheaterMode?: () => void;
  onWatchTogether?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  showSkipIntro?: boolean;
  theaterModeActive?: boolean;
}

export const VideoActionBar: React.FC<VideoActionBarProps> = ({
  isFavorite = false,
  isInWatchlist = false,
  onToggleFavorite,
  onAddToWatchlist,
  onSkipIntro,
  onTheaterMode,
  onWatchTogether,
  onShare,
  onReport,
  showSkipIntro = false,
  theaterModeActive = false,
}) => {
  const actions = [
    {
      icon: isFavorite ? HeartOff : Heart,
      label: 'Yêu thích',
      onClick: onToggleFavorite,
      active: isFavorite,
      activeColor: 'text-red-500',
    },
    {
      icon: isInWatchlist ? Check : Plus,
      label: 'Thêm vào',
      onClick: onAddToWatchlist,
      active: isInWatchlist,
      activeColor: 'text-green-500',
    },
    {
      icon: X,
      label: 'Bỏ qua giới thiệu',
      onClick: onSkipIntro,
      badge: 'OFF',
      show: showSkipIntro,
    },
    {
      icon: Film,
      label: 'Rạp phim',
      onClick: onTheaterMode,
      badge: theaterModeActive ? 'ON' : 'OFF',
    },
    {
      icon: Users,
      label: 'Xem chung',
      onClick: onWatchTogether,
    },
    {
      icon: Share2,
      label: 'Chia sẻ',
      onClick: onShare,
    },
  ];

  return (
    <div className="flex items-center justify-between py-4 border-y border-white/10">
      <div className="flex items-center gap-2 flex-wrap">
        {actions.map((action, index) => {
          if (action.show === false) return null;
          
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                group flex items-center gap-2 px-4 py-2.5 rounded-xl
                transition-all duration-300 
                ${action.active 
                  ? 'bg-white/10 border border-white/20' 
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                }
              `}
            >
              <action.icon 
                className={`w-4 h-4 transition-colors ${
                  action.active ? action.activeColor : 'text-gray-400 group-hover:text-white'
                }`} 
              />
              <span className={`text-sm font-medium ${
                action.active ? 'text-white' : 'text-gray-400 group-hover:text-white'
              }`}>
                {action.label}
              </span>
              {action.badge && (
                <span className={`
                  text-xs font-bold px-1.5 py-0.5 rounded
                  ${action.badge === 'ON' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-white/10 text-gray-500 border border-white/10'
                  }
                `}>
                  {action.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onReport}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
      >
        <Flag className="w-4 h-4" />
        <span className="text-sm font-medium">Báo lỗi</span>
      </button>
    </div>
  );
};
