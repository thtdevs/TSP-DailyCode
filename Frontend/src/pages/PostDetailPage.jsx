import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Copy, Check, Code, Clock, Share2, ArrowUp, Sparkles } from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [shared, setShared] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.heading,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const calculateReadTime = (blocks) => {
    if (!blocks || blocks.length === 0) return '2 min read';
    const totalWords = blocks.reduce((acc, block) => {
      if (block.content) {
        return acc + block.content.trim().split(/\s+/).length;
      }
      return acc;
    }, 0);
    const minutes = Math.max(1, Math.ceil(totalWords / 180));
    return `${minutes} min read`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', maxWidth: '860px' }}>
        <div className="skeleton" style={{ height: '30px', width: '200px', marginBottom: '2rem' }}></div>
        <div className="skeleton" style={{ height: '56px', width: '100%', marginBottom: '1.5rem' }}></div>
        <div className="skeleton" style={{ height: '24px', width: '300px', marginBottom: '3rem' }}></div>
        <div className="skeleton" style={{ height: '200px', width: '100%', marginBottom: '2rem' }}></div>
        <div className="skeleton" style={{ height: '150px', width: '100%' }}></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Article Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
            The requested solution post does not exist or may have been removed.
          </p>
          <Link to="/" className="nav-btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Return to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="container" style={{ maxWidth: '920px' }}>
      {/* Header */}
      <header className="post-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to all articles
          </Link>
          
          <button onClick={handleShare} className="copy-btn">
            {shared ? <Check size={14} style={{ color: '#10b981' }} /> : <Share2 size={14} />}
            {shared ? 'Link Copied!' : 'Share Article'}
          </button>
        </div>

        <div className="club-pill-tag" style={{ marginBottom: '1rem' }}>
          <Sparkles size={13} /> The HIT Times • TSP Daily Code
        </div>

        <h1 className="post-title">{post.heading}</h1>

        <div className="post-meta">
          <div className="meta-badge">
            <Calendar size={14} />
            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>

          <div className="meta-badge">
            <User size={14} />
            By {post.createdBy?.username || 'The HIT Times'}
          </div>

          <div className="meta-badge">
            <Clock size={14} />
            {calculateReadTime(post.blocks)}
          </div>
        </div>
      </header>

      {/* Article Body */}
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
                <div key={idx} className="block-image-container">
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
              const lineCount = block.content ? block.content.split('\n').length : 1;
              return (
                <div key={idx} className="block-code-container">
                  <div className="code-header">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Code size={16} />
                      <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {block.language || 'code'}
                      </span>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 400 }}>
                        ({lineCount} lines)
                      </span>
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
                          <Copy size={14} /> Copy Snippet
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

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button 
          onClick={scrollToTop} 
          className="back-to-top-btn" 
          aria-label="Back to top"
          title="Back to Top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </article>
  );
}
