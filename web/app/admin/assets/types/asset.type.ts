// services/types/asset.type.ts

export interface AssetCategory {
  id: string;
  name: string;
  total: number; // Tổng số lượng thiết bị trong danh mục
  active: number; // Số lượng đang được sử dụng (đã gán vào phòng)
  available: number; // Số lượng còn lại (total - active)
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomAsset {
  status: string;
  assetId: string;
  roomId: string;
  roomNumber: string;
  assetName: string;
  assetQuantity: number;
  assetStatus: "Ổn định" | "Bảo trì" | "Cần sửa chữa";
}

// --- Requests Payload ---
export interface CreateAssetCategoryRequest {
  name: string;
  total: number;
  description?: string;
}

export interface UpdateAssetCategoryRequest {
  name?: string;
  total?: number;
  available?: number;
  description?: string;
}

export interface CreateAssetItemRequest {
  id: string; // Serial Number do mình nhập hoặc quét
  name: string;
  categoryId: string;
  room?: string;
  status?: "Ổn định" | "Bảo trì" | "Cần sửa chữa";
}

export interface UpdateAssetItemRequest {
  name?: string;
  categoryId?: string;
  room?: string;
  status?: "Ổn định" | "Bảo trì" | "Cần sửa chữa";
}
