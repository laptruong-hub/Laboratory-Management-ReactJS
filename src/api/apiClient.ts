import axios, { type AxiosError } from "axios";
import { getToken, setToken, getRememberMe, clearAllAuthData } from "../utils/storage";

const BASE_URL = 'http://localhost:8000';


const apiPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//  CHẶN REQUEST (TRƯỚC KHI GỬI ĐI)
// Nhiệm vụ: Tự động gắn Access Token vào header
apiClient.interceptors.request.use(
  (config) => {
    // Check both localStorage and sessionStorage
    const token = getToken("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  CHẶN RESPONSE (SAU KHI NHẬN VỀ)
// Nhiệm vụ: Tự động refresh token nếu gặp lỗi 401 (Token hết hạn)
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

apiClient.interceptors.response.use(
  // Nếu Response thành công (2xx), trả về response
  (response) => response,

  // Nếu Response thất bại (4xx, 5xx)
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Chỉ xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token from storage (checks both localStorage and sessionStorage)
        const refreshToken = getToken("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }
        const rs = await apiPublic.post("/api/auth/refresh", {
          refreshToken: refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = rs.data;

        // Preserve the original "Remember Me" preference when refreshing tokens
        const rememberMe = getRememberMe();
        setToken("accessToken", newAccessToken, rememberMe);
        setToken("refreshToken", newRefreshToken, rememberMe);

        apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (_error) {
        processQueue(_error, null);
        // Clear all auth data from both storages
        clearAllAuthData();
        // Use window.location for interceptor since we're outside React context
        window.location.href = "/auth/login";
        return Promise.reject(_error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient, apiPublic };
