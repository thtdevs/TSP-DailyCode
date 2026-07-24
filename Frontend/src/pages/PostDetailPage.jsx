import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Copy, Check, Code } from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching post:', err);
        setLoading(false);
      });
  }, [slug]);

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading article details...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Article Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>The post you are looking for does not exist.</p>
        <Link to="/" className="nav-btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Return to Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="container">
      <header className="post-header">
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to all articles
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
          {post.heading}
        </h1>
        <div className="post-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} /> By {post.createdBy?.username || 'Admin'}
          </span>
        </div>
      </header>

      <div className="post-body">
        {post.blocks && post.blocks.length > 0 ? (
          post.blocks.map((block, idx) => {
            if (block.type === 'text') {
              return (
                <div key={idx} className="block-text">
                  {block.content}
                </div>
              );
            }
            if (block.type === 'image') {
              return (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <img
                    src={block.url}
                    alt={post.heading}
                    className="block-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              );
            }
            if (block.type === 'code') {
              return (
                <div key={idx} className="block-code-container">
                  <div className="code-header">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Code size={16} /> {block.language || 'code'}
                    </span>
                    <button
                      onClick={() => handleCopyCode(block.content, idx)}
                      className="copy-btn"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check size={14} style={{ color: '#10b981' }} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="code-content">
                    <code>{block.content}</code>
                  </pre>
                </div>
              );
            }
            return null;
          })
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>This article has no content blocks.</p>
        )}
      </div>
    </article>
  );
}
