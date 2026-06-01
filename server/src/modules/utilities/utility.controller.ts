import { Body, Controller, Get, Post } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { ApiResponse } from 'src/common/responses/api-response';
import { CreateMeterReadingDto } from './dto/create-metter-reading';

@Controller('/utilities')
export class UtilityController {
  constructor(private utilityService: UtilityService) {}

  @Get()
  async getLstUtilities() {
    const lstUtilities = await this.utilityService.getLstUtilities();
    return ApiResponse.success(
      lstUtilities,
      'Lấy danh sách chỉ số điện nước thành công',
      200,
    );
  }

  @Post()
  async createMeterReading(@Body() dto: CreateMeterReadingDto) {
    const newReading = await this.utilityService.createMeterReading(dto);
    return ApiResponse.success(
      newReading,
      'Tạo bản ghi điện nước mới thành công!',
      200,
    );
  }
}
