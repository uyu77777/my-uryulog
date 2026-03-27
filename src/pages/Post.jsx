import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import LikeButton from '../components/LikeButton';

export default function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [postMeta, setPostMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 記事データとメタデータ（日付など）を並行して取得
    const fetchContent = fetch(`${import.meta.env.BASE_URL}posts/${slug}.md`)
      .then(res => {
        if (!res.ok) throw new Error('Post not found');
        return res.text();
      });

    const fetchMeta = fetch(`${import.meta.env.BASE_URL}posts/manifest.json`)
      .then(res => res.json())
      .then(data => data.find(p => p.slug === slug));

    Promise.all([fetchContent, fetchMeta])
      .then(([text, meta]) => {
        // もしHTMLが返ってきている場合（Not Foundページの代替など）、エラーにする
        if (text.trim().startsWith('<!DOCTYPE html>')) {
           throw new Error('Not a markdown file');
        }
        setContent(text);
        setPostMeta(meta);
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
            className="back-button"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          
          <div className="markdown-body">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => (
                  <div style={{ marginBottom: '24px' }}>
                    <h1 {...props} style={{ marginTop: 0, marginBottom: '8px' }} />
                    {postMeta && postMeta.date && (
                      <time 
                        style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}
                        dateTime={postMeta.date}
                      >
                        {new Date(postMeta.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    )}
                  </div>
                )
              }}
            >
              {content}
            </ReactMarkdown>
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
