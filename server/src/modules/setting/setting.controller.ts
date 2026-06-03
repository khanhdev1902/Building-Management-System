import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { SettingService } from './setting.service';
import { ApiResponse } from 'src/common/responses/api-response';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateInvoiceSettingDto } from './dto/update-invoice-setting.dto';

@Controller('setting')
export class SettingController {
  constructor(private settingService: SettingService) {}

  @Get()
  async getSetting() {
    const setting = await this.settingService.getSetting();
    return ApiResponse.success(
      setting,
      'Lấy thông tin cài đặt thành công',
      200,
    );
  }

  @Post()
  async createDefaultSetting(@Body() dto: CreateSettingDto) {
    const setting = await this.settingService.createDefaultSetting(dto);
    return ApiResponse.success(setting, 'Tạo cài đặt mặc định thành công', 200);
  }

  @Patch()
  async updateInvoiceSetting(@Body() dto: UpdateInvoiceSettingDto) {
    const setting = await this.settingService.updateInvoiceSetting(dto);
    return ApiResponse.success(
      setting,
      'Cập nhật cài đặt hóa đơn thành công',
      200,
    );
  }
}
