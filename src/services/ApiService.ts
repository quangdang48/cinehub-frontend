import axios, { AxiosError } from "axios";
import appConfig from "@/config/app.config";
import deepParseJson from "@/utils/deepParseJson";
import store, { signOutSuccess, updateTokens } from "@/store";
import { toast } from "sonner";

const unauthorizedCode = [401];

const ApiService = axios.create({
  timeout: 60000,
  baseURL: appConfig.apiPrefix,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

ApiService.interceptors.request.use(
  (config) => {
    if ((config as any).authRequired === false) {
      return config;
    }
    let accessToken: string | null = null;
    const { auth } = store.getState();
    accessToken = auth?.session?.token || null;
    if (!accessToken) {
      const rawPersistData = localStorage.getItem("cinehub-root");
      if (rawPersistData) {
        const persistData = deepParseJson(rawPersistData);
        accessToken = (persistData as any)?.auth?.session?.token || null;
      }
    }
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

ApiService.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const { response, config } = error;
    const originalRequest = config as any;

    if (response && unauthorizedCode.includes(response.status) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return ApiService(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { auth } = store.getState();
      const refreshToken = auth?.session?.refreshToken;

      if (!refreshToken) {
        store.dispatch(signOutSuccess());
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return Promise.reject(error);
      }

      try {
        const refreshApi = axios.create({
          timeout: 60000,
          baseURL: appConfig.apiPrefix,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await refreshApi.post("/auth/refresh-token", { token: refreshToken });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        store.dispatch(updateTokens({ 
          accessToken, 
          refreshToken: newRefreshToken 
        }));

        processQueue(null, accessToken);
        
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;
        return ApiService(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(signOutSuccess());
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default ApiService;
