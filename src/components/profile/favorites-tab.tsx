export default function FavoritesTab() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Yêu thích</h2>
        <p className="text-gray-400 text-sm">Danh sách phim yêu thích của bạn</p>
      </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
          <svg
            className="w-10 h-10 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Chưa có phim yêu thích
        </h3>
        <p className="text-gray-400 mb-6">
          Bắt đầu thêm các bộ phim yêu thích của bạn
        </p>
        <button className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition">
          Khám phá phim
        </button>
      </div>
    </div>
  );
}
