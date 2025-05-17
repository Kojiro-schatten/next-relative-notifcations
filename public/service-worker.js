// Service Worker for Web Push Notifications

// Service Workerのインストール時の処理
self.addEventListener("install", () => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

// Service Workerのアクティベート時の処理
self.addEventListener("activate", () => {
  console.log("Service Worker activated");
  return self.clients.claim();
});

// プッシュ通知を受信した時の処理
self.addEventListener("push", (event) => {
  if (!event.data) {
    console.log("Push event but no data");
    return;
  }

  try {
    // 通知データを取得
    const data = event.data.json();

    // 通知オプションを設定
    const options = {
      body: data.body || "お知らせがあります",
      icon: "/notification-icon.png", // アイコンがあれば設定
      badge: "/notification-badge.png", // バッジがあれば設定
      data: {
        url: data.url || "/", // クリック時に開くURL
      },
      vibrate: [100, 50, 100], // バイブレーションパターン
      timestamp: data.timestamp || Date.now(),
    };

    // 通知を表示
    event.waitUntil(
      self.registration.showNotification(data.title || "通知", options)
    );
  } catch (error) {
    console.error("Error showing notification:", error);
  }
});

// 通知がクリックされた時の処理
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // 通知データからURLを取得
  const url = event.notification.data?.url || "/";

  // クリック時にアプリを開く
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // すでに開いているウィンドウがあれば、それをフォーカス
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      // 開いているウィンドウがなければ、新しいウィンドウを開く
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
