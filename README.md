# 相対時間通知システム

Next.js, Firestore DB, Google Cloud Scheduler, Cloud Functionsを利用した相対時間による通知システムのサンプル実装です。

## 機能

- WEB側で時間を指定して通知を登録
- 指定した時間後にデスクトップ通知が届く
- Firestoreでデータを管理
- Cloud Schedulerで1分ごとに通知をチェック
- Cloud Functionsで通知を送信

## 技術スタック

- **フロントエンド**: Next.js, React, TailwindCSS
- **バックエンド**: Firebase (Firestore, Cloud Functions)
- **通知**: Web Push API
- **スケジューリング**: Google Cloud Scheduler

## セットアップ

### 1. 環境変数の設定

`.env.local`ファイルに必要な環境変数を設定します。

```
# Firebase Client SDK設定
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK設定
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# API認証用シークレットキー
API_SECRET_KEY=your-secret-key

# Web Push通知設定
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

### 4. スケジューラーエミュレーションの実行（別ターミナルで）

```bash
npm run emulate-scheduler
```

## 使い方

1. ブラウザで http://localhost:3000 にアクセス
2. 通知の許可を求められたら「許可」をクリック
3. フォームに通知のタイトル、本文、何分後に通知するかを入力
4. 「通知を登録」ボタンをクリック
5. 指定した時間後に通知が届きます

## 実装の詳細

### フロントエンド

- `src/app/page.tsx`: メインページ
- `src/components/NotificationForm.tsx`: 通知登録フォーム
- `src/utils/webPush.ts`: Web Push通知のユーティリティ関数

### バックエンド

- `src/app/api/notifications/route.ts`: 通知登録API
- `src/app/api/send-notifications/route.ts`: 通知送信API
- `src/app/api/cron/send-notifications/route.ts`: Cloud Schedulerエミュレーション用API

### データモデル

- `src/types/notification.ts`: 通知関連の型定義

### Firebase設定

- `src/lib/firebase.ts`: Firebaseクライアント設定
- `src/lib/firebase-admin.ts`: Firebase Admin設定

### Service Worker

- `public/service-worker.js`: Web Push通知用のService Worker

## 本番環境へのデプロイ

実際の本番環境では、以下の手順でデプロイします。

1. Firebaseプロジェクトの作成
2. Firestoreデータベースの設定
3. Cloud Functionsのデプロイ
4. Cloud Schedulerの設定
5. Next.jsアプリケーションのデプロイ

詳細な手順については、各サービスの公式ドキュメントを参照してください。

## ライセンス

MIT
