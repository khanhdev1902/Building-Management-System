export interface Tenant {
  name: string;
  phone: string;
  startDate: string;
  endDate: string;
}

export interface RoomServices {
  electricity: number;
  water: number;
  [key: string]: number;
}

export interface RoomResponse {
  id: string;
  roomNumber: string;
  type: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  roomPrice: number;
  floor: number;
  acreage: number;
  tenant: Tenant | null;
  services: RoomServices;
  lastReading: {
    electric: number;
    water: number;
  };
  amenities: string[];
  serviceId: string[];
  description?: string;
  maxOccupants: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoomRequest {
  roomNumber: string;

  type: string;

  roomPrice: number;

  floor: number;

  acreage: number;

  maxOccupants: number;

  services: RoomServices;

  amenities: string[];

  description?: string;
}

export type UpdateRoomRequest = Partial<CreateRoomRequest> & {
  status?: RoomResponse["status"];
};
