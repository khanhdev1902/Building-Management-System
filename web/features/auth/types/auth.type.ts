type LoginRequest = {
  email?: string;
  phone?: string;
  password: string;
};

type RegisterRequest = LoginRequest & {
  firstName: string;
  lastName: string;
  role: string;
  password: string;
};

type UserCurrent = {
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
};

export type { LoginRequest, RegisterRequest, UserCurrent };
