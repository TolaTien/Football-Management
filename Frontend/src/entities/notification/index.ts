export { NotificationsService } from './api/notificationService';
export type { NotificationItem } from './api/notificationService';
export {
  default as notificationReducer,
  addNotification,
  clearNotifications,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from './model/notificationSlice';
