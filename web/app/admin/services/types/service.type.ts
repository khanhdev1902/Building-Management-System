export interface ServiceResponse {
  id: string;
  name: string;
  type?: string;
  price: number;
  unit: string;
  status: string;
  iconKey: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceRequest {
  name: string;
  type?: string;
  price: number;
  unit: string;
  status: string;
  iconKey?: string;
  description?: string;
}

// Update thì cho phép optional hết các field
export type UpdateServiceRequest = Partial<CreateServiceRequest>;
