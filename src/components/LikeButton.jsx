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
        setLikes(0); // 変更：プレビュー時の初期値を0に
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
    if (loading) return;

    const isLiking = !hasLiked; // これから「いいね」するか、「取り消し」するか

    // UIを即座に更新 (Optimistic Update)
    setHasLiked(isLiking);
    setLikes((prev) => (isLiking ? prev + 1 : prev - 1));
    
    if (isLiking) {
      localStorage.setItem(storageKey, 'true');
    } else {
      localStorage.removeItem(storageKey);
    }

    if (!db) return;

    try {
      const docRef = doc(db, 'likes', postSlug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          // 増やすときは1、減らすときは-1
          count: increment(isLiking ? 1 : -1)
        });
      } else if (isLiking) {
        // 取り消しの時点では存在しているはずだが、念のための作成処理
        await setDoc(docRef, {
          count: 1
        });
      }
    } catch (error) {
      console.error("Failed to update like:", error);
      // エラー時はロールバック
      setHasLiked(!isLiking);
      setLikes((prev) => (isLiking ? prev - 1 : prev + 1));
      if (!isLiking) {
        localStorage.setItem(storageKey, 'true');
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  };

  return (
    <div className="like-button-container">
      <button 
        className={`like-button ${hasLiked ? 'liked' : ''}`}
        onClick={handleLike}
        disabled={loading} // hasLikedによるDisabledを解除
        aria-label={hasLiked ? "Unlike this post" : "Like this post"}
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
