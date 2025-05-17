export interface Notification {
  id: string;
  title: string;
  body: string;
  scheduledAt: Date;
  createdAt: Date;
  sent: boolean;
}

export interface NotificationFormData {
  title: string;
  body: string;
  minutes: number; // 相対時間（分）
}
