import { Notification, NotificationFormData } from '@/types/notification';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Firestoreのコレクション名
const NOTIFICATIONS_COLLECTION = 'notifications';

// 通知を登録する関数
export async function scheduleNotification(data: NotificationFormData): Promise<string> {
  try {
    // 現在時刻を取得
    const now = new Date();

    // 指定された分数後の時刻を計算
    const scheduledAt = new Date(now.getTime() + data.minutes * 60 * 1000);

    // Firestoreに保存するデータを作成
    const notificationData = {
      title: data.title,
      body: data.body,
      scheduledAt: Timestamp.fromDate(scheduledAt),
      createdAt: Timestamp.fromDate(now),
      sent: false,
    };

    // Firestoreに保存
    const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), notificationData);

    return docRef.id;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw new Error('通知の登録に失敗しました');
  }
}

// 送信予定の通知を取得する関数
export async function getPendingNotifications(): Promise<Notification[]> {
  try {
    const now = new Date();

    // 現在時刻以前で、まだ送信されていない通知を取得
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('scheduledAt', '<=', Timestamp.fromDate(now)),
      where('sent', '==', false)
    );

    const querySnapshot = await getDocs(q);

    // 結果を配列に変換
    const notifications: Notification[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({
        id: doc.id,
        title: data.title,
        body: data.body,
        scheduledAt: data.scheduledAt.toDate(),
        createdAt: data.createdAt.toDate(),
        sent: data.sent,
      });
    });

    return notifications;
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    throw new Error('通知の取得に失敗しました');
  }
}

// 通知を送信済みにマークする関数
export async function markNotificationAsSent(notificationId: string): Promise<void> {
  try {
    const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(notificationRef, {
      sent: true,
    });
  } catch (error) {
    console.error('Error marking notification as sent:', error);
    throw new Error('通知の更新に失敗しました');
  }
}
