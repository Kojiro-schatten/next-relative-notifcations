import { NextRequest, NextResponse } from 'next/server';
import { scheduleNotification } from '@/utils/notification';
import { NotificationFormData } from '@/types/notification';

// POST: 通知を登録するAPI
export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await request.json();

    // バリデーション
    if (!body.title || !body.body || body.minutes === undefined) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // 相対時間（分）が正の数であることを確認
    if (typeof body.minutes !== 'number' || body.minutes <= 0) {
      return NextResponse.json(
        { error: '時間は正の数で指定してください' },
        { status: 400 }
      );
    }

    // 通知データを作成
    const notificationData: NotificationFormData = {
      title: body.title,
      body: body.body,
      minutes: body.minutes,
    };

    // 通知を登録
    const notificationId = await scheduleNotification(notificationData);

    // 成功レスポンスを返す
    return NextResponse.json({ id: notificationId }, { status: 201 });
  } catch (error) {
    console.error('Error in notifications API:', error);
    return NextResponse.json(
      { error: '通知の登録に失敗しました' },
      { status: 500 }
    );
  }
}

// GET: 登録済みの通知を取得するAPI（必要に応じて実装）
