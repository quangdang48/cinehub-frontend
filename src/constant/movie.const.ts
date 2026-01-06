export interface MovieOptions {
  value: string;
  label: string;
  slug?: string;
}

export const PAGE_TITLES: Record<string, string> = {
  "phim-le": "Phim lẻ",
  "phim-bo": "Phim bộ",
  "filter": "Duyệt phim",
};

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

export const FILM_TYPES: MovieOptions[] = [
  { value: "", label: "Tất cả", slug: "" },
  { value: "movie", label: "Phim lẻ", slug: "movie" },
  { value: "series", label: "Phim bộ", slug: "series" },
];

export const RATINGS: MovieOptions[] = [
  { value: "", label: "Tất cả", slug: "" },
  { value: "P", label: "P (Mọi lứa tuổi)", slug: "P" },
  { value: "K", label: "K (Dưới 13 tuổi)", slug: "K" },
  { value: "T13", label: "T13 (13 tuổi trở lên)", slug: "T13" },
  { value: "T16", label: "T16 (16 tuổi trở lên)", slug: "T16" },
  { value: "T18", label: "T18 (18 tuổi trở lên)", slug: "T18" },
];

export const YEARS: MovieOptions[] = [
  { value: "", label: "Tất cả", slug: "" },
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

export const SORT_OPTIONS: MovieOptions[] = [
  { value: "", label: "Không", slug: "" },
  { value: "newest", label: "Mới nhất", slug: "newest" },
  { value: "updated", label: "Mới cập nhật", slug: "updated" },
  { value: "imdb", label: "Điểm IMDb", slug: "imdb" },
  { value: "views", label: "Lượt xem", slug: "views" },
];
