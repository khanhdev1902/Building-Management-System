// services/apis/asset.api.ts
import axios from "axios"; // Hoặc import instance axios của anh (vd: @/shared/api/axios)
import { AssetCategory } from "../types/asset.type";

const API_URL = "/api/asset-categories"; // Thay bằng URL backend thực tế của anh

export const assetApi = {
  /**
   * Lấy tất cả danh mục thiết bị (Điều hòa, Tủ lạnh...)
   */
  getCategories: async () => {
    return axios.get<AssetCategory[]>(API_URL);
  },

  /**
   * Lấy chi tiết một danh mục theo ID
   */
  getCategoryById: async (id: string) => {
    return axios.get<AssetCategory>(`${API_URL}/${id}`);
  },

  /**
   * Tạo mới một loại thiết bị
   */
  createCategory: async (name: string) => {
    return axios.post<AssetCategory>(API_URL, { name });
  },

  /**
   * Cập nhật tên hoặc thông tin danh mục
   */
  updateCategory: async (id: string, name: string) => {
    return axios.put<AssetCategory>(`${API_URL}/${id}`, { name });
  },

  /**
   * Xóa danh mục (Cẩn thận: nên check xem có phòng nào đang dùng không)
   */
  deleteCategory: async (id: string) => {
    return axios.delete(`${API_URL}/${id}`);
  },

  /**
   * API bổ sung: Gán thiết bị vào phòng cụ thể
   */
  assignAssetToRoom: async (roomId: string, assetIds: string[]) => {
    return axios.post(`/api/rooms/${roomId}/assets`, { assetIds });
  },
};
