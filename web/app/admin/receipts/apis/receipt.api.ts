import { API_ENDPOINTS } from "@/services/api-endpoint";
import { apiHandler } from "@/helpers/api.helper";
import http from "@/services/http";

const getAllReceipts = () => apiHandler(http.get("/receipts"));

export const receiptApi = {
  getAllReceipts,
};
