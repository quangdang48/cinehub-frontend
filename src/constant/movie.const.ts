export interface MovieOptions {
  value: string;
  label: string;
  slug?: string;
}

// Danh sách thể loại
export const GENRE_LIST: MovieOptions[] = [
  { value: "anime", label: "Anime", slug: "anime" },
  { value: "bi-an", label: "Bí Ẩn", slug: "bi-an" },
  { value: "chien-tranh", label: "Chiến Tranh", slug: "chien-tranh" },
  { value: "chieu-rap", label: "Chiếu Rạp", slug: "chieu-rap" },
  { value: "chuyen-the", label: "Chuyển Thể", slug: "chuyen-the" },
  { value: "chinh-kich", label: "Chính Kịch", slug: "chinh-kich" },
  { value: "chinh-luan", label: "Chính Luận", slug: "chinh-luan" },
  { value: "chinh-tri", label: "Chính Trị", slug: "chinh-tri" },
  { value: "chuong-trinh-truyen-hinh", label: "Chương Trình Truy...", slug: "chuong-trinh-truyen-hinh" },
  { value: "concert-film", label: "Concert Film", slug: "concert-film" },
  { value: "cung-dau", label: "Cung Đấu", slug: "cung-dau" },
  { value: "cuoi-tuan", label: "Cuối Tuần", slug: "cuoi-tuan" },
  { value: "cach-mang", label: "Cách Mạng", slug: "cach-mang" },
  { value: "co-trang", label: "Cổ Trang", slug: "co-trang" },
  { value: "co-tich", label: "Cổ Tích", slug: "co-tich" },
  { value: "co-dien", label: "Cổ Điển", slug: "co-dien" },
  { value: "dc", label: "DC", slug: "dc" },
  { value: "disney", label: "Disney", slug: "disney" },
  { value: "gay-can", label: "Gay Cấn", slug: "gay-can" },
  { value: "gia-dinh", label: "Gia Đình", slug: "gia-dinh" },
  { value: "giang-sinh", label: "Giáng Sinh", slug: "giang-sinh" },
  { value: "gia-tuong", label: "Giả Tưởng", slug: "gia-tuong" },
  { value: "hoang-cung", label: "Hoàng Cung", slug: "hoang-cung" },
  { value: "hoat-hinh", label: "Hoạt Hình", slug: "hoat-hinh" },
  { value: "hai", label: "Hài", slug: "hai" },
  { value: "hanh-dong", label: "Hành Động", slug: "hanh-dong" },
  { value: "hinh-su", label: "Hình Sự", slug: "hinh-su" },
  { value: "hoc-duong", label: "Học Đường", slug: "hoc-duong" },
  { value: "khoa-hoc", label: "Khoa Học", slug: "khoa-hoc" },
  { value: "kinh-di", label: "Kinh Dị", slug: "kinh-di" },
  { value: "kinh-dien", label: "Kinh Điển", slug: "kinh-dien" },
  { value: "kich-noi", label: "Kịch Nói", slug: "kich-noi" },
  { value: "ky-ao", label: "Kỳ Ảo", slug: "ky-ao" },
  { value: "lgbt+", label: "LGBT+", slug: "lgbt" },
  { value: "live-action", label: "Live Action", slug: "live-action" },
  { value: "lang-man", label: "Lãng Mạn", slug: "lang-man" },
  { value: "lich-su", label: "Lịch Sử", slug: "lich-su" },
  { value: "marvel", label: "Marvel", slug: "marvel" },
  { value: "mien-vien-tay", label: "Miền Viễn Tây", slug: "mien-vien-tay" },
  { value: "nghe-nghiep", label: "Nghề Nghiệp", slug: "nghe-nghiep" },
  { value: "nguoi-mau", label: "Người Mẫu", slug: "nguoi-mau" },
  { value: "nhac-kich", label: "Nhạc Kịch", slug: "nhac-kich" },
  { value: "phieu-luu", label: "Phiêu Lưu", slug: "phieu-luu" },
  { value: "phep-thuat", label: "Phép Thuật", slug: "phep-thuat" },
  { value: "sieu-anh-hung", label: "Siêu Anh Hùng", slug: "sieu-anh-hung" },
  { value: "thieu-nhi", label: "Thiếu Nhi", slug: "thieu-nhi" },
  { value: "than-thoai", label: "Thần Thoại", slug: "than-thoai" },
  { value: "the-thao", label: "Thể Thao", slug: "the-thao" },
  { value: "truyen-hinh-thuc-te", label: "Truyền Hình Thực...", slug: "truyen-hinh-thuc-te" },
  { value: "tuoi-tre", label: "Tuổi Trẻ", slug: "tuoi-tre" },
  { value: "tai-lieu", label: "Tài Liệu", slug: "tai-lieu" },
  { value: "tam-ly", label: "Tâm Lý", slug: "tam-ly" },
  { value: "tinh-cam", label: "Tình Cảm", slug: "tinh-cam" },
  { value: "tap-luyen", label: "Tập Luyện", slug: "tap-luyen" },
  { value: "vien-tuong", label: "Viễn Tưởng", slug: "vien-tuong" },
  { value: "vo-thuat", label: "Võ Thuật", slug: "vo-thuat" },
  { value: "xuyen-khong", label: "Xuyên Không", slug: "xuyen-khong" },
  { value: "dau-thuong", label: "Đau Thương", slug: "dau-thuong" },
  { value: "doi-thuong", label: "Đời Thường", slug: "doi-thuong" },
  { value: "am-thuc", label: "Ẩm Thực", slug: "am-thuc" },
];

// Danh sách quốc gia
export const COUNTRY_LIST: MovieOptions[] = [
  { value: "vn", label: "Việt Nam", slug: "viet-nam" },
  { value: "us", label: "Mỹ", slug: "my" },
  { value: "kr", label: "Hàn Quốc", slug: "han-quoc" },
  { value: "cn", label: "Trung Quốc", slug: "trung-quoc" },
  { value: "jp", label: "Nhật Bản", slug: "nhat-ban" },
  { value: "th", label: "Thái Lan", slug: "thai-lan" },
  { value: "hk", label: "Hồng Kông", slug: "hong-kong" },
  { value: "tw", label: "Đài Loan", slug: "dai-loan" },
  { value: "uk", label: "Anh", slug: "anh" },
  { value: "fr", label: "Pháp", slug: "phap" },
  { value: "de", label: "Đức", slug: "duc" },
  { value: "in", label: "Ấn Độ", slug: "an-do" },
  { value: "ph", label: "Philippines", slug: "philippines" },
  { value: "id", label: "Indonesia", slug: "indonesia" },
  { value: "au", label: "Úc", slug: "uc" },
  { value: "ca", label: "Canada", slug: "canada" },
  { value: "es", label: "Tây Ban Nha", slug: "tay-ban-nha" },
  { value: "it", label: "Ý", slug: "y" },
  { value: "ru", label: "Nga", slug: "nga" },
  { value: "br", label: "Brazil", slug: "brazil" },
  { value: "mx", label: "Mexico", slug: "mexico" },
  { value: "other", label: "Khác", slug: "khac" },
];

// Loại phim
export const FILM_TYPES: MovieOptions[] = [
  { value: "all", label: "Tất cả", slug: "all" },
  { value: "movie", label: "Phim lẻ", slug: "movie" },
  { value: "series", label: "Phim bộ", slug: "series" },
];

// Xếp hạng tuổi
export const RATINGS: MovieOptions[] = [
  { value: "", label: "Tất cả", slug: "all" },
  { value: "P", label: "P (Mọi lứa tuổi)", slug: "P" },
  { value: "K", label: "K (Dưới 13 tuổi)", slug: "K" },
  { value: "T13", label: "T13 (13 tuổi trở lên)", slug: "T13" },
  { value: "T16", label: "T16 (16 tuổi trở lên)", slug: "T16" },
  { value: "T18", label: "T18 (18 tuổi trở lên)", slug: "T18" },
];

// Phiên bản
export const VERSIONS: MovieOptions[] = [
  { value: "", label: "Tất cả", slug: "all" },
  { value: "sub", label: "Phụ đề", slug: "sub" },
  { value: "dub", label: "Lồng tiếng", slug: "dub" },
  { value: "dub-north", label: "Thuyết minh giọng Bắc", slug: "dub-north"   },
  { value: "dub-south", label: "Thuyết minh giọng Nam", slug: "dub-south" },
];

// Năm sản xuất
export const YEARS: MovieOptions[] = [
  { value: "", label: "Tất cả", slug: "all" },
  { value: "2025", label: "2025", slug: "2025" },
  { value: "2024", label: "2024", slug: "2024" },
  { value: "2023", label: "2023", slug: "2023" },
  { value: "2022", label: "2022", slug: "2022" },
  { value: "2021", label: "2021", slug: "2021" },
  { value: "2020", label: "2020", slug: "2020" },
  { value: "2019", label: "2019", slug: "2019" },
  { value: "2018", label: "2018", slug: "2018" },
  { value: "2017", label: "2017", slug: "2017" },
  { value: "2016", label: "2016", slug: "2016" },
  { value: "2015", label: "2015", slug: "2015" },
  { value: "2014", label: "2014", slug: "2014" },
  { value: "2013", label: "2013", slug: "2013" },
  { value: "2012", label: "2012", slug: "2012" },
  { value: "2011", label: "2011", slug: "2011" },
  { value: "2010", label: "2010", slug: "2010" },
];

// Sắp xếp
export const SORT_OPTIONS: MovieOptions[] = [
  { value: "newest", label: "Mới nhất", slug: "newest" },
  { value: "updated", label: "Mới cập nhật", slug: "updated" },
  { value: "imdb", label: "Điểm IMDb", slug: "imdb" },
  { value: "views", label: "Lượt xem", slug: "views" },
];