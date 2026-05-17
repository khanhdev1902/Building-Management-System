import { API_ENDPOINTS } from "@/services/api-endpoint";
import { apiHandler } from "@/helpers/api.helper";
import http from "@/services/http";
import {
  CreateRoomRequest,
  UpdateRoomRequest,
  RoomResponse,
} from "../types/room.type";

const getAllRooms = () => apiHandler(http.get(API_ENDPOINTS.ROOMS));

const getRoomById = (id: string) =>
  apiHandler<RoomResponse>(http.get(API_ENDPOINTS.ROOM_DETAIL(id)));

const createRoom = (data: CreateRoomRequest) =>
  apiHandler(http.post(API_ENDPOINTS.ROOMS, data));

const updateRoom = (id: string, data: UpdateRoomRequest) =>
  apiHandler<RoomResponse>(http.patch(API_ENDPOINTS.ROOM_DETAIL(id), data));

const deleteRoom = (id: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiHandler<any>(http.delete(API_ENDPOINTS.ROOM_DETAIL(id)));

export const roomApi = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
