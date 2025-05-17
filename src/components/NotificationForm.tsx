'use client';

import { useState, FormEvent } from 'react';
import { NotificationFormData } from '@/types/notification';

interface NotificationFormProps {
  onSuccess?: (notificationId: string) => void;
}

export default function NotificationForm({ onSuccess }: NotificationFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [minutes, setMinutes] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // バリデーション
      if (!title.trim()) {
        throw new Error('タイトルを入力してください');
      }
      if (!body.trim()) {
        throw new Error('本文を入力してください');
      }
      if (minutes <= 0) {
        throw new Error('時間は正の数で指定してください');
      }

      // 通知データを作成
      const notificationData: NotificationFormData = {
        title: title.trim(),
        body: body.trim(),
        minutes,
      };

      // APIリクエスト
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '通知の登録に失敗しました');
      }

      const data = await response.json();

      // 成功メッセージを表示
      setSuccess(`通知を登録しました。${minutes}分後に通知が送信されます。`);

      // フォームをリセット
      setTitle('');
      setBody('');
      setMinutes(5);

      // 成功コールバックを呼び出し
      if (onSuccess) {
        onSuccess(data.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '通知の登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">通知登録</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="通知のタイトル"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
            本文
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="通知の本文"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">
            何分後に通知を送信しますか？
          </label>
          <input
            type="number"
            id="minutes"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            step="1"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? '送信中...' : '通知を登録'}
        </button>
      </form>
    </div>
  );
}
