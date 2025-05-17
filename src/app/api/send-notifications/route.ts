import { NextResponse } from 'next/server';
import { getPendingNotifications, markNotificationAsSent } from '@/utils/notification';

// GET: 送信予定の通知を取得して送信するAPI
// このAPIはCloud Schedulerから1分ごとに呼び出されることを想定
export async function GET() {
  try {
    // 認証（実際の環境では適切な認証を実装してください）
    // const authHeader = request.headers.get('authorization');
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    // }

    // const token = authHeader.substring(7);
    // if (token !== process.env.API_SECRET_KEY) {
    //   return NextResponse.json({ error: '無効な認証トークンです' }, { status: 403 });
    // }

    // 送信予定の通知を取得
    const notifications = await getPendingNotifications();

    if (notifications.length === 0) {
      return NextResponse.json({ message: '送信予定の通知はありません' });
    }

    // 各通知を処理
    const results = await Promise.all(
      notifications.map(async (notification) => {
        try {
          // 実際の環境では、ここでWeb Push APIを使用して通知を送信します
          // このサンプルでは、通知を送信済みとしてマークするだけです
          await markNotificationAsSent(notification.id);

          return {
            id: notification.id,
            status: 'success',
            message: `通知「${notification.title}」を送信しました`,
          };
        } catch (error) {
          console.error(`Error sending notification ${notification.id}:`, error);
          return {
            id: notification.id,
            status: 'error',
            message: '通知の送信に失敗しました',
          };
        }
      })
    );

    // 結果を返す
    return NextResponse.json({
      message: `${notifications.length}件の通知を処理しました`,
      results,
    });
  } catch (error) {
    console.error('Error in send-notifications API:', error);
    return NextResponse.json(
      { error: '通知の送信処理に失敗しました' },
      { status: 500 }
    );
  }
}
