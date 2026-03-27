// Firebaseの初期化設定
// ※実際にお客様側でFirebaseプロジェクトを作成後、以下の設定値を書き換えてください。
// 利用サービス: Firestore (いいね数の保存)

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// initializeApp の呼び出しを try-catch で囲むことで、仮の設定値のまま起動しても
// クラッシュを防ぐ処置を入れています。
let app;
let db;

try {
  // 初期化可能かテスト（設定が無効な場合はエラーになります）
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Firebase is not fully configured.", error);
}

export { db };
