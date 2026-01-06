import { AuthService } from "@/services/AuthService";
import {
  setUser,
  signInSuccess,
  signOutSuccess,
  useAppSelector,
  useAppDispatch,
} from "@/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import appConfig from "@/config/app.config";
import type { LoginDto } from "@/types/LoginDto";
import { generatePKCECodes } from "@/utils/pckeCodeGenerate";

type Status = "success" | "failed";

export function useAuth() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [query] = useSearchParams();

  const { signedIn, token } = useAppSelector((state) => state.auth.session);

  const defaultUser = {
    id: "",
    name: "",
    email: "",
    gender: "male" as const,
    avatarUrl: undefined,
    createdAt: "",
    updatedAt: "",
  };

  const verify = async ({ email, otp }: { email: string; otp: string }): Promise<
      | {
        status: string;
        message: string;
      }
    | undefined
  > => {
    try {
      const res = await AuthService.verifyOtp({ email, code: otp });
      if (res.data) {
        const { accessToken, refreshToken } = res.data;
        dispatch(signInSuccess({ accessToken, refreshToken }));
        dispatch(setUser(res.data.user || defaultUser));
        navigate(appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
      }
    } catch (error: any) {
      return {
        status: "failed",
        message: error?.response?.data?.message || error.toString(),
      };
    }
  };

  const login = async (
    values: LoginDto,
  ): Promise<
    | {
        status: Status;
        message: string;
        code?: string;
      }
    | undefined
  > => {
    try {
      const redirectUrl = query.get("redirectUrl");
      const resp = await AuthService.login(values);
      if (resp.data) {
        const { accessToken, refreshToken } = resp.data;
        dispatch(signInSuccess({ accessToken, refreshToken }));
        dispatch(setUser(resp.data.user || defaultUser));

        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
      }
    } catch (errors: any) {
      const errorCode = errors?.response?.data?.code;
      const errorMessage = errors?.response?.data?.message || errors.toString();
      
      return {
        status: "failed",
        message: errorMessage,
        code: errorCode,
      };
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const { code_verifier, code_challenge } = await generatePKCECodes();
      const redirectUrl = query.get("redirectUrl");
      localStorage.setItem("pkce_code_verifier", code_verifier);
      localStorage.setItem("google_oauth_redirect_url", redirectUrl || "");

      const params = new URLSearchParams({
        client_id: appConfig.googleClientId,
        redirect_uri: appConfig.googleRedirectUri,
        response_type: "code",
        scope: "email profile openid",
        code_challenge,
        code_challenge_method: "S256",
        promt: "consent",
      });
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } catch (error: any) {
      console.error("Failed to initiate Google login:", error);
    }
  };

  const handleCallbackGoogleLogin = async (
    authorizationCode: string,
  ): Promise<
    | {
        status: string;
        message: string;
      }
    | undefined
  > => {
    try {
      const codeVerifier = localStorage.getItem("pkce_code_verifier") || "";
      const redirectUrl =
        localStorage.getItem("google_oauth_redirect_url") || "";
      if (!codeVerifier) {
        return {
          status: "failed",
          message: "PKCE code verifier not found.",
        };
      }
      const resp = await AuthService.authControllerGoogleCallbackV1({
        code: authorizationCode,
        codeVerifier,
      });
      if (resp.data) {
        const { accessToken, refreshToken } = resp.data;
        dispatch(signInSuccess({ accessToken, refreshToken }));
        dispatch(setUser(resp.data.user || defaultUser));
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        localStorage.removeItem("pkce_code_verifier");
        localStorage.removeItem("google_oauth_redirect_url");
        return {
          status: "success",
          message: "",
        };
      }
    } catch (error: any) {
      return {
        status: "failed",
        message: error?.response?.data?.message || error.toString(),
      };
    }
  };

  const handleSignOut = () => {
    dispatch(signOutSuccess());
    dispatch(setUser(defaultUser));
    navigate(appConfig.unAuthenticatedEntryPath);
  };

  const signOut = () => {
    handleSignOut();
  };

  return {
    token,
    authenticated: token && signedIn,
    verify,
    login,
    signOut,
    loginWithGoogle,
    handleCallbackGoogleLogin,
  };
}
