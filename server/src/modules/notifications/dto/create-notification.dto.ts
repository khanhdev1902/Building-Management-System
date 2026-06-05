import { type NotificationType } from 'src/generated/prisma/enums';

export class CreateNotificationDto {
  userId!: string;
  title!: string;
  content!: string;
  type!: NotificationType;
  actionUrl?: string;
}
