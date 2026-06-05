import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

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
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.notificationService.findMyNotifications(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Patch('user/:userId/read-all')
  markAllAsRead(@Param('userId') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.delete(id);
  }
}
