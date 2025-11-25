export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-red-600 font-black text-xl mb-4">CINEHUB</h3>
            <p className="text-gray-400 text-sm">Nền tảng phát sóng phim và series trực tuyến hàng đầu.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-white transition">Trang chủ</a></li>
              <li><a href="/movies" className="text-gray-400 hover:text-white transition">Phim Lẻ</a></li>
              <li><a href="/series" className="text-gray-400 hover:text-white transition">Phim Bộ</a></li>
              <li><a href="/billing" className="text-gray-400 hover:text-white transition">Nâng cấp</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Trợ giúp</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Liên hệ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Điều khoản</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Quyền riêng tư</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Theo dõi chúng tôi</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} CineHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}