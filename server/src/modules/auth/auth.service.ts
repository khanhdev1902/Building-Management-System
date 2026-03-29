import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại!');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isMatch) throw new BadRequestException('Mật khẩu không chính xác!');

    const payload: JwtPayload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async register(dto: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (user) throw new UnauthorizedException('Số điện thoại đã tồn tại!');

    const saltRounds = 10;
    const pwHash = await bcrypt.hash(dto.password, saltRounds);
    const newUser = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        passwordHash: pwHash,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = newUser;
    return { result, register: 'register success!' };
  }

  logout(userId: string) {
    return { userId, logout: 'called logout success!' };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return { result, getProfile: 'called getProfile success!' };
  }

  refreshToken(dto: RefreshTokenDto) {
    // const { refreshToken } = dto;
    return { dto, refreshToken: 'called refresh success!' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException('Người dùng không tồn tại!');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashed },
    });

    return { message: 'Đổi mật khẩu thành công' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: 'Nếu email tồn tại, link reset đã được gửi' };
    }

    // tạo token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // hash token để lưu DB (an toàn hơn)
    // const hashedToken = crypto
    //   .createHash('sha256')
    //   .update(resetToken)
    //   .digest('hex');

    // set expire (10 phút)
    // const expire = new Date(Date.now() + 10 * 60 * 1000);

    // await this.prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     resetToken: hashedToken,
    //     resetTokenExpire: expire,
    //   },
    // });

    // 👉 link gửi email
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // TODO: gửi email (tạm console)
    console.log('Reset link:', resetLink);

    return {
      message: 'Nếu email tồn tại, link reset đã được gửi',
    };
  }

  resetPassword(dto: ResetPasswordDto) {
    // const { token, newPassword, confirmPassword } = dto;

    // check confirm password
    // if (newPassword !== confirmPassword) {
    //   throw new BadRequestException('Mật khẩu xác nhận không khớp');
    // }

    // hash token để so sánh
    // const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // const user = await this.prisma.user.findFirst({
    //   where: {
    //     resetToken: hashedToken,
    //     resetTokenExpire: {
    //       gte: new Date(), // chưa hết hạn
    //     },
    //   },
    // });

    // if (!user) {
    //   throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    // }

    // // hash password mới
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // await this.prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     password: hashedPassword,
    //     resetToken: null,
    //     resetTokenExpire: null,
    //   },
    // });

    return { dto, message: 'Đổi mật khẩu thành công' };
  }
}
