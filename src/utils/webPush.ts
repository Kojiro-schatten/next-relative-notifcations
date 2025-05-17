'use client';

// Web Push APIを使用するためのユーティリティ関数

// 通知の許可を要求する関数
export async function requestNotificationPermission(): Promise<boolean> {
  // ブラウザが通知をサポートしているか確認
  if (!('Notification' in window)) {
    console.error('このブラウザは通知をサポートしていません');
    return false;
  }

  // すでに許可されている場合
  if (Notification.permission === 'granted') {
    return true;
  }

  // 許可されていない場合は許可を要求
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// 通知を表示する関数
export function showNotification(title: string, options?: NotificationOptions): Notification | null {
  // ブラウザが通知をサポートしているか確認
  if (!('Notification' in window)) {
    console.error('このブラウザは通知をサポートしていません');
    return null;
  }

  // 通知の許可が得られているか確認
  if (Notification.permission !== 'granted') {
    console.error('通知の許可が得られていません');
    return null;
  }

  // 通知を表示
  try {
    return new Notification(title, options);
  } catch (error) {
    console.error('通知の表示に失敗しました:', error);
    return null;
  }
}

// サービスワーカーを登録する関数
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  console.error('このブラウザはService Workerをサポートしていません');
  return null;
}
