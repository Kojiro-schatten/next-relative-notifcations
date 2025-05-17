/**
 * Cloud Schedulerのエミュレーションスクリプト
 *
 * このスクリプトは、Cloud Schedulerの代わりに定期的に通知送信APIを呼び出します。
 * 実際の環境では、Cloud Schedulerを使用してCloud Functionsを直接呼び出します。
 *
 * 使用方法:
 * npx ts-node scripts/emulate-scheduler.ts
 */

import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config({ path: '.env.local' });

// 設定
const API_URL = 'http://localhost:3000/api/cron/send-notifications';
const API_SECRET_KEY = process.env.API_SECRET_KEY || 'default-secret-key';
const INTERVAL_MINUTES = 1; // 実行間隔（分）

// 通知送信APIを呼び出す関数
async function callNotificationAPI(): Promise<void> {
  try {
    console.log(`[${new Date().toISOString()}] 通知送信APIを呼び出します...`);

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_SECRET_KEY}`,
      },
    });

    const data = await response.json() as any;

    if (response.ok) {
      console.log(`[${new Date().toISOString()}] 成功:`, data.message);
      if (data.results && data.results.length > 0) {
        console.log('処理結果:');
        data.results.forEach((result: any) => {
          console.log(`- ${result.id}: ${result.status} - ${result.message}`);
        });
      }
    } else {
      console.error(`[${new Date().toISOString()}] エラー:`, data.error);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] 例外が発生しました:`, error);
  }
}

// 定期実行の設定
console.log(`[${new Date().toISOString()}] Cloud Schedulerエミュレーションを開始します...`);
console.log(`${INTERVAL_MINUTES}分ごとに通知送信APIを呼び出します。`);
console.log(`APIエンドポイント: ${API_URL}`);
console.log('Ctrl+Cで終了します。');

// 初回実行
callNotificationAPI();

// 定期実行
setInterval(callNotificationAPI, INTERVAL_MINUTES * 60 * 1000);
