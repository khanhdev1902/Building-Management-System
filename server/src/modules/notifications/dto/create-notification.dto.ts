import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { NotificationType } from 'src/generated/prisma/enums';

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum NotificationTargetType {
  ALL = 'all',
  ROOM = 'room',
}

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  content!: string;

  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsOptional()
  @IsString()
  actionUrl?: string;

  // @IsEnum(NotificationTargetType)
  @IsString()
  @IsNotEmpty()
  targetType!: string;

  @IsOptional()
  @IsString()
  specificRoom?: string;

  @IsEnum(NotificationPriority)
  priority!: NotificationPriority;
}
