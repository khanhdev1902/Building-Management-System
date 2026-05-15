import { API_ENDPOINTS } from "@/services/api-endpoint";
import { apiHandler } from "@/helpers/api.helper";
import http from "@/services/http";
import {
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceResponse,
} from "../types/service.type";

const getAllServices = () =>
  apiHandler(http.get(API_ENDPOINTS.SERVICES));

const getServiceById = (id: string) =>
  apiHandler<ServiceResponse>(http.get(API_ENDPOINTS.SERVICE_DETAIL(id)));

const createService = (data: CreateServiceRequest) =>
  apiHandler<ServiceResponse>(http.post(API_ENDPOINTS.SERVICES, data));

const updateService = (id: string, data: UpdateServiceRequest) =>
  apiHandler<ServiceResponse>(
    http.patch(API_ENDPOINTS.SERVICE_DETAIL(id), data),
  );

const deleteService = (id: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiHandler<any>(http.delete(API_ENDPOINTS.SERVICE_DETAIL(id)));

export const serviceApi = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
