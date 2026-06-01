import { API_ENDPOINTS } from "@/services/api-endpoint";
import { apiHandler } from "@/helpers/api.helper";
import http from "@/services/http";

import {
  Utility,
  GetAllUtilitiesResponse,
  CreateUtilityRequest,
  CreateMeterReadingRequest,
} from "../types/utility.type";

const getAllUtilities = () =>
  apiHandler<GetAllUtilitiesResponse>(http.get(API_ENDPOINTS.UTILITIES));

const getUtilityByRoomId = (roomId: string) =>
  apiHandler<Utility>(http.get(API_ENDPOINTS.UTILITY_DETAIL(roomId)));

const createMeterReading = (data: CreateMeterReadingRequest) =>
  apiHandler(http.post(API_ENDPOINTS.UTILITIES, data));

const createUtility = (data: CreateUtilityRequest) =>
  apiHandler(http.post(API_ENDPOINTS.UTILITIES, data));

export const utilityApi = {
  getAllUtilities,
  getUtilityByRoomId,
  createMeterReading,
  createUtility,
};
