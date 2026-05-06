import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/common/types/auth.types';
import { ApiResponse } from 'src/common/responses/api-response';

import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(dto);
    const auth = await this.authService.login(dto);
    res.cookie('refreshToken', auth.refreshToken, {
      httpOnly: true,
      secure: false, // production: true
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày (milliseconds)
    });
    return ApiResponse.success(auth, 'Xác thực thành công', 200);
  }

  @Post('refresh-token')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException(
        'Không tìm thấy Refresh Token trong Cookie',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = await this.authService.refreshTokens(refreshToken);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false, // production: true
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày (milliseconds)
    });
    return ApiResponse.success(result, 'Lấy Access Token mới thành công', 200);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.logout(req.user.id);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false, // production: true
      sameSite: 'strict',
    });

    return ApiResponse.message(result.message, 200);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Req() req: RequestWithUser, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    const userInforCurrent = await this.authService.getMe(req.user.id);
    return ApiResponse.success(
      userInforCurrent,
      'lấy thông tin người dùng hiện tại thành công!',
      200,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    const result = await this.authService.getProfile(req.user.id);
    return ApiResponse.success(result, 'lấy thông tin hồ sơ thành công!', 200);
  }
}
