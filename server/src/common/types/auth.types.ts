import { Request } from 'express';
import { UserRole } from 'src/generated/prisma/enums';

export type JwtPayload = {
  sub: string; //userId
  role: UserRole;
};

export type AuthUser = {
  id: string;
  phone: string;
  email?: string;
  role: UserRole;
};

export interface RequestWithUser extends Request {
  user: AuthUser;
}
