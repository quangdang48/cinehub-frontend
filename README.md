# Cinehub Frontend

Dự án Frontend cho website xem phim Cinehub, được xây dựng bằng ReactJS, TypeScript và Vite.

## Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo máy của bạn đã cài đặt:

- [Node.js](https://nodejs.org/) (phiên bản 18 trở lên được khuyến nghị)
- Trình quản lý gói: `npm`, `yarn` hoặc `pnpm` (khuyến khích dùng `pnpm` hoặc `yarn`).

## Cài đặt

1.  **Clone dự án:**

    ```bash
    git clone <repository-url>
    cd cinehub-frontend
    ```

2.  **Cài đặt các thư viện phụ thuộc:**

    ```bash
    # Sử dụng npm
    npm install

    # Hoặc sử dụng yarn
    yarn install

    # Hoặc sử dụng pnpm
    pnpm install
    ```

## Cấu hình môi trường

Dự án cần một số biến môi trường để hoạt động.

1.  Sao chép file mẫu `.env.example` thành `.env`:

    ```bash
    cp .env.example .env
    ```

2.  Cập nhật giá trị cho các biến trong file `.env` vừa tạo. Dưới đây là ý nghĩa các biến:

    - `VITE_API_URL`: Đường dẫn API của Backend chính (mặc định: `http://localhost:8080/api/v1`).
    - `BACKEND_ADMIN_API`: Đường dẫn API cho Admin/Service khác (nếu có) (mặc định: `http://localhost:3322/api/v1`).
    - `VITE_GOOGLE_CLIENT_ID`: Client ID từ Google Cloud Console để dùng tính năng đăng nhập Google (để trống nếu chưa cần).
    - `VITE_GOOGLE_REDIRECT_URI`: Đường dẫn redirect sau khi đăng nhập Google (mặc định cho local: `http://localhost:5173/auth/google/callback`).

## Chạy dự án (Local Development)

Sau khi cài đặt và cấu hình xong, chạy lệnh sau để khởi động server development:

```bash
npm run dev
# hoặc yarn dev / pnpm dev
```

Truy cập trình duyệt tại địa chỉ: `http://localhost:5173`.

## Các Scripts khác

Các lệnh có sẵn trong `package.json`:

- `npm run build`: Build dự án cho môi trường production.
- `npm run lint`: Kiểm tra lỗi cú pháp và style code với ESLint.
- `npm run preview`: Chạy thử bản build production trên local.
- `npm run sync:openapi`: Đồng bộ và tạo code API client từ Swagger/OpenAPI của Backend.
