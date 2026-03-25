import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  login() {
    console.log({ DB_URL: process.env.DATABASE_URL });
    return { DB_URL: process.env.DATABASE_URL, system: 'welcome sys!' };
  }
}
