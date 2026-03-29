import { authApi } from "@/features/auth/apis/auth.api";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const http: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/v1/",
  timeout: 180000,
  withCredentials: true,
});

if (process.env.NODE_ENV === "development") {
  console.log("HTTP Client Base URL:", http.defaults.baseURL);
}

// ================= REQUEST =================
http.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ================= RESPONSE =================
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const accessToken = useAuthStore.getState().accessToken;

    if (error.response?.status !== 401) throw error;
    if (!accessToken) throw error;
    if (originalRequest._retry) throw error;

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(http(originalRequest));
        });
      });
    }
    isRefreshing = true;

    try {
      // gọi refresh bằng client riêng
      const res = await authApi.refreshToken();
      const newAccessToken = res.data.accessToken;

      //cập nhật Zustand
      const { setAccessToken } = useAuthStore.getState();
      setAccessToken(newAccessToken);

      //chạy lại các request đang chờ
      onRefreshed(newAccessToken);

      // retry request cũ
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return http(originalRequest);
    } catch (err) {
      handleLogout();
      throw err;
    } finally {
      isRefreshing = false;
    }
  },
);

// ================= LOGOUT =================
function handleLogout() {
  const { logout } = useAuthStore.getState();
  logout();
  console.log("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  //nếu muốn redirect
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export default http;
