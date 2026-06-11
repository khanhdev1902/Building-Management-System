import { API_ENDPOINTS } from "@/services/api-endpoint";
import { apiHandler } from "@/helpers/api.helper";
import http from "@/services/http";
import { NotificationFormValues } from "../schemas/notification.schema";

const getAllNotifications = () =>
  apiHandler(http.get(API_ENDPOINTS.NOTIFICATIONS));

const createNewNotification = (data: NotificationFormValues) =>
  apiHandler(http.post(API_ENDPOINTS.NOTIFICATIONS, data));

export const notificationApi = {
  getAllNotifications,
  createNewNotification,
};
