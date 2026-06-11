export interface CreateNotification {
  userId?: string;
  title: string;
  content: string;
  type: string;
  actionUrl?: string;
  targetType?: string;
  specificRom?: string;
  priority?: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: "finance" | "maintenance" | "life" | string;
  priority: "low" | "high" | string;
  status: "sent" | "scheduled" | "draft" | string;
  target: string;
  createdAt: string;
  stats: {
    read: number;
    sent: number;
  };
}
