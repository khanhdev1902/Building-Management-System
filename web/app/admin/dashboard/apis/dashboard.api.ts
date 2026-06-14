import { API_ENDPOINTS } from "@/services/api-endpoint";
import { apiHandler } from "@/helpers/api.helper";
import http from "@/services/http";

const getDashboardTenantData = (userId: string) =>
  apiHandler(http.get(API_ENDPOINTS.DASHBOARD_TENANT(userId)));

export const dashboardApi = {
  getDashboardTenantData,
};
