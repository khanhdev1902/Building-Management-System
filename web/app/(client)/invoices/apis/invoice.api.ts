import { API_ENDPOINTS } from "@/services/api-endpoint";
import { apiHandler } from "@/helpers/api.helper";
import http from "@/services/http";

import { Invoice, GetAllInvoicesResponse } from "../types/invoice.type";

const getAllInvoiceTenant = (userId: string) =>
  apiHandler<GetAllInvoicesResponse>(
    http.get(API_ENDPOINTS.INVOICES_TENANT(userId)),
  );

const generateInvoices = () =>
  apiHandler<GetAllInvoicesResponse>(
    http.post(API_ENDPOINTS.INVOICES_GENERATE),
  );

const getInvoiceById = (id: string) =>
  apiHandler<Invoice>(http.get(API_ENDPOINTS.INVOICE_DETAIL(id)));

const deleteInvoice = (id: string) =>
  apiHandler(http.delete(API_ENDPOINTS.INVOICE_DETAIL(id)));

const exportInvoicePdf = async (id: string) => {
  const response = await http.get(API_ENDPOINTS.EXPORT_INVOICE_PDF(id), {
    responseType: "blob",
  });

  return response.data;
};

export const invoiceApi = {
  exportInvoicePdf,
  getAllInvoiceTenant,
  getInvoiceById,
  deleteInvoice,
  generateInvoices,
};
