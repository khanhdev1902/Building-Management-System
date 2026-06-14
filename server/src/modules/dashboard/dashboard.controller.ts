import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiResponse } from 'src/common/responses/api-response';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard() {
    const res = await this.dashboardService.getDashboardTenant('111111');
    return ApiResponse.success(
      res,
      'Lấy data dashboard tenant thành công!',
      200,
    );
  }
  @Get('tenant/:userId')
  async getDashboardTenant(@Param('userId') userId: string) {
    const res = await this.dashboardService.getDashboardTenant(userId);
    return ApiResponse.success(
      res,
      'Lấy data dashboard tenant thành công!',
      200,
    );
  }
}
