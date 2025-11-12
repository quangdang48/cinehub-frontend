export default function ListsTab() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Danh sách</h2>
          <p className="text-gray-400 text-sm">Các danh sách phim của bạn</p>
        </div>
        <button className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition">
          + Tạo danh sách mới
        </button>
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Chưa có danh sách nào
        </h3>
        <p className="text-gray-400">
          Tạo danh sách để sắp xếp các bộ phim của bạn
        </p>
      </div>
    </div>
  );
}
