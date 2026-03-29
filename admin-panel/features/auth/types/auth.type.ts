type LoginRequest = {
  email?: string;
  phone?: string;
  password: string;
};

type RegisterRequest = LoginRequest & {
  firstName: string;
  lastName: string;
  role: string;
};

export type { LoginRequest, RegisterRequest };
