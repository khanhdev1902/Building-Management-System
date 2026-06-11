import { Controller, Post, Delete, Body, Param } from '@nestjs/common';

import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiResponse } from 'src/common/responses/api-response';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('test/:userId')
  testNotification(@Param('userId') userId: string) {
    this.notificationService.sendToUser(userId);

    return {
      message: 'Notification sent',
    };
  }

  @Post()
  async createNotification(@Body() dto: CreateNotificationDto) {
    console.log(dto);
    const newNotification = await this.notificationService.create(dto);
    return ApiResponse.success(
      newNotification,
      'Tạo thông báo mới thành công!',
      200,
    );
  }

  // @Get(':userId')
  // findByUser(@Param('userId') userId: string) {
  //   return this.notificationService.findMyNotifications(userId);
  // }

  // @Patch(':id/read')
  // markAsRead(@Param('id') id: string) {
  //   return this.notificationService.markAsRead(id);
  // }

  // @Patch('user/:userId/read-all')
  // markAllAsRead(@Param('userId') userId: string) {
  //   return this.notificationService.markAllAsRead(userId);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.delete(id);
  }
}
