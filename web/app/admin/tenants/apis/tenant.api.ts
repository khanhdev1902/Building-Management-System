import { API_ENDPOINTS } from "@/services/api-endpoint";
import { apiHandler } from "@/helpers/api.helper";
import http from "@/services/http";

import {
  Tenant,
  GetAllTenantsResponse,
  CreateTenantRequest,
//   UpdateTenantRequest,
} from "../types/tenant.type";

const getAllTenants = () =>
  apiHandler<GetAllTenantsResponse>(http.get(API_ENDPOINTS.TENANTS));

const getTenantById = (id: string) =>
  apiHandler<Tenant>(http.get(API_ENDPOINTS.TENANT_DETAIL(id)));

const createTenant = (data: CreateTenantRequest) =>
  apiHandler(http.post(API_ENDPOINTS.TENANTS, data));

// const updateTenant = (id: string, data: UpdateTenantRequest) =>
//   apiHandler<Tenant>(http.patch(API_ENDPOINTS.TENANT_DETAIL(id), data));

const deleteTenant = (id: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiHandler<any>(http.delete(API_ENDPOINTS.TENANT_DETAIL(id)));

export const tenantApi = {
  getAllTenants,
  getTenantById,
  createTenant,
//   updateTenant,
  deleteTenant,
};
