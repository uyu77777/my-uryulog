import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 記事一覧を取得（publicフォルダのmanifest.jsonから取得）
    // 本来の静的サイトジェネレータではビルド時に行いますが、
    // 今回は完全静的ファイル構成のまま動的なFetchで実現します。
    // Viteの環境変数を用いて相対パスになるよう調整
    fetch(`${import.meta.env.BASE_URL}posts/manifest.json`)
      .then(res => {
        if (!res.ok) throw new Error("Manifest not found");
        return res.json();
      })
      .then(data => {
        // 日付の降順でソート
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(sorted);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to load posts:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="post-header">
        <h1>Uryu.log</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Thoughts, learnings, and experiments.
        </p>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="post-list">
          {posts.map(post => (
            <Link to={`/post/${post.slug}`} className="post-card" key={post.slug}>
              <div className="post-date">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-excerpt">{post.excerpt}</p>
            </Link>
          ))}
          {posts.length === 0 && <p>No posts available.</p>}
        </div>
      )}
    </Layout>
  );
}
