import React, { useState } from 'react';
import { User, Star, MessageSquare, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { CommentDto } from '@/types/CommentDto';
import { timeAgo } from '@/utils/time';

interface CommentSectionProps {
  comments: CommentDto[];
  total: number;
  onLoadMore?: () => void;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, total, onLoadMore }) => {
  return (
    <div className="bg-[#0f172a]/50 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-white/5 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
           <MessageSquare className="text-yellow-500" size={24}/>
           Bình luận cộng đồng <span className="text-sm font-normal text-gray-500">({total})</span>
        </h3>
      </div>

      <div className="relative mb-10 group">
        <div className="absolute -inset-0.5 bg-linear-to-r from-yellow-500 to-orange-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
        <div className="relative bg-[#020617] rounded-2xl p-4">
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-700 shrink-0 border border-gray-600"></div>
              <textarea 
               placeholder="Chia sẻ cảm nghĩ của bạn về phim..." 
               className="w-full bg-transparent text-gray-200 text-sm focus:outline-none resize-none h-16 placeholder-gray-600"
              ></textarea>
           </div>
           <div className="flex justify-end mt-2">
              <button className="bg-white/10 hover:bg-yellow-500 hover:text-black text-white px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                 Gửi bình luận <Send size={14}/>
              </button>
           </div>
        </div>
      </div>

      <div className="space-y-8">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-4 group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-yellow-500 transition-colors shrink-0 shadow-lg">
               <img src={'https://randomuser.me/api/portraits/men/1.jpg'} alt={comment.author.name} className="w-full h-full object-cover"/>
            </div>
            <div className="flex-1">
               <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                  <span className="text-white font-bold text-base group-hover:text-yellow-400 transition-colors">{comment.author.name}</span>
                  {/* {comment.rank && (
                     <span className="text-[10px] bg-linear-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/30 font-bold uppercase tracking-wider">
                        {comment.rank}
                     </span>
                  )} */}
                  <span className="text-gray-500 text-xs">{timeAgo(comment.createdAt)}</span>
               </div>
               <p className="text-gray-300 text-sm mb-3 leading-relaxed bg-white/5 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-white/5 hover:bg-white/10 transition-colors">
                  {comment.content}
               </p>
               
               <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
                  <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                     <ThumbsUp size={14}/> {comment.totalLikes}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                     <ThumbsDown size={14}/> {comment.totalDislikes}
                  </button>
                  <button className="hover:text-yellow-400 transition-colors">Trả lời</button>
                  <button className="hover:text-white transition-colors">Báo cáo</button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
