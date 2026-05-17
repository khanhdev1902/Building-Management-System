import { API_ENDPOINTS } from "@/services/api-endpoint";
import { apiHandler } from "@/helpers/api.helper";
import http from "@/services/http";
import {
  AssetCategory,
  AssetItem,
  CreateAssetCategoryRequest,
  UpdateAssetCategoryRequest,
  CreateAssetItemRequest,
  UpdateAssetItemRequest,
} from "../types/asset.type";

const getAllAssets = () => apiHandler(http.get(API_ENDPOINTS.ASSETS));
const getAssetById = (id: string) =>
  apiHandler(http.get(API_ENDPOINTS.ASSET_DETAIL(id)));
const createAsset = (data: CreateAssetCategoryRequest) =>
  apiHandler(http.post(API_ENDPOINTS.ASSETS, data));
const updateAsset = (id: string, data: UpdateAssetCategoryRequest) =>
  apiHandler<AssetCategory>(
    http.patch(API_ENDPOINTS.ASSET_DETAIL(id), data),
  );

const deleteAsset = (id: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiHandler<any>(http.delete(API_ENDPOINTS.ASSET_DETAIL(id)));

// --- Assets --------------------------------------------------------------
const getAllRoomAssets = () =>
  apiHandler<AssetItem[]>(http.get(API_ENDPOINTS.ASSETS));
const getRoomAssetById = (id: string) =>
  apiHandler<AssetItem>(http.get(API_ENDPOINTS.ASSET_DETAIL(id)));
const createRoomAsset = (data: CreateAssetItemRequest) =>
  apiHandler<AssetItem>(http.post(API_ENDPOINTS.ASSETS, data));
const updateRoomAsset = (id: string, data: UpdateAssetItemRequest) =>
  apiHandler<AssetItem>(http.patch(API_ENDPOINTS.ASSET_DETAIL(id), data));
const deleteRoomAsset = (id: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiHandler<any>(http.delete(API_ENDPOINTS.ASSET_DETAIL(id)));

export const assetApi = {
  // Assets
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,

  // RoomAssets
  getAllRoomAssets,
  getRoomAssetById,
  createRoomAsset,
  updateRoomAsset,
  deleteRoomAsset,
};
