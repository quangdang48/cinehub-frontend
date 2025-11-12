export default function ContinueWatchingTab() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Xem tiếp</h2>
        <p className="text-gray-400 text-sm">Các phim bạn đang xem dở</p>
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
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Chưa có phim nào đang xem
        </h3>
        <p className="text-gray-400 mb-6">
          Bắt đầu xem phim để theo dõi tiến trình
        </p>
        <button className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition">
          Khám phá phim
        </button>
      </div>
    </div>
  );
}
