import { LoginRequest, RegisterRequest } from "../types/auth.type";
import { API_ENDPOINTS } from "@/services/api-endpoint";
import { apiHandler } from "@/helpers/api.helper";
import http from "@/services/http";
import axios from "axios";

const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const refreshToken = () =>
  apiHandler(refreshClient.post(API_ENDPOINTS.REFRESH_TOKEN));

const login = (data: LoginRequest) =>
  apiHandler(http.post(API_ENDPOINTS.LOGIN, data));
const logout = () => apiHandler(http.post(API_ENDPOINTS.LOGOUT));
const register = (data: RegisterRequest) =>
  apiHandler(http.post(API_ENDPOINTS.REGISTER, data));
const getProfile = () => apiHandler(http.get(API_ENDPOINTS.PROFILE));
const getMe = () => apiHandler(http.get(API_ENDPOINTS.ME));

export const authApi = {
  login,
  register,
  getProfile,
  refreshToken,
  logout,
  getMe,
};
