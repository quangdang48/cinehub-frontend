import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks";

export default function AuthGoogleCallbackPage() {
  const [params] = useSearchParams();
  const authorizationCode = params.get("code");

  const { handleCallbackGoogleLogin } = useAuth();

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (authorizationCode) {
      handleCallbackGoogleLogin(authorizationCode).then((result) => {
        if (result?.status === "failed") {
          setError("Lỗi");
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        }
      });
    } else {
      setError("Không tìm thấy mã ủy quyền.");
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <p className="text-gray-400">Đang quay lại trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <p className="text-white mt-4">Đang đăng nhập với Google...</p>
      </div>
    </div>
  );
}
