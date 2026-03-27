// Firebaseの初期化設定
// ※実際にお客様側でFirebaseプロジェクトを作成後、以下の設定値を書き換えてください。
// 利用サービス: Firestore (いいね数の保存)

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDCoBqGFLaPu1oagVZUyRK4d01HIlBPEtE",
  authDomain: "for-my-blog-5d592.firebaseapp.com",
  projectId: "for-my-blog-5d592",
  storageBucket: "for-my-blog-5d592.firebasestorage.app",
  messagingSenderId: "1050507099015",
  appId: "1:1050507099015:web:2f479896ae553338c0b122",
  measurementId: "G-3HCXJXFRDM"
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
