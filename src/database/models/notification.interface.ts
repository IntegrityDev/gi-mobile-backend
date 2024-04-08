export interface Notification {
  id: number;
  createdAt: Date;
  identification: string;
  isRead: boolean;
  message: string;
  title: string;
}