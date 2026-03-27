import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function LikeButton({ postSlug }) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const storageKey = `liked_${postSlug}`;

  useEffect(() => {
    // 1. ローカルでの「いいね」済みチェック
    if (localStorage.getItem(storageKey)) {
      setHasLiked(true);
    }

    // 2. Firebase からいいね数を取得する処理
    const fetchLikes = async () => {
      // Firebaseが初期化されていない場合はダミーデータを返すためのガード
      if (!db) {
        setLikes(42); // プレビュー用のダミー件数
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'likes', postSlug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLikes(docSnap.data().count);
        } else {
          // ドキュメントが存在しない場合は0とする（クリック時に作成）
          setLikes(0);
        }
      } catch (error) {
        console.error("Failed to fetch likes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [postSlug, storageKey]);

  const handleLike = async () => {
    if (hasLiked || loading) return;

    // 即座にUIをアップデート（Optimistic UI更新）
    setHasLiked(true);
    setLikes((prev) => prev + 1);
    localStorage.setItem(storageKey, 'true');

    // Firebase 連携なしの場合はここで終了
    if (!db) return;

    try {
      const docRef = doc(db, 'likes', postSlug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          count: increment(1)
        });
      } else {
        await setDoc(docRef, {
          count: 1
        });
      }
    } catch (error) {
      console.error("Failed to update like:", error);
      // 通信エラー時はロールバックするなどの対応も可能
      // 今回はシンプルにログだけ吐く仕様
    }
  };

  return (
    <div className="like-button-container">
      <button 
        className={`like-button ${hasLiked ? 'liked' : ''}`}
        onClick={handleLike}
        disabled={hasLiked || loading}
        aria-label="Like this post"
      >
        <Heart 
          size={20} 
          fill={hasLiked ? "currentColor" : "none"} 
          className={hasLiked ? "liked" : ""}
        />
        <span>{loading ? "..." : likes}</span>
      </button>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        {hasLiked ? "Thanks for liking!" : "Did you like this post?"}
      </span>
    </div>
  );
}
