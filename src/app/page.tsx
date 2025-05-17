'use client';

import { useEffect, useState } from 'react';
import NotificationForm from '@/components/NotificationForm';
import { requestNotificationPermission } from '@/utils/webPush';

export default function Home() {
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsClient(true);

    // 現在の通知許可状態を取得
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // 通知の許可を要求
  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationPermission('granted');
    } else {
      setNotificationPermission(Notification.permission);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">相対時間通知システム</h1>
          <p className="text-lg text-gray-600">
            指定した時間後にデスクトップ通知を受け取ることができます
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">通知の設定</h2>

            {isClient && (
              <>
                {notificationPermission !== 'granted' ? (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-700 mb-3">
                      通知を受け取るには、ブラウザの通知許可が必要です。
                    </p>
                    <button
                      onClick={handleRequestPermission}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                      通知を許可する
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700">
                      通知が許可されています。通知を登録すると、指定した時間後に通知が届きます。
                    </p>
                  </div>
                )}
              </>
            )}

            <NotificationForm />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">使い方</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>通知を許可する（初回のみ）</li>
              <li>通知のタイトルと本文を入力</li>
              <li>何分後に通知を受け取るか指定</li>
              <li>「通知を登録」ボタンをクリック</li>
              <li>指定した時間後に通知が届きます</li>
            </ol>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-lg font-medium text-blue-700 mb-2">仕組み</h3>
              <p className="text-blue-700">
                このアプリは、Next.js, Firestore, Cloud Functions, Cloud Schedulerを使用しています。
                登録された通知はFirestoreに保存され、Cloud Schedulerが1分ごとに実行されて、
                送信予定の通知をチェックし、Web Push APIを使用して通知を送信します。
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
