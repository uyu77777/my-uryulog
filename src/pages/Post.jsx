import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import LikeButton from '../components/LikeButton';

export default function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // public/posts/{slug}.md を動的にFetchして読み込む
    fetch(`/posts/${slug}.md`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Post not found');
        }
        return res.text();
      })
      .then(text => {
        // もしHTMLが返ってきている場合（Not Foundページの代替など）、エラーにする
        if (text.trim().startsWith('<!DOCTYPE html>')) {
           throw new Error('Not a markdown file');
        }
        setContent(text);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching post:", error);
        setContent('# Post Not Found\nSorry, the post you are looking for does not exist.');
        setLoading(false);
      });
  }, [slug]);

  return (
    <Layout>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading...</div>
      ) : (
        <article>
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              marginBottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            ← Back
          </button>
          
          <div className="markdown-body">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          
          {/* PostNotFoundエラー用メッセージじゃない時だけLikedボタンを表示 */}
          {!content.includes('Post Not Found') && (
            <LikeButton postSlug={slug} />
          )}
        </article>
      )}
    </Layout>
  );
}
