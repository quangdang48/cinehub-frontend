import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { signInSuccess, setUser } from "@/store/slices/auth";
import appConfig from "@/config/app.config";
import type { UserDto } from "@/types/UserDto";

export default function AuthGoogleCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const token = params.get("token");
        const userJson = params.get("user");
        const errorParam = params.get("error");

        // Handle error from Google/Backend
        if (errorParam) {
          setError(`Lỗi đăng nhập: ${errorParam}`);
          setTimeout(() => navigate(appConfig.unAuthenticatedEntryPath), 2000);
          return;
        }

        // Check if we have token
        if (!token) {
          setError("Không tìm thấy token xác thực");
          setTimeout(() => navigate(appConfig.unAuthenticatedEntryPath), 2000);
          return;
        }

        // Dispatch token to Redux
        dispatch(signInSuccess(token));

        // If user info is provided, save to Redux
        if (userJson) {
          try {
            const user: UserDto = JSON.parse(decodeURIComponent(userJson));
            dispatch(setUser(user));
          } catch (parseError) {
            console.error("Failed to parse user data:", parseError);
            // Continue even if user parsing fails, token is saved
          }
        }

        // Redirect to authenticated entry path
        navigate(appConfig.authenticatedEntryPath);
      } catch (err) {
        console.error("Google callback error:", err);
        setError("Lỗi xử lý đăng nhập Google");
        setTimeout(() => navigate(appConfig.unAuthenticatedEntryPath), 2000);
      }
    };

    handleGoogleCallback();
  }, [params, navigate, dispatch]);

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
