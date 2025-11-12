import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("access_token", token);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [params, navigate]);

  return <p>Đang đăng nhập bằng Google...</p>;
}
