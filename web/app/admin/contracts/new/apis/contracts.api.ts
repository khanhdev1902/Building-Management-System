// app/admin/contracts/apis/contract.api.ts

import { API_ENDPOINTS } from "@/services/api-endpoint";
import { apiHandler } from "@/helpers/api.helper";
import http from "@/services/http";

import {
  GetAllContractsResponse,
  CreateContractRequest,
} from "../types/contract.type";

const getAllContracts = () =>
  apiHandler<GetAllContractsResponse>(http.get(API_ENDPOINTS.CONTRACTS));

const getContractById = (id: string) =>
  apiHandler(http.get(API_ENDPOINTS.CONTRACT_DETAIL(id)));
const getContractTenantById = (id: string) =>
  apiHandler(http.get(API_ENDPOINTS.CONTRACT_TENANT(id)));

const exportContractPdf = async (id: string) => {
  const response = await http.get(API_ENDPOINTS.EXPORT_CONTRACT_PDF(id), {
    responseType: "blob",
  });

  return response.data;
};

const createContract = (data: CreateContractRequest) =>
  apiHandler(http.post(API_ENDPOINTS.CONTRACTS, data));

// const updateContract = (
//   id: string,
//   data: UpdateContractRequest,
// ) =>
//   apiHandler<Contract>(
//     http.patch(API_ENDPOINTS.CONTRACT_DETAIL(id), data),
//   );

const deleteContract = (id: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiHandler<any>(http.delete(API_ENDPOINTS.CONTRACT_DETAIL(id)));

const renewContract = (id: string, duration: number) =>
  apiHandler(
    http.patch(API_ENDPOINTS.CONTRACT_RENEW(id), {
      duration,
    }),
  );

const terminateContract = (id: string, reason?: string) =>
  apiHandler(
    http.patch(API_ENDPOINTS.CONTRACT_TERMINATE(id), {
      reason,
    }),
  );

export const contractApi = {
  getAllContracts,
  getContractById,
  createContract,
  getContractTenantById,
  // updateContract,
  exportContractPdf,
  deleteContract,
  renewContract,
  terminateContract,
};
